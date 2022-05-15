---
sidebarDepth: 3
---
# 知识点总结

## 箭头函数和普通函数区别

* 1、箭头函数没有this，它会从自己的作用域链的上层继承this（因此无法使用apply/call/bind来帮定this）；
* 2、箭头函数不可以使用arguments对象，该对象在函数体内不存在，如果需要，可以使用rest参数提代。
* 3、箭头函数不可以使用 yield 命令，因此箭头函数不能用作generator函数；
* 4、箭头函数不可以使用new命令，因为：
  * 没有自己的this，无法调用 call，apply。
  * 没有prototype 属性，而 new命令在执行时候需要将构造函数的prototype赋值给新对象的prototype.
  
[构造函数 new的过程](/base/javascript/newConstructor.html)

## var/let/const 区别

### 1、声明过程

* var：遇到有 var 的作用域，在任何语句执行前都已完成了声明和初始化，也就是变量提升并且拿到undefined的原因；
* function: 声明、初始化、赋值一开始就全部完成，所以函数的变量提升优先级跟高；
* let：解析器进入一个块级作用域，发现let关键，变量只是先完成声明，并没有初始化。此时如果在作用域提前访问，则会报错 xx is not defined， 这就是暂时性死区的由来。等到解析到 有let的那一句才会进去初始化的阶段。如果let的那一行是赋值操作，则初始化和赋值同时进行。
* const、class都是同let一样的道理。

对比于var，let、const 只是解耦了声明和初始化的过程，var是任何语句执行前都完成了 声明和初始化，let、const仅仅在任何语句执行前只完成了声明。

### 2、内存分配

* var：会直接在栈内存里预分配内存空间，然后等到实际语句执行的时候，再存储对应的变量，如果传的是引用类型，那么会在堆内存里开辟一个内存空间存储实际内容，栈内存会存储一个指向堆内存的指针；
* let：是不会再栈内存里预分配内存空间，而且在栈内存分配变量时，做一个检查，如果已经有相同变量名存在就会报错；
* const：也不会预分配内存空间，在栈内存分配变量时也会做同样的检查。不过const存储的变量时不可以修改的，对于基本类型来说，无法修改定义的值，对于引用类型来说无法修改栈内存里分配的指针，但是，你可以修改指针指向的对象里的属性。

### 3、变量提升

可以认为是，只有let存在变量提升；

也可以认为，let、const、var都存在变量提升

* let/const：只是创建过程（声明）提升，初始化过程并没有提升，所以存在暂时性死区；
* var：创建和初始化过程都提升了，所以在赋值前访问会等到undefined；
* function：创建、初始化和**赋值**都被提升了。

## 函数变量及作用域

隐式全局变量：变量没有声明，直接赋值，执行到时，浏览器才会偷偷把变量提升为隐式全局变量

全局作用域：在函数声明之外的作用域

### 预解析

* 所有的变量声明,都会提升到最顶部,但不会提升赋值
* 所有的函数声明,都会提升到最顶部,但不会提升函数的调用
* 如果同时有多个 var 声明的相同的变量,**前面**的 var 将被忽略
* 如果同时有多个同名的函数,后面的函数将会**覆盖**前面的函数
* 如果声明的变量和声明的函数同名,声明的函数将会**覆盖**声明的变量

### 词法分析3步骤

* 先分析函数形参(默认值为undefined),再分析形参赋值(没有形参的直接忽略此步骤)
分析函数体中所有的变量声明:
  * 2.1 如果变量名与形参名相同时,直接忽略var;
  * 2.2 如果变量名与形参名不同时,就相当于声明了一个变量,如var foo,值为undefined;
* 分析函数体中所有的函数声明,
  * 3.1 如果函数名与变量名相同,函数将作为变量的值;
  * 3.2 如果函数名与变量名不相同,相当于var 函数名 = function 函数名 () {};

### 函数执行过程分为2步

词法分析过程;
执行过程

```js
function scopeA(b) {
  console.log(b, '===a==='); // b () {}
  function b() {
    console.log(b);  // b () {}
  }
  b();
  b = 1;

  console.log(b, '=====last=====');  // 1
}

scopeA(6);
```

```js
function t3(greet) {
  console.log(greet); // greet() { };
  var greet = 'hello';
  console.log(greet); // hello
  function greet() {
  };
  console.log(greet); // hello
}
t3(null);
```

```js
function test(a, b) {
  console.log(a); // a() {}
  console.log(b); // 2
  var b = 234;
  console.log(b); // 234
  a = 123;
  console.log(a); // 123
  function a() {
  }
  var a;
  b = 456;
   console.log(b); // 456
  var b = function () {
  }
  console.log(a); // 123
  console.log(b); //   function () {}
}

test(1, 2);
```

```js
a = 100;
function demo(e) {
	function e() {
    }
    arguments[0] = 2;
    console.log(e); // 2
    if (a) {
       var b = 123;
    }
    a = 10;
    var a;
    console.log(b); // undefined
    f = 123;
    console.log(a); // 10
 }

 var a = 6;
 demo(1);
 console.log(a); // 100
 console.log(f); // 123
```

```js
var a = function b() {
	console.log(123);
}
a(); // 123
b(); // 报错
```