---
sidebarDepth: 3
---
# 模块化

## 一、什么是模块化

将一个复杂的程序依据i一定的规则/规范封装成几个块（文件），并进行组合在一起；内部的数据和实现是私有的，只是向外部暴露一些接口/方法 与外部模块进行通信。

模块化解决的问题

* 全局变量冲突
* 依赖关系管理麻烦

模块化的好处

* 解决命名冲突
* 代码分离，按需加载
* 提供复用性
* 提高代码可维护性

## 二、模块化的进化过程

### 1、全局function的模式

把不同的功能封装成不同的全局函数

```js
function m1 () {}

function m2 () {}
```

### 2、命名空间的方式

问题：数据不安全（外部可以直接修改模块内部的数据），所有的模块成员都会被暴露再外

```js
let objFn = {
  data: 'dfasd',
  afn: () => {

  }, 
  bfn: () => {

  }
}

objFn.data = 'aaaad'
```

### 3、IIFE 匿名函数的自执行

向window对象上添加全局属性，也叫添加匿名空间，目的是向外暴露接口

好处：方法私有，只能通过外部接口操作；
坏处：如果多个模块之间存在相互依赖关系，就不好办了。

```html
<script type="text/javascript">
(function (win){
  function a() {

  }

  function b() {

  }

  // 向外暴露方法
  win.myMethod = {a, b}
})(window)
</script>
```

### 4、IIFE 增强

假设依赖JQ

```html
<script type="text/javascript">
(function (win, _){
  function a() {

  }

  function b() {

  }

  // 向外暴露方法
  win.myMethod = {a, b}
})(window, jQuery)
</script>
```

这种方式需要注意的是：引入的js文件和模块 必须要有一定的先后顺序，否则就会报错，undefined

::: tip
引入多个script之后，会不可避免的出现引用交叉

* 请求过多
* 依赖乱掉，就所谓的依赖模糊
* 难以维护，因为各种调用，依赖交织到一起。
:::

## 三、CommonJS

### 1、规范

* 1）每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

* 2）CommonJS规范规定，每个模块内部，module变量代表当前模块。这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。

* 3）require方法用于加载模块。

### 2、使用

CommonJS 最早是 Node 在使用，目前也仍然广泛使用，比如在 Webpack 中你就能见到它，当然目前在 Node 中的模块管理已经和 CommonJS 有一些区别了。

```js
// a.js 模块对外暴露
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js 模块加载
var module = require('./a.js')
module.a // -> log 1
```

因为 CommonJS 还是会使用到的，所以这里会对一些疑难点进行解析

### 3、require

```js
var module = require('./a.js')
module.a 
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
// module 基本实现
var module = {
  id: 'xxxx', // 我总得知道怎么去找到他吧
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports 
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
// 然后当我 require 的时候去找到独特的
// id，然后将要使用的东西用立即执行函数包装下，over
```

另外虽然 exports 和 module.exports 用法相似，但是不能对 exports 直接赋值。因为 var exports = module.exports 这句代码表明了 exports 和 module.exports 享有相同地址，通过改变对象的属性值会对两者都起效，但是如果直接对 exports 赋值就会导致两者不再指向同一个内存地址，修改并不会对 module.exports 起效。

### 4、Node.js的模块化

说到CommonJS 我们要提一下 Node.js，Node.js的出现让我们可以用JavaScript来写服务端代码，而 Node 应用由模块组成，采用的是 CommonJS 模块规范，当然并非完全按照CommonJS来，它进行了取舍，增加了一些自身的特性。

* 1）Node内部提供一个Module构建函数，所有模块都是Module的实例，每个模块内部，都有一个module对象，代表当前模块。包含以下属性：

  * module.id 模块的识别符，通常是带有绝对路径的模块文件名。
  * module.filename 模块的文件名，带有绝对路径。
  * module.loaded 返回一个布尔值，表示模块是否已经完成加载。
  * module.parent 返回一个对象，表示调用该模块的模块。
  * module.children 返回一个数组，表示该模块要用到的其他模块。
  * module.exports 表示模块对外输出的值。

* 2）Node使用CommonJS模块规范，内置的require命令用于加载模块文件。
* 3）第一次加载某个模块时，Node会**缓存该模块**。以后再加载该模块，就直接从**缓存取出**该模块的module.exports属性。所有缓存的模块保存在require.cache之中。

```js
// a.js
var name = 'Lucy'
exports.name = name

// b.js
var a = require('a.js')
console.log(a.name) // "Lucy"
a.name = "hello";


var b = require('./a.js')
console.log(b.name) // "hello"1.2.3.4.5.6.7.8.9.
```

上面第一次加载以后修改了name值，第二次加载的时候打印的name是上次修改的，证明是从缓存中读取的。

想删除模块的缓存可以这样：

```js
delete require.cache[moduleName];
```

* 4）CommonJS模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个例子。

```js
// a.js
var counter = 3
exports.counter = counter
exports.addCounter = function(a){
  counter++
}

// b.js
var a = require('a.js')
console.log(a.counter) // 3
a.addCounter()
console.log(a.age) // 31.2.3.4.5.6.7.8.9.10.11.
```

## 三、前端模块化

前面所说的CommonJS规范，都是基于node来说的，所以CommonJS都是针对服务端的实现。为什么呢

因为CommonJS规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。

如果是浏览器环境，要从服务器端加载模块，用CommonJS需要等模块下载完并运行后才能使用，将阻塞后面代码的执行，这时就必须采用非同步模式，因此浏览器端一般采用AMD规范，解决异步加载的问题。

### 1、AMD（Asynchronous Module Definition）和 RequireJS

AMD是异步加载模块规范

RequireJS是一个工具库。主要用于客户端的模块管理。它可以让客户端的代码分成一个个模块，实现异步或动态加载，从而提高代码的性能和可维护性。它的模块管理遵守AMD规范。

#### 1.2、模块定义

* 1）独立模块（不需要依赖任何其他模块）

```js
//独立模块定义
define({
  method1: function() {

  } 

  method2: function() {

  }
}); 

//或者
define(function(){
  return {
    method1: function() {

    },
    method2: function() {

    },
  }});
```

* 2）非独立模块（需要依赖其他模块）

```js
define(['module1', 'module2'], function(m1, m2){
  return {
    method: function() {
      m1.methodA();
      m2.methodB();
    }
  };
});
```

define方法：

第一个参数是一个数组，它的成员是当前模块所依赖的模块

第二个参数是一个函数，当前面数组的所有成员加载成功后，它将被调用。它的参数与数组的成员一一对应，这个函数必须返回一个对象，供其他模块调用

#### 1.2、模块调用

require方法用于调用模块。它的参数与define方法类似。

```js
require(['a', 'b'], function ( a, b ) {
  a.doSomething();
});
```

define和require这两个定义模块、调用模块的方法，合称为AMD模式。它的模块定义的方法非常清晰，不会污染全局环境，能够清楚地显示依赖关系。

#### 1.3、require.js的config方法

require方法本身也是一个对象，它带有一个config方法，用来配置require.js运行参数。

```js
require.config({
  paths: {
    jquery: [
      '//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js',
      'lib/jquery'
    ]
  }
});
```

参数对象包含：

* paths 指定各个模块的位置
* baseUrl 指定本地模块位置的基准目
* shim 用来帮助require.js加载非AMD规范的库。

#### 1.4、CommonJS 和AMD的对比

CommonJS一般用于服务端比如node，AMD一般用于浏览器环境，并且允许非同步加载模块，可以根据需要动态加载模块

CommonJS和AMD都是运行时加载

#### 1.5、运行时加载

简单来讲，就是CommonJS和AMD都只能在运行时才能确定一些东西，所以是运行时加载。比如下面的例子：

```js
// CommonJS模块
let { stat, exists, readFile } = require('fs');
// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readFile = _fs.readFile;
```

上面代码其实是整体加载了fs模块，生成了一个_fs 的对象,然后从这个对象上读取三个方法。因为只有运行时才能得到这个对象，所以成为运行时加载。

下面是AMD的例子：

```js
// AMD
define('a', function () {
  console.log('a 加载')
  return {
    run: function () {
      console.log('a 执行')
    }
  }
})

define('b', function () {
  console.log('b 加载')
  return {
    run: function () {
      console.log('b 执行')
    }
  }
})

//运行
require(['a', 'b'], function (a, b) {
  console.log('main 执行')
  a.run()
  b.run()
})
// 运行结果：// a 加载// b 加载// main 执行// a 执行// b 执行
```

我们可以看到执行的时候，a和b先加载，后面才从main开始执行。所以require一个模块的时候，模块会先被加载，并返回一个对象，并且这个对象是整体加载的，也就是常说的 依赖前置。

### 2、CMD(Common Module Definition) 和 SeaJS

在 Sea.js 中，所有 JavaScript 模块都遵循 CMD（Common Module Definition） 模块定义规范。

Sea.js和 RequireJS 区别在哪里呢？这里有个官方给出的区别。

RequireJS 遵循 AMD（异步模块定义）规范，Sea.js 遵循 CMD （通用模块定义）规范。规范的不同，导致了两者 API 不同。Sea.js 更贴近 CommonJS Modules/1.1 和 Node Modules 规范。

这里对AMD和CMD做个简单对比：

AMD 定义模块时，指定所有的依赖，依赖模块加载后会执行回调并通过参数传到这回调方法中：

```js
define(['module1', 'module2'], function(m1, m2) {
  ...
});
```

CMD规范中一个模块就是一个文件，模块更接近于Node对CommonJS规范的定义：

```js
define(factory); // factory 可以是一个函数，也可以是一个对象或字符串。
```

factory 为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外 提供的接口。factory 方法在执行时，默认会传入三个参数：require、exports 和 module：

```js
define(function(require, exports, module) {  // 模块代码})
```

其中，require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口。需要依赖模块时，随时调用require( )引入即可

```js
define(function(require, exports) {
  // 获取模块 a 的接口 
  var a = require('./a');
  // 调用模块 a 的方法 
  a.doSomething();
});
```

```js
define('a', function (require, exports, module) {
  console.log('a 加载')
  exports.run = function () {
    console.log('a 执行')
  }
})

define('b', function (require, exports, module) {
  console.log('b 加载')
  exports.run = function () {
    console.log('b 执行')
    }
  })
  
  define('main', function (require, exports, module) {
    console.log('main 执行')
    var a = require('a')
    a.run() 
    var b = require('b')
    b.run()
  })

  // main 执行// a 加载// a 执行// b 加载// b 执行
```

看到执行结果，会在真正需要使用(依赖)模块时才执行该模块，感觉这好像和我们认知的一样，毕竟我也是这么想的执行顺序，但是看前面AMD的执行结果，是先把a和b都加载以后，才开始执行main的。所以相较于AMD的依赖前置、提前执行，CMD则推崇依赖就近、延迟执行。


### 3、ES6 模块

模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能

#### 3.1、模块导出

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量（函数或类），就必须使用export关键字输出该变量（函数或类）。

* 1） 导出变量 和 函数

```js
// a.js// 导出变量
export var name = 'Michael';
export var year = 2010;
// 或者  // 也可以这样导出
var name = 'Michael';
export { name, year };
// 导出函数

export function multiply(x, y) {  return x * y;};
```

* 2） as的使用

通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名。

```js
function v1() {
  ...
}

function v2() {
  ...
}

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

#### 3.2、模块引入

* 1） 使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块。

```js
// 一般用法
import { name, year} from './a.js';
// as 用法
import { name as userName } from './a.js';
```

::: warning 注意：
import命令具有提升效果，会提升到整个模块的头部，首先执行。

下面的代码不会报错，因为import的执行早于foo的调用。这种行为的本质是，import命令是编译阶段执行的（后面对比CommonJs时会讲到），在代码运行之前。

```js
foo();
import { foo } from 'my_module';
```

:::

* 2）整体模块加载

```js
//user.js
export name = 'lili';
export age = 18;
//逐一加载
import { age, name } from './user.js';
//整体加载
import * as user from './user.js';
console.log(user.name);
console.log(user.age);
```

* 3）export default 命令

export default命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此export default命令只能使用一次。所以，import命令后面才不用加大括号，因为只可能唯一对应export default命令。

```js
export default function foo() {
  // 输出
  // ...
}
import foo from 'foo';
```

::: 注意：
正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。

```js
var a = 1;
export default a;// 错误// `export default a`的含义是将变量`a`的值赋给变量`default`。// 所以，这种写法会报错。
export default var a = 1;
```

:::

### 4、ES6模块、CommonJS和AMD模块区别

* 1） 编译时加载 和 运行时加载

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。所以ES6是编译时加载。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```js
// CommonJS模块
let { stat, exists, readFile } = require('fs');
// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readFile = _fs.readFile;

// -----------------// ES6模块

import { stat, exists, readFile } from 'fs';
```

CommonJS和ES6模块加载区别：

CommonJS 实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6模块 实质是从fs模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载 ”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。

2） 值拷贝 和 引用拷贝

前面 1.3 Node.js模块化提到了 CommonJS是值拷贝，模块加载完并输出一个值，模块内部的变化就影响不到这个值。因为这个值是一个原始类型的值，会被缓存。

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

```js
// a.js
export let counter = 3;
export function addCounter() {
  counter++;
}

// b.js
import { counter, addCounter } from './a';
console.log(counter); // 3

addCounter();
console.log(counter);// 4
```

ES6 模块输入的变量counter是活的，完全反应其所在模块a.js内部的变化。

## ES Module

ES Module 是原生实现的模块化方案，与 CommonJS 有以下几个区别:

* 1、CommonJS 支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案
* 2、CommonJS 是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
* 3、CommonJS 在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
* 4、ES Module 会编译成 require/exports 来执行的

```js
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```
