# valueOf 详解

在类型转换中，经常用到方法 `valueOf()` 和他 `toString()` ，所有对象（包括基本包装类型）都拥有这两个方法。 `valueOf()` 方法会将对象转换为基本类型，如果无法转换为基本类型，则返回原对象.

## 1、基本包装类型 - `Boolean`

```js
var obj = new Boolean(true);
console.log(obj.valueOf());//true
console.log(typeof obj.valueOf());//boolean
//如果是包装类型的基本类型，则返回原基本类型值
var a = true;
console.log(a.valueOf());//true
console.log(typeof a.valueOf());//boolean
```

如果是基本包装类型对应的基本类型，会返回原值。但这并不代表基本类型拥有 `valueOf()` 方法（基本类型不是对象，不拥有任何方法），而是在读取一个基本类型值时，后台会创建一个对应的基本包装类型的对象，从而调用一些方法。所以，基本类型“调用” `valueOf()` 方法时，实际上是先创建了一个对应的基本包装类型，由此基本包装类型调用 `valueOf()` ，最后返回了其对应的基本类型，看起来就好像是基本类型调用了 `valueOf()` 方法而得到了原始值。

## 2、基本包装类型 - `String`

```js
var obj = new String("hello");
console.log(obj.valueOf());//hello
console.log(typeof obj.valueOf());//string
//如果是包装类型的基本类型，则返回原基本类型值
var a = "hello";
console.log(a.valueOf());//hello
console.log(typeof a.valueOf());//string
```

同 1 ，`String` 基本包装类型和基本类型调用 `valueOf()` 方法都返回对应的基本类型。

## 3、基本包装类型 - `Number`

```js
var obj = new Number("123");
console.log(obj.valueOf());//123
console.log(typeof obj.valueOf());//number
//如果是包装类型的基本类型，则返回原基本类型值
var a = 123;
console.log(a.valueOf());//123
console.log(typeof a.valueOf());//number
```

同 1，`Number` 基本包装类型和基本类型调用 `valueOf()` 方法都返回对应的基本类型。

## 4、数组 `Array`

返回原数组。

```js
var a = [1];
console.log(a.valueOf());//[1]
console.log(a === a.valueOf());//true
```

## 5、函数 `Function`

返回原函数

```js
var a = function(){};
console.log(a.valueOf());//function(){};
console.log(a === a.valueOf());//true
```

## 6、正则 `RegExp`

返回正则原对象。

```js
var a = /a/g;
console.log(a.valueOf());///a/g
console.log(a === a.valueOf());//true
```

## 7、对象 `Object`

返回原对象。

```js
var obj = {a:1};
console.log(obj.valueOf());//Object{a:1}
console.log(obj === obj.valueOf());//true
```

## 8、Date类型

返回表示当前时间的数值。

```js
var obj = new Date();
console.log(obj);//Wed May 10 2017 12:19:05 GMT+0800 (中国标准时间)
console.log(obj.valueOf());//1494389910179
console.log(obj === obj.valueOf());//false
console.log(obj.getTime() === obj.valueOf());//true
```

## Summary

* 1、`undefined` 和 `null` 没有此方法（基本类型肯定没有方法，`String` 、`Number` 和`Boolean` 是因为有对应的基本包装类型，才可以调用方法）；
* 2、基本包装类型和对应的基本类型，调用 `valueOf()` 返回对应的基本类型值；
* 3、对象类型（除 `Date` 类型）返回原对象；
* 4、`Date` 类型返回表示日期的毫秒数.
