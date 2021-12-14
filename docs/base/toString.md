# toString 详解

在类型转换中，经常用到方法 [valueOf()](/base/valueOf) 和 `toString()` 。 `toSting()`方法返回返回对象的字符串表现。

## 1、基本包装类型——Boolean型

```js
var obj = new Boolean(true);
console.log(obj.toString());//"true"
console.log(typeof obj.toString());//string
//如果是包装类型的基本类型，则返回原基本类型值
var a = true;
console.log(a.toString());//"true"
console.log(typeof a.toString());//string
```

如果是基本包装类型对应的基本类型，会返回原值。但这并不代表基本类型拥有 `toString()` 方法【1】，而是在读取一个基本类型值时，后台会创建一个对应的基本包装类型的对象，从而调用一些方法。所以，基本类型“调用” `toString()` 方法时，实际上是先创建了一个对应的基本包装类型，由此基本包装类型调用 `toString()` 最后返回了其对应的字符串，看起来就好像是基本类型调用了 `toString()` 方法而得到了对应的字符串。

::: warning
【1】基本类型不是对象，不拥有任何方法
:::

## 2、基本包装类型——String型

```js
var obj = new String("hello");
console.log(obj.toString());//hello
console.log(typeof obj.toString());//string
//如果是包装类型的基本类型，则返回原基本类型值
var a = "hello";
console.log(a.toString());//hello
console.log(typeof a.toString());//string
```

同 1 ，String基本包装类型和基本类型调用 `toString()` 方法都返回对应的字符串。

## 3、基本包装类型——Number型

```js
var obj = new Number("123");
console.log(obj.toString());//123
console.log(typeof obj.toString());//string
//如果是包装类型的基本类型，则返回原基本类型值
var a = 123;
console.log(a.toString());//123
console.log(typeof a.toString());//string
```

同 1 ，Number基本包装类型和基本类型调用 `toString()` 方法都返回对应的字符串。

::: warning
如果直接用整数调用时，要加上括号，否则会报错。因为整数后面的点会识别为小数点。浮点型不会报错。

```js
console.log(123.toString());//Uncaught SyntaxError
console.log((123).toString());//"123"
console.log(12.3.toString());//"12.3"
```

:::

::: tip
此外，数字类型的toString()方法可以接收表示转换基数（可选，2-36中的任何数字），如果不指定此参数，转换规则将是基于十进制。

```js
var n = 33;
console.log(n.toString());//'33'
console.log(n.toString(2));//'100001'
console.log(n.toString(3));//'41'
console.log(n.toString(10));//'33'
console.log(n.toString(16));//'21'
console.log(n.toString(37));//Uncaught RangeError: toString() radix argument must be between 2 and 36
```

:::

## 4、数组Array类型（返回数组内容组成的字符串）

```js
var a = [1,2,3,4];
console.log(a.toString());//"1,2,3,4"
console.log(typeof a.toString());//string
```

## 5、函数Function类型（返回函数代码字符串）

```js
var a = function(){};
console.log(a.toString());//"function(){};"
console.log(typeof a.toString());//string
```

## 6、正则RegExp类型（返回原正则表达式的字符串表示）

```js
var a = /a/g;
console.log(a.toString());///"a/g"
console.log(typeof a.toString());//string
```

## 7、Date类型（返回表示当前时间的字符串）

```js
var obj = new Date();
console.log(obj);//Wed May 10 2017 18:20:05 GMT+0800 (中国标准时间)
console.log(typeof obj);//object
console.log(obj.toString());//"Wed May 10 2017 18:20:05 GMT+0800 (中国标准时间)"
console.log(typeof obj.toString());//string
```

## 8、对象Object类型及自定义对象类型（返回[object Object]）

```js
var obj = {a:1};
console.log(obj.toString());//"[object Object]"
console.log(typeof obj.toString());//string
function Foo(){};
var foo = new Foo();
console.log(foo.toString());//"[object Object]"
console.log(typeof foo.toString());//string
```

在判断对象的类型时，用 `Object.prototype.toString()` 返回字符串 `"[object 对象类型]"` ，但无法判断自定义对象的类型（可使用 `instanceof` 判断）。

## Summary

* 1、`undefined` 和 `null` 没有此方法（基本类型肯定没有方法，`String` 、 `Number` 和 `Boolean` 是因为有对应的基本包装类型，才可以调用方法）；
* 2、`Date` 类型返回表示时间的字符串；
* 3、`Object` 类型返回字符串 `“[object Object]”`。

## 与 `valueOf()` 对比

* 1、 `toString()`  和 `valueOf()` 的主要不同点在于 ，`toString()` 返回的是字符串，而 `valueOf()` 返回的是原对象;
* 2、由于 `undefined` 和 `null` 不是对象，所以它 们 `toString()` 和 `valueOf()` 两个方法都没有;
* 3、数值 `Number` 类型的 `toString()`  方法可以接收转换基数，返回不同进制的字符串形式的数值；而 `valueOf()` 方法无法接受转换基数;
* 4、时间 `Date` 类型的 `toString()` 方法返回的表示时间的字符串表示；而 `valueOf()` 方法返回的是现在到1970年1月1日00:00:00的数值类型的毫秒数;
* 5、包装对象的 `valueOf()` 方法返回该包装对象对应的原始值.

## 与转型函数 `String()` 函数的对比

* 1、`String()` 可以将任何类型的值转换为字符串，包括 `undefined` 和 `null`;

```js
onsole.log(String(null));//"null"
console.log(String(undefined));//"undefined"
```

* 2、`String()`不能接受数值基数作为参数.
