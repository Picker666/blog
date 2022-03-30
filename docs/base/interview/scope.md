---
sidebarDepth: 3
---
# 作用域

## 1、IIFE（打印结果）

[IIFE(Immediately Invoked Function Expressions)](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)

```js
var b = 10;
(function b() {
  // 内部作用域，会先去查找是有已有变量b的声明，有就直接赋值20，确实有了，发现了具名函数 function b () {}, 拿此b做赋值；
  // IIFE 的函数无法进行赋值（内部机制，类似const定义的常量），所以 赋值无效
  // IIFE - 查找IIFE 在 JS 引擎的工作方式，堆栈存储IIFE的方式等
  b = 20;
  console.log(b); // [Function b]
  console.log(window.b); // 10
})();
```

### 严格模式下会报错

Uncaught TypeError: Assignment to constant variable

```js
var b = 10;
(function b() {
  'use strict'
  b = 20;
  console.log(b); // [Function b]
  console.log(window.b); // 10
})(); // Uncaught TypeError: Assignment to constant variable
```

### 有 var 的情况

```js
var b = 10;
(function b() {
  var b = 20;
  console.log(b); // 20
  console.log(window.b); // 10
})();
```

### 结果

打印内容：

```js
ƒ b() {
  b = 20;
  console.log(b);
  console.log(window.b);
}
```

### 原因

* 作用域： 执行上下文中包含作用域链：
  在理解作用域链之前，先介绍一下作用域，作用域可以理解为执行上下文中申明的变量和作用的范围；包括块级作用域/函数作用域；
* 特性：声明提前，一个声明在函数体内部是可见的，函数声明优于变量声明；
* 在非匿名自执行函数中，函数变量为只读状态无法修改。

```js
var b = 10;
(function () {
  var b = 20;
  console.log(b); // 20
  console.log(window.b); // 10
})();

(function () {
  b = 20;
  console.log(b); // 20
  console.log(window.b); // 20
})();

(function () {
  console.log(b); // 10
  b = 20;
  console.log(window.b); // 20
})();

```

## 2、函数形参

```js
function changeObjProperty(webSite) {
  webSite = 'http://www.google.com';

  console.log(webSite); // {siteUrl: 'http://www.google.com'}
}

let webSite = 'http://www.baidu.com';
changeObjProperty(webSite);
console.log(webSite, '=========='); // http://www.baidu.com
```

```js
function changeObjProperty(o) {
  o.siteUrl = 'http://www.baidu.com';
  o = new Object();
  o.siteUrl = 'http://www.google.com';

  console.log(o); // {siteUrl: 'http://www.google.com'}
}

let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl, '=========='); // http://www.baidu.com
```

### 原因

形参传递的问题：

* 简单数据类型：传递的是值；
* 引用数据类型：传递的是内存地址

