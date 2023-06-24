# 沙箱

先看一段源码:

```js
export function createSandboxContainer(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  scopedCSS: boolean,
  useLooseSandbox?: boolean,
  excludeAssetFilter?: (url: string) => boolean,
  globalContext?: typeof window,
  speedySandBox?: boolean,
) {
  let sandbox: SandBox;
  if (window.Proxy) {
    sandbox = useLooseSandbox
      ? new LegacySandbox(appName, globalContext)
      : new ProxySandbox(appName, globalContext, { speedy: !!speedySandBox });
  } else {
    sandbox = new SnapshotSandbox(appName);
  }

  ......
}
```

创建沙箱的方法中一共有三种方式：

* 1、SnapshotSandbox - 快照沙箱：不支持 window.Proxy 的环境，支持单例
* 2、LegacySandbox - 传统沙箱：使用window.Proxy 实现，需要遍历window实现，支持单例
* 3、ProxySandbox - 代理沙箱：使用window.Proxy 实现，创建自己的 fakeWindow ，支持多例

## 1、SnapshotSandbox

```js

function iter(obj: typeof window, callbackFn: (prop: any) => void) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in obj) {
    // patch for clearInterval for compatible reason, see #1490
    if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
      callbackFn(prop);
    }
  }
}

/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox implements SandBox {
  proxy: WindowProxy;
  name: string;
  type: SandBoxType;
  sandboxRunning = true;
  private windowSnapshot!: Window;
  private modifyPropsMap: Record<any, any> = {};
  constructor(name: string) {
    this.name = name;
    this.proxy = window;
    this.type = SandBoxType.Snapshot;
  }
  active() {
    // 记录当前快照
    this.windowSnapshot = {} as Window;
    iter(window, (prop) => {
      // 保存window对象上的属性到快照中
      this.windowSnapshot[prop] = window[prop];
    });

    // 恢复之前的变更到window中
    Object.keys(this.modifyPropsMap).forEach((p: any) => {
      window[p] = this.modifyPropsMap[p];
    });

    this.sandboxRunning = true;
  }

  inactive() {
    this.modifyPropsMap = {};

    iter(window, (prop) => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 记录变更
        this.modifyPropsMap[prop] = window[prop];
        // 恢复环境
        window[prop] = this.windowSnapshot[prop];
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} origin window restore...`, Object.keys(this.modifyPropsMap));
    }

    this.sandboxRunning = false;
  }

  patchDocument(): void {}
}
```

缺点：

* 1、需要遍历window上的所有属性，性能差；
* 2、同时间内只能激活一个微应用

## 2、legacySandbox

传统沙箱三个关键变量:

* 1、addedPropsMapInSandbox: 记录沙箱新增的全局变量;
* 2、modifiedPropsOriginalValueMapInSandbox: 记录沙箱更新的全局变量,记录旧值；
* 3、currentUpdatePropsValueMap 用于在任意时刻做snapshot

```js
private setWindowProp(prop: PropertyKey, value: any, toDelete?: boolean) {
  if (value === undefined && toDelete) {
    // eslint-disable-next-line no-param-reassign
    delete (this.globalContext as any)[prop];
  } else if (isPropConfigurable(this.globalContext, prop) && typeof prop !== 'symbol') {
    Object.defineProperty(this.globalContext, prop, { writable: true, configurable: true });
    // eslint-disable-next-line no-param-reassign
    (this.globalContext as any)[prop] = value;
  }
}

active() {
  if (!this.sandboxRunning) {
    // 遍历变更Map 更新到window
    this.currentUpdatedPropsValueMap.forEach((v, p) => this.setWindowProp(p, v));
  }

  this.sandboxRunning = true;
}

inactive() {
  // 遍历 更改时记录的的属性原始值，还原window的值
  this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => this.setWindowProp(p, v));
  // 遍历 添加的属性，从window中删除
  this.addedPropsMapInSandbox.forEach((_, p) => this.setWindowProp(p, undefined, true));

  this.sandboxRunning = false;
}
```

如何更新 以上三个关键值；

```js
this.proxy = new Proxy(fakeWindow, {
  set: (_: Window, p: PropertyKey, value: any): boolean => {
    const originalValue = (rawWindow as any)[p];
    return setTrap(p, value, originalValue, true);
  },

  get(_: Window, p: PropertyKey): any {
    // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
    // or use window.top to check if an iframe context
    // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
    if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
      return proxy;
    }

    const value = (rawWindow as any)[p];
    return getTargetValue(rawWindow, value);
  },

  // trap in operator
  // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
  has(_: Window, p: string | number | symbol): boolean {
    return p in rawWindow;
  },

  getOwnPropertyDescriptor(_: Window, p: PropertyKey): PropertyDescriptor | undefined {
    const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
    // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
    if (descriptor && !descriptor.configurable) {
      descriptor.configurable = true;
    }
    return descriptor;
  },

  defineProperty(_: Window, p: string | symbol, attributes: PropertyDescriptor): boolean {
    const originalValue = (rawWindow as any)[p];
    const done = Reflect.defineProperty(rawWindow, p, attributes);
    const value = (rawWindow as any)[p];
    setTrap(p, value, originalValue, false);

    return done;
  },
});
this.proxy = proxy;

```

借助 Proxy 定义沙箱实例的一些方法，set、get、has、getOwnPropertyDescriptor、defineProperty，在这些方法更改window的值的同时，记录了更改的属性，属性的旧值...

缺点：

* 1、还是改变window的值，只不过在失活的时候还原回去了；
* 2、只能支持单例；

优点：

* 1、只需要遍历发生变化的值，性能有所提升；

## 3、ProxySandbox

```js
active() {
  if (!this.sandboxRunning) activeSandboxCount++;
  this.sandboxRunning = true;
}

inactive() {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
      ...this.updatedValueSet.keys(),
    ]);
  }

  if (inTest || --activeSandboxCount === 0) {
    // reset the global value to the prev value
    Object.keys(this.globalWhitelistPrevDescriptor).forEach((p) => {
      const descriptor = this.globalWhitelistPrevDescriptor[p];
      if (descriptor) {
        Object.defineProperty(this.globalContext, p, descriptor);
      } else {
        // @ts-ignore
        delete this.globalContext[p];
      }
    });
  }

  this.sandboxRunning = false;
}

constructor(name: string, globalContext = window, opts?: { speedy: boolean }) {
  this.name = name;
  this.globalContext = globalContext;
  this.type = SandBoxType.Proxy;
  const { updatedValueSet } = this;
  const { speedy } = opts || {};
// 复制出window对象中不可以更改的对象
  const { fakeWindow, propertiesWithGetter } = createFakeWindow(globalContext, !!speedy);

  const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();

  const proxy = new Proxy(fakeWindow, {
    set: (target: FakeWindow, p: PropertyKey, value: any): boolean => {
      if (this.sandboxRunning) {
        // 注册当前子应用
        this.registerRunningApp(name, proxy);
        // 如果 FakeWindow中不存在p，但是全局对象中存在，从全局拿到对象的descriptor，并根据此将p更新到FakeWindow
        if (!target.hasOwnProperty(p) && globalContext.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(globalContext, p);
          const { writable, configurable, enumerable, set } = descriptor!;
          if (writable || set) {
            Object.defineProperty(target, p, { configurable, enumerable, writable: true, value });
          }
        } else {
          // 如果 FakeWindow 中存在，则直接更新
          target[p] = value;
        }

        // 如果 p 是字符串，并且在白名单范围内，可以更新到 全局 window
        if (typeof p === 'string' && globalVariableWhiteList.indexOf(p) !== -1) {
          this.globalWhitelistPrevDescriptor[p] = Object.getOwnPropertyDescriptor(globalContext, p);
          // @ts-ignore
          globalContext[p] = value;
        }

        // 添加到 updatedValueSet
        updatedValueSet.add(p);

        this.latestSetProp = p;

        return true;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
      }

      // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
      return true;
    },
    get: (target: FakeWindow, p: PropertyKey): any => {
      this.registerRunningApp(name, proxy);

      if (p === Symbol.unscopables) return unscopables;
      // avoid who using window.window or window.self to escape the sandbox environment to touch the real window
      if (p === 'window' || p === 'self') {
        return proxy;
      }

      // hijack globalWindow accessing with globalThis keyword
      if (p === 'globalThis' || (inTest && p === mockGlobalThis)) {
        return proxy;
      }

      if (p === 'top' || p === 'parent' || (inTest && (p === mockTop || p === mockSafariTop))) {
        // if your master app in an iframe context, allow these props escape the sandbox
        if (globalContext === globalContext.parent) {
          return proxy;
        }
        return (globalContext as any)[p];
      }

      // proxy.hasOwnProperty would invoke getter firstly, then its value represented as globalContext.hasOwnProperty
      if (p === 'hasOwnProperty') {
        return hasOwnProperty;
      }

      if (p === 'document') {
        return this.document;
      }

      if (p === 'eval') {
        return eval;
      }

      const actualTarget = propertiesWithGetter.has(p) ? globalContext : p in target ? target : globalContext;
      const value = actualTarget[p];

      // frozen value should return directly, see https://github.com/umijs/qiankun/issues/2015
      if (isPropertyFrozen(actualTarget, p)) {
        return value;
      }

      const boundTarget = useNativeWindowForBindingsProps.get(p) ? nativeGlobal : globalContext;
      return getTargetValue(boundTarget, value);
    },
    ....
```

当微应用修改变量时：

* 原生属性且在白名单中，则修正大局的 window
* 否则，不是原生属性或者不在白名单，则修正 fakeWindow 里的内容

微应用获取变量时：

* 原生的属性，则从 window 里拿
* 不是原生，则优先从 fakeWindow 里获取

这样一来fakeWindow和window完全隔离。

每个微应用都有自己的 Proxy 和 fakeWindow，所以多个应用之前互不影响，可以存在多个实例。
