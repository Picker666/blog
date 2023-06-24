# qiankun 核心源码解读

## registerMicroApps

```js
export function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: FrameworkLifeCycles<T>,
) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter((app) => !microApps.some((registeredApp) => registeredApp.name === app.name));

  microApps = [...microApps, ...unregisteredApps];

  unregisteredApps.forEach((app) => {
    const { name, activeRule, loader = noop, props, ...appConfig } = app;

    // registerApplication 是 single-spa 的注册方法，但是每次只能注册一个子应用
    registerApplication({
      name,
      app: async () => { // app 方法将在子应用加载时候执行，返回结果，mount将在 single-spa 中执行
        loader(true); //  将loader设为true
        await frameworkStartedDefer.promise; // 等待 frameworkStartedDefer resolve，而 frameworkStartedDefer 在start方法中 resolve 了

        const { mount, ...otherMicroAppConfigs } = (
          await loadApp({ name, props, ...appConfig }, frameworkConfiguration, lifeCycles)
        )(); // 执行 loaderApp ，获取返回结果，并执行结果

        return {
          mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
          ...otherMicroAppConfigs,
        };
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}
```

## loadApp

[loadApp 解读](/sourceAnalysis/loadApp.html)

## frameworkStartedDefer

```js
export class Deferred<T> {
  promise: Promise<T>;

  resolve!: (value: T | PromiseLike<T>) => void;

  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const frameworkStartedDefer = new Deferred<void>();

/**
 * frameworkStartedDefer: {promise,resolve, reject}, 并且状态为pending
 * 
 * resolve之后状态改为 fulfilled
 * reject之后状态改为 rejected
*/
```

## start

```js
export function start(opts: FrameworkConfiguration = {}) {
  frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
  const { prefetch, urlRerouteOnly = defaultUrlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;

  if (prefetch) {
    // 预加载策略
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }
  // 关于低版本的浏览器，操作将会降级
  frameworkConfiguration = autoDowngradeForLowVersionBrowser(frameworkConfiguration);
  // 执行 single-spa 的start() 方法
  startSingleSpa({ urlRerouteOnly });
  started = true;

  // 将 frameworkStartedDefer 的 promise 状态改为 resolve，这也就是限制了 注册子应用中 app方法的执行
  frameworkStartedDefer.resolve();
}
```

## doPrefetchStrategy 预加载策略

[预加载策略](/sourceAnalysis/qiankunPrefetch.html)

## 浏览器降价 - autoDowngradeForLowVersionBrowser

```js
const autoDowngradeForLowVersionBrowser = (configuration: FrameworkConfiguration): FrameworkConfiguration => {
  const { sandbox = true, singular } = configuration;
  if (sandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Missing window.Proxy, proxySandbox will degenerate into snapshotSandbox');

      if (singular === false) { // 如果不是单例模式，将发出警告，
        console.warn
          '[qiankun] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy',
        );
      }
    //  Proxy 不存在 将设置 loose：true - 使用SnapshotSandbox 快照沙箱
      return { ...configuration, sandbox: typeof sandbox === 'object' ? { ...sandbox, loose: true } : { loose: true } };
    }

    if (
      !isConstDestructAssignmentSupported() &&
      (sandbox === true || (typeof sandbox === 'object' && sandbox.speedy !== false))
    ) {
      console.warn(
        '[qiankun] Speedy mode will turn off as const destruct assignment not supported in current browser!',
      );
// 不支持const将会取消沙箱敏捷模式
      return {
        ...configuration,
        sandbox: typeof sandbox === 'object' ? { ...sandbox, speedy: false } : { speedy: false },
      };
    }
  }

  return configuration;
};
```

就是根据当前环境进行沙箱配置。
