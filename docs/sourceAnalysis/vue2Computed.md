# vue2 - computed 源码解析

先简单介绍一下初始化的执行前后：

## 1、初始化

`new Vue()` 的核心是执行 `Vue.prototype._init`

```js
...
vm._self = vm;
initLifecycle(vm); // 初始化生命周期
initEvents(vm); // 初始化事件
initRender(vm); // 初始化render
callHook$1(vm, 'beforeCreate', undefined, false /* setContext */);// 执行beforeCreate生命周期钩子
initInjections(vm); // resolve injections before data/props 初始化injections
initState(vm); // 初始化state （props、methods、data、computed、watch）
initProvide(vm); // resolve provide after data/props
callHook$1(vm, 'created');// 调用 created 生命周期
...
```

可看出在 `beforeCreate` 和 `created` 生命周期前后做的事情，我们重点关注 `initState`;

## 2、initState

```js
function initState(vm) {
  var opts = vm.$options;
  ...
  if (opts.computed)
      initComputed$1(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
  }
}
```

如果存在 `computed`,就会执行 `initComputed`;

## 3、initComputed

```js initComputed
function initComputed$1(vm, computed) {
  // $flow-disable-line
  var watchers = (vm._computedWatchers = Object.create(null));
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();
  for (var key in computed) {
      var userDef = computed[key];
      var getter = isFunction(userDef) ? userDef : userDef.get; // 在这里可以看出 computed 计算属性可以是一个方法也可以是一个包含get的对象，自定义设置计算属性的getter，甚至setter
      if (getter == null) {
          warn$2("Getter is missing for computed property \"".concat(key, "\"."), vm);
      }
      if (!isSSR) {
          // create internal watcher for the computed property.
          watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
      }
      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
          defineComputed(vm, key, userDef);
      } else {
          ....
      }
  }
}
```

* 每个 `computed` 都会生成一个 `watcher`，并存放到 `vm._computedWatchers` 中；
* `computed` 计算属性可以是一个方法也可以是一个包含`get`的对象，自定义设置计算属性的`getter`，甚至`setter`；
* 计算属性的 结果来源就是我们定义个方法或者`get`，需要控制的是 计算的时机和频率。

## 4、关于计算属性的 watcher

```js
Watcher.prototype.evaluate = function () {
  this.value = this.get();
  this.dirty = false;
};

Watcher.prototype.get = function () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
      value = this.getter.call(vm, vm); // value的来源 getter也就是 计算属性的方法或者我们定义的get
  }
  catch (e) {
      if (this.user) {
          handleError(e, vm, "getter for watcher \"".concat(this.expression, "\""));
      }
      else {
          throw e;
      }
  }
  finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
          traverse(value);
      }
      popTarget();
      this.cleanupDeps();
  }
  return value;
};

Watcher.prototype.update = function () {
  /* istanbul ignore else */
  if (this.lazy) {
      this.dirty = true; // 计算属性的 watcher 的update 标记为脏
  }
  else if (this.sync) {
      this.run();
  }
  else {
      queueWatcher(this);
  }
};
```

* 每当watcher发生更新，执行update方法，此时设置当前watcher.dirty为true；
* 当下次获取计算属性的值的时候，会执行 evaluate，重新执行 watcher.get 方法获取最新的计算属性结果，并缓存到watcher.value，并且设置watcher.dirty为false。

## 5、计算属性的挂载和读取 - defineComputed

```js
function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering(); // true if not server render
  if (isFunction(userDef)) {
      sharedPropertyDefinition.get = shouldCache
          ? createComputedGetter(key)
          : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
  }
  else {
      sharedPropertyDefinition.get = userDef.get
          ? shouldCache && userDef.cache !== false
              ? createComputedGetter(key)
              : createGetterInvoker(userDef.get)
          : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
          warn$2("Computed property \"".concat(key, "\" was assigned to but it has no setter."), this);
      };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition); // 将计算属性挂载到实例上
}
```

`defineComputed`核心是将计算属性挂载到实例上，至于属性的 getter，需要跟情况去处理。

**关于服务端渲染 暂且不做分析**！！！然后，分两种情况： `userDef`是`function`，`userDef` 是包含 `get` 的对象。

* `userDef`是`function`

如果是 function 毫无疑问，走到 `createComputedGetter` 方法;

* `userDef` 是包含 `get` 的对象

如果没设置 cache === false，也是走到 `createComputedGetter`;

否则，走到`createGetterInvoker`。

### 5.1 createComputedGetter

```js
function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        if (Dep.target.onTrack) {
          Dep.target.onTrack({
            effect: Dep.target,
            target: this,
            type: "get" /* TrackOpTypes.GET */,
            key: key
          });
        }
        watcher.depend();
      }
      return watcher.value;
    }
  };
}
```

在这个方法里传入了 计算属性的 key，返回一个方法 `computedGetter`，也就是获取计算属性结果的方法；

在这个方法中 首先去到当前的 watcher，如果

* `watcher.dirty`为 `true`，执行 `watcher.evaluate`;
* `watcher.dirty`为 `false`，则直接返回 `watcher.value`，**这时候不会重新计算，从缓存中取值**。

### 5.2 createGetterInvoker

```js
function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}
```

这里比较简单，`computedGetter`就是调用出入的`fn`也就是 我们定义个的 `get`，**每次都会执行get方法，没有缓存处理**。
