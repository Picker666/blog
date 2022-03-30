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

## 原型方法和类方法

```js
function Foo() {
  Foo.a = function () {
    console.log(1);
  };
  this.a = function () {
    console.log(2);
  };
}

Foo.prototype.a = function () {
  console.log(3);
};
Foo.a = function () {
  console.log(4);
};

Foo.a(); // （1）
let obj = new Foo();
obj.a(); // （2）
Foo.a(); // （3）
```

### 结果

4 2 1

### 分析

* （1）Foo.a() 这个调用的Foo的静态方法a, 虽然Foo中有优先级更高的属性方法 a，但 Foo 这时候并没有被调用，所以此时输出 Foo静态方法a的结果是： 4
* let obj = new Foo(); 使用了 new 方法调用了此函数，返回函数的实例对象，此时 Foo 函数内部的属性方法初始化，原型方法建立；（[new 的过程(/blog/docs/base/javascript/newConstructor.html)]）
* （2）、obj.a(); 调用的 obj 实例上的方法 a, 该实例是目前有两个a方法。一个是内部属性的方法，另一个是原型方法，二者重名，会优先调用实例内部的属性方法，所以输出2；
* （3）、Foo.a(); 由于Foo通过new生成实例的时候，在Foo内部初始化时，覆盖了同名的静态方法，所以输出：1。
