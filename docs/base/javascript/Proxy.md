# Proxy (ES6)

## 概况

`Proxy`用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种`“元编程”`（meta programming），即对编程语言进行编程。

`Proxy`可以理解成，在目标对象之前架设一层`“拦截”`，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
```

上面代码对一个空对象架设了一层拦截，重定义了属性的`读取（ get ）`和`设置（ set ）`行为。这里暂时先不解释具体的语法，只看运行结果。对设置了拦截行为的对象 obj ，去读写它的属性，就会得到下面的结果。

```js
obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

上面代码说明，Proxy 实际上`重载（overload）`了**点运算符**，即用自己的定义覆盖了语言的原始定义。

## Proxy 构造函数

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
var proxy = new Proxy(target, handler);
```

Proxy 对象的所有用法，都是上面这种形式，不同的只是 handler 参数的写法。其中， new Proxy() 表示生成一个 Proxy 实例， target 参数表示所要拦截的目标对象， handler 参数也是一个对象，用来定制拦截行为。

下面是另一个拦截读取属性行为的例子。

```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});
proxy.time // 35
proxy.name // 35
proxy.title // 35
```

上面代码中，作为构造函数， Proxy 接受两个参数。

* 第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有 Proxy 的介入，操作原来要访问的就是这个对象；
* 第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。
* 比如，上面代码中，配置对象有一个 get 方法，用来拦截对目标对象属性的访问请求。 get 方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回 35 ，所以访问任何属性都得到 35 。

::: warning 注意
要使得 Proxy 起作用，必须针对 Proxy 实例（上例是 proxy 对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。
:::

如果 handler 没有设置任何拦截，那就等同于直接通向原对象。

```js
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = 'b';
target.a // "b"
```

上面代码中， handler 是一个空对象，没有任何拦截效果，**访问 proxy 就等同于访问 target** 。

## 使用技巧

* 将 Proxy 对象 **设置到 object.proxy 属性**，从而可以在 object 对象上调用。

```js
var object = { proxy: new Proxy(target, handler) };
```

* Proxy 实例也可以作为其他对象的原型对象。

```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});
let obj = Object.create(proxy);
obj.time // 35
```

上面代码中， proxy 对象是 obj 对象的原型， obj 对象本身并没有 time 属性，所以根据原型链，会在 proxy 对象上读取该属性，导致被拦截。

同一个拦截器函数，可以设置拦截多个操作。

```js
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },
  apply: function(target, thisBinding, args) {
    return args[0];
  },
  construct: function(target, args) {
    return {value: args[1]};
  }
};
var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);
fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

下面是 Proxy 支持的拦截操作一览，一共 13 种。

* get(target, propKey, receiver)：拦截对象属性的读取，比如 proxy.foo 和 proxy['foo'] 。
* set(target, propKey, value, receiver)：拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v ，返回一个布尔值。
* has(target, propKey)：拦截 propKey in proxy 的操作，返回一个布尔值。
* deleteProperty(target, propKey)：拦截 delete proxy[propKey] 的操作，返回一个布尔值。
* ownKeys(target)：拦截 Object.getOwnPropertyNames(proxy) 、 Object.getOwnPropertySymbols(proxy) 、 Object.keys(proxy) 、 for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys() 的返回结果仅包括目标对象自身的可遍历属性。
* getOwnPropertyDescriptor(target, propKey)：拦截 Object.getOwnPropertyDescriptor(proxy, propKey) ，返回属性的描述对象。
* defineProperty(target, propKey, propDesc)：拦截 Object.defineProperty(proxy, propKey, propDesc） 、 Object.defineProperties(proxy, propDescs) ，返回一个布尔值。
* preventExtensions(target)：拦截 Object.preventExtensions(proxy) ，返回一个布尔值。
* getPrototypeOf(target)：拦截 Object.getPrototypeOf(proxy) ，返回一个对象。
* isExtensible(target)：拦截 Object.isExtensible(proxy) ，返回一个布尔值。
* setPrototypeOf(target, proto)：拦截 Object.setPrototypeOf(proxy, proto) ，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
* apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args) 、 proxy.call(object, ...args) 、 proxy.apply(...) 。
* construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args) 。
  
## Proxy 实例的方法

[Proxy 实例的方法](https://www.w3cschool.cn/escript6/escript6-41xy37f5.html)
