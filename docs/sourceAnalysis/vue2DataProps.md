# vue2 data 和 props

Vue中的data和props是怎么做到可以直接在实例下直接访问（this.attr）;

先看initState

```js
function initState(vm) {
  var opts = vm.$options;
  if (opts.props)
      initProps$1(vm, opts.props);
  if (opts.data) {
      initData(vm);
  } else {
      var ob = observe((vm._data = {}));
      ob && ob.vmCount++;
  }
}
```

可以看出 props 走了`initProps$1(vm, opts.props);`方法;

data 存在的话就是 `initData(vm);`，不存在的话就是 `observe`;

## data

### initData

```js
function initData () {
  var data = vm.$options.data;
  data = vm._data = isFunction(data) ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
    warn$2('data functions should return an object:\n' +
            'https://v2.vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
          warn$2("Method \"".concat(key, "\" has already been defined as a data property."), vm);
      }
    }
    if (props && hasOwn(props, key)) {
      warn$2("The data property \"".concat(key, "\" is already declared as a prop. ") +
                "Use prop default value instead.", vm);
    }
    else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  var ob = observe(data);
  ob && ob.vmCount++;
};
```

* 1、取出我们传入的data，如果是方法就调用 `getData` 执行 `data.call(vm, vm);`并返回结果，并赋值为data。
* 2、将data赋值给 `vm._data`;
* 3、获取data所有key，并遍历，检测data是否和 `methods` 和`props`冲突，并执行`proxy(vm, "_data", key);`。

### proxy

```js
function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
      return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
      this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

通过`Object.defineProperty` 将`key`挂到target 及实例（vm）上；`key`的set为设置val到`vm._data`，get从`vm._data`取值。

## props

```js
function initProps$1(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = (vm._props = shallowReactive({}));
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = (vm.$options._propKeys = []);
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
      toggleObserving(false);
  }
  var _loop_1 = function (key) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
          var hyphenatedKey = hyphenate(key);
          if (isReservedAttribute(hyphenatedKey) ||
              config.isReservedAttr(hyphenatedKey)) {
              warn$2("\"".concat(hyphenatedKey, "\" is a reserved attribute and cannot be used as component prop."), vm);
          }
          defineReactive(props, key, value, function () {
              if (!isRoot && !isUpdatingChildComponent) {
                  warn$2("Avoid mutating a prop directly since the value will be " +
                      "overwritten whenever the parent component re-renders. " +
                      "Instead, use a data or computed property based on the prop's " +
                      "value. Prop being mutated: \"".concat(key, "\""), vm);
              }
          });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
          proxy(vm, "_props", key);
      }
  };
  for (var key in propsOptions) {
      _loop_1(key);
  }
  toggleObserving(true);
}
```

props的处理方式于data类似，最终也是调用 proxy。