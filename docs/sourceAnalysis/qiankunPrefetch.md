# qiankun 预加载策略

具体使用哪种策略要根据我们传入的参数：true、all、string[],function(apps){}

```js
export function doPrefetchStrategy(
  apps: AppMetadata[],
  prefetchStrategy: PrefetchStrategy,
  importEntryOpts?: ImportEntryOpts,
) {
  const appsName2Apps = (names: string[]): AppMetadata[] => apps.filter((app) => names.includes(app.name));

  // 数组 - 第一次渲染完成（监听 single-spa 中自定义事件 single-spa:first-mount）之后 执行预加载
  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy as string[]), importEntryOpts);
  } else if (isFunction(prefetchStrategy)) {
    // function 策略根据返回值执行预加载
    (async () => {
      // critical rendering apps would be prefetch as earlier as possible
      const { criticalAppNames = [], minorAppsName = [] } = await prefetchStrategy(apps);
      prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts); // 立即执行的预加载
      prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts); // 第一次渲染后执行预加载
    })();
  } else {
    switch (prefetchStrategy) {
      case true: // true - 第一次渲染后执行预加载
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all': // all - 立即执行的预加载
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}
```

```js
// 默认使用 requestIdleCallback，不存在时候使用 setTimeout实现
const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb: CallableFunction) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

function prefetch(entry: Entry, opts?: ImportEntryOpts): void {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

// 利用 requestIdleCallback 加载资源 外链的style和scripts
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}

function prefetchAfterFirstMounted(apps: AppMetadata[], opts?: ImportEntryOpts): void {
  // 监听 single-spa中的single-spa:first-mount事件
  window.addEventListener('single-spa:first-mount', function listener() {
    const notLoadedApps = apps.filter((app) => getAppStatus(app.name) === NOT_LOADED);

    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
    }
// 执行预加载
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));
// 移除监听
    window.removeEventListener('single-spa:first-mount', listener);
  });
}

export function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }
// 立即执行预加载
  apps.forEach(({ entry }) => prefetch(entry, opts));
}
```
