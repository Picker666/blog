# 关于 var

[本文demo所在](https://github.com/Picker666/blog-example/tree/main/src/component/Base/var.jsx)

看代码

```js
var a = 100;

function fn() {
  console.log(a); //undefined，因为fn函数不是一个闭包
  var a = 200;
  console.log(a); //200
}
fn();

console.log(a); //100
var a;
console.log(a); //100
var a = 300;
console.log(a); //300
```

**函数提升优先于变量提升，所以上面的代码块等价于**

```js
function fn() {
  var a; //var声明表明变量a的作用域为fn函数的词法作用域，fn函数不是一个闭包
  console.log(a); //此处为undefined
  a = 200;
  console.log(a); //200
}
var a;
a = 100;
fn();
console.log(a); //100
var a;
console.log(a); //100
var a = 300;
console.log(a); //300
```

后面仨个a为啥呢，这要总结下重复声明的问题：

* 1.var在同一个作用域下，多次声明多次声明一个变量不仅是合法的,而且也不会造成任何错误.
* 2.var在同一个作用域下，如果重复使用的一个声明有一个初始值,那么它担当的不过是一个赋值语句的角色.
* 3.var在同一个作用域下，如果重复使用的一个声明没有一个初始值,那么它不会有任何的影响
* 4.var a在函数的词法作用域下，哪怕与全局作用域下的变量a同名，也是两个完全无关的变量，当词法作用域内用到a时注意看词法作用域中有无var a声明，当有var声明时，该函数并不是一个闭包。词法作用域的a离开词法作用域会销毁掉这个变量。
