# qiankun - loadApp

```js
export async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration: FrameworkConfiguration = {},
  lifeCycles?: FrameworkLifeCycles<T>,
): Promise<ParcelConfigObjectGetter> {
  const { entry, name: appName } = app;
  const appInstanceId = genAppInstanceIdByName(appName);

  const markName = `[qiankun] App ${appInstanceId} Loading`;
  if (process.env.NODE_ENV === 'development') {
    performanceMark(markName);
  }

  const {
    singular = false,
    sandbox = true,
    excludeAssetFilter,
    globalContext = window,
    ...importEntryOpts
  } = configuration;

  // get the entry html content and script executor
  /**
   * 通过入口 获取到入口的html（包含js和css）
   * template 会注释掉外链的html
   * execScripts 是用户引入的js
   */
  const { template, execScripts, assetPublicPath, getExternalScripts } = await importEntry(entry, importEntryOpts);
  // trigger external scripts loading to make sure all assets are ready before execScripts calling
  await getExternalScripts();

  // as single-spa load and bootstrap new app parallel with other apps unmounting
  // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
  // we need wait to load the app until all apps are finishing unmount in singular mode
  // 单例模式，等上个应用卸载完成
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }

  // 将head变标签替换成qiankun的head，并增加div标签包括
  const appContent = getDefaultTplWrapper(appInstanceId, sandbox)(template);

  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;// shadow dom

  if (process.env.NODE_ENV === 'development' && strictStyleIsolation) {
    console.warn(
      "[qiankun] strictStyleIsolation configuration will be removed in 3.0, pls don't depend on it or use experimentalStyleIsolation instead!",
    );
  }

  const scopedCSS = isEnableScopedCSS(sandbox);// 实验性的样式隔离特性
  // strictStyleIsolation：true - 创建shadowDOM
  // scopedCSS: true - 为每个样式添加前缀div[data-qiankun="appInstanceId"]
  let initialAppWrapperElement: HTMLElement | null = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appInstanceId,
  );

  const initialContainer = 'container' in app ? app.container : undefined;
  const legacyRender = 'render' in app ? app.render : undefined;

  const render = getRender(appInstanceId, appContent, legacyRender);

  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕
  // 将 element 添加到 container内
  render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, 'loading');

  // 如果是个shadow,需要拿到shadow中的DOM， shadow的根
  const initialAppWrapperGetter = getAppWrapperGetter(
    appInstanceId,
    !!legacyRender,
    strictStyleIsolation,
    scopedCSS,
    () => initialAppWrapperElement,
  );

  let global = globalContext;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  const useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;
  // enable speedy mode by default
  const speedySandbox = typeof sandbox === 'object' ? sandbox.speedy !== false : true;
  let sandboxContainer;
  if (sandbox) {
    // 创建沙箱
    sandboxContainer = createSandboxContainer(
      appInstanceId,
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
      initialAppWrapperGetter,
      scopedCSS,
      useLooseSandbox,
      excludeAssetFilter,
      global,
      speedySandbox,
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxContainer.instance.proxy as typeof window;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }

  // 生命周期的合并 在我们出入的生命周期lifeCycles的基础上合并上 __POWERED_BY_QIANKUN__ 和 __INJECTED_PUBLIC_PATH_BY_QIANKUN__ 的设置，分别在beforeLoad、beforeMount和beforeUnmount
  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));

  //先执行beforeLoad
  await execHooksChain(toArray(beforeLoad), app, global);

  // get the lifecycle hooks from module exports
  // 执行用户脚本，将global作为新的window
  const scriptExports: any = await execScripts(global, sandbox && !useLooseSandbox, {
    scopedGlobalVariables: speedySandbox ? cachedGlobals : [],
  });

  // 获取生命周期的导出结果，也就是用户的导出协议
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global,
    sandboxContainer?.instance?.latestSetProp,
  );

  // 提供全局状态管理
  const { onGlobalStateChange, setGlobalState, offGlobalStateChange }: Record<string, CallableFunction> =
    getMicroAppStateActions(appInstanceId);

  // FIXME temporary way
  const syncAppWrapperElement2Sandbox = (element: HTMLElement | null) => (initialAppWrapperElement = element);

  // 返回的方法
  const parcelConfigGetter: ParcelConfigObjectGetter = (remountContainer = initialContainer) => {
    let appWrapperElement: HTMLElement | null;
    let appWrapperGetter: ReturnType<typeof getAppWrapperGetter>;

    const parcelConfig: ParcelConfigObject = {
      name: appInstanceId,
      bootstrap,
      mount: [
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const marks = performanceGetEntriesByName(markName, 'mark');
            // mark length is zero means the app is remounting
            if (marks && !marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            return prevAppUnmountedDeferred.promise;
          }

          return undefined;
        },
        // initial wrapper element before app mount/remount
        async () => {
          appWrapperElement = initialAppWrapperElement;
          appWrapperGetter = getAppWrapperGetter(
            appInstanceId,
            !!legacyRender,
            strictStyleIsolation,
            scopedCSS,
            () => appWrapperElement,
          );
        },
        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
        async () => {
          const useNewContainer = remountContainer !== initialContainer;
          if (useNewContainer || !appWrapperElement) {
            // element will be destroyed after unmounted, we need to recreate it if it not exist
            // or we try to remount into a new container
            appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appInstanceId);
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }

          render({ element: appWrapperElement, loading: true, container: remountContainer }, 'mounting');
        },
        mountSandbox,// 启动沙箱
        // exec the chain after rendering to keep the behavior with beforeLoad
        async () => execHooksChain(toArray(beforeMount), app, global),// 执行beforeMount
        async (props) => mount({ ...props, container: appWrapperGetter(), setGlobalState, onGlobalStateChange }),// 调用mount
        // finish loading after app mounted
        async () => render({ element: appWrapperElement, loading: false, container: remountContainer }, 'mounted'),// 调用mounted
        async () => execHooksChain(toArray(afterMount), app, global),// 执行 afterMount
        // initialize the unmount defer after app mounted and resolve the defer after it unmounted
        async () => {
          if (await validateSingularMode(singular, app)) {
            prevAppUnmountedDeferred = new Deferred<void>();//如果是单例，创建promise，
          }
        },
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appInstanceId} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],
      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),//执行beforeUnmount
        async (props) => unmount({ ...props, container: appWrapperGetter() }),// 执行unmount
        unmountSandbox,// 取消沙箱
        async () => execHooksChain(toArray(afterUnmount), app, global),// 执行 afterUnmount
        async () => {
          render({ element: null, loading: false, container: remountContainer }, 'unmounted'); // 清理container下的元素
          offGlobalStateChange(appInstanceId);// 关闭全局状态管理监听
          // for gc
          appWrapperElement = null;
          syncAppWrapperElement2Sandbox(appWrapperElement);
        },
        async () => {// 应用卸载完毕之后，会把应用卸载，表示卸载完成可以载新的应用
          if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
            prevAppUnmountedDeferred.resolve();
          }
        },
      ],
    };

    if (typeof update === 'function') {
      parcelConfig.update = update;
    }

    return parcelConfig;
  };

  return parcelConfigGetter;
}
```

总结loadApp 的作用：

* 1、加载子应用的 html，并处理外链 css 和 script；
* 2、处理模版（替换head，添加div包裹），样式处理（shadow dom 或者 添加前缀）；
* 3、将子应用元素添加到容器；
* 4、沙箱创建；
* 5、基座生命周期合并主要是内置一些常量（__POWERED_BY_QIANKUN__ 和 __INJECTED_PUBLIC_PATH_BY_QIANKUN__）；
* 6、子应用的生命周期导出；
* 7、返回一个方法，主要是mount和unmount方法，执行预先约定的生命周期（基座和子应用）。
