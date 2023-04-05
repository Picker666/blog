# 模块化进化史

[CommonJS、AMD、CMD、ES6模块化区别详细总结](https://blog.csdn.net/weixin_45709829/article/details/124138115)

## 1、文件划分方式

早期约定每个文件就是一个单独的模块，使用模块时可以通过 script 标签引入模块，然后就可以使用各个模块内的方法和变量。

缺点：

* 所有的模块直接在全局工作，大量的模块成员污染了全局作用域；
* 没有私有空间，所有的模块内的成员都可以在模块外部被访问或者修改；
* 模块增多，容易引起命名冲突；
* 无法管理模块与模块之间的依赖关系；
* 在开发和维护的过程中，很难区分每个成员所属的模块。

## 2、命名空间方式

预定每个模块只允许暴露一个成员变量，所有的模块成员都挂载到这个成员上。

```js
// modeles-a.js
window.modulesA = {
  method1: function () {
    console.log('picker 666');
  }
}

// modeles-b.js
window.modulesB = {
  data: 'some data for anything you want.',
  method1: function () {
    console.log('picker 确实 666');
  }
}
```

解决问题：

* 一定程度上解决模块成员之前的命名冲突。

缺点：

* 模块成员仍然挂载到全局，同样存在全局污染
* 所有的模块内的成员都可以在模块外部被访问或者修改；
* 无法管理模块与模块之间的依赖关系；
* 在开发和维护的过程中，很难区分每个成员所属的模块。

## 3、IIFE（立即执行函数）

在第二阶段的基础上新增了匿名函数,把模块的成员方到匿名函数内部，然后再挂载到全局；

```js
//  modules-a.js
(function() {
  var name = 'modules-a';

  function method1 () {
    console.log('IIFE 666');
  }

  window.modulesA = {
    method1: method1
  }
})();

//  modules-b.js
(function() {
  var name = 'modules-b';

  function method1 () {
    console.log('IIFE 确实 666');
  }

  window.modulesB = {
    method1: method1
  }
})();
```

解决问题：

有了私有空间和私有成员，私有成员仅仅存在与模块内部，只能通过闭包方式访问。

* 解决了全局作用域的污染和命名冲突的问题；

## 4、IIFE 依赖参数

匿名函数可以传递参数，以此来作为模块的依赖。

```js
// modules-a.js
(function($){
  var name = 'modules-a';

  function method1 () {
    console.log('IIFE 666');
    $('body').animate({margin: '100px'});
  }

  window.modulesA = {
    method1: method1
  }
})(jQuery)
```

解决的问题：

* 解决了全局作用域的污染和命名冲突的问题；
* 依赖关系变得更加明显。

::: tip

以上的方式都没有解决模块的加载问题，都是将模块通过 script 标签引入的方式时间模块加载，也就意味着模块的加载不受代码控制
，就会存在一些问题，如：

* 某个模块需要依赖jQuery ，但是我们忘记了引入；
* 某个模块不被任何一个模块依赖，忘记移除；

所以，更为理想的方式是，在页面中引入一个js入口文件，其余用到的模块可以通过代码控制，`按需加载`。

另外，模块化的方式需要一个行业标准去 规范模块化实现方式。

总结：

* 一个统一化的模块化标准规范；
* 一个可以自动加载模块的基础库。
:::

## 5、CommonJS

CommonJS是`Nodejs`中所遵循的模块化规范，该规范一个文件就是一个模块，每个模块都有单独的作用域，在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见.

通过 `modules.exports`导出成员，再通过 `require` 函数载入模块。

但是，在浏览器端会存在一些问题：

* CommonJS 是启动时**同步加载**模块，在浏览器端会导致**大量同步请求**，进而导致长时间页面空白。
* 浏览器不兼容CommonJS的根本原因，在于缺少四个Node.js环境的变量。`module`、`exports`、`require`、`global` 只要能够提供这四个变量，浏览器就能加载 CommonJS 模块。

::: warning

* exports 是模块内的私有局部变量，它只是指向了 module.exports，所以直接对 exports **赋值是无效的**，这样只是让 exports 不再指向 module.exports了而已
* require 命令的基本功能是，**读入并执行**一个 js 文件，然后返回该模块的 exports 对象；
* 第一次加载某个模块时，Node.js 会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 module.exports 属性返回了
* CommonJS 模块的加载机制是，require 的是被导出的**值的拷贝**。也就是说，一旦导出一个值，模块内部的变化就影响不到这个值。
:::

[前端科普系列-CommonJS](https://zhuanlan.zhihu.com/p/113009496)

## 6、AMD（Asynchronous Modules Definition）

AMD是专门为浏览器端设计的一种规范，异步模块定义规范。

它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在回调函数中，等到加载完成之后，这个回调函数才会运行。

::: tip
require.js

除了实现模块规范，本身也是一个非常强大的模块加载器。
:::

```js
// AMD 规范定义一个模块
define(['jquery', './modules-a.js'], function($, modulesA) {

  // some  code

  // 模块导出
  return {
    start: function() {
      $('body').anmate({width: '100px'});
      modulesA();
    }
  }
})

// AMD 规范加载一个模块
require(['jquery', './modules-a.js'], function($, modulesA) {

  // some  code

  // 模块导出
  return {
    start: function() {
      $('body').anmate({width: '100px'});
      modulesA();
    }
  }
})

```

在require内部自动会创建 script 标签并且加载并执行对应的模块；

目前大多数第三方库都支持 AMD 规范；

但是，**当页面的模块划分比较细致的时候，可能存在同一个页面中对一个模块请求次数过多的情况**，导致运行效率低。

## 7、CMD （Common Module Definition）

CMD是SeaJS 在推广过程中对模块定义的规范化产出。因此与AMD类似的，在使用CMD时，也需要引入第三方的库文件 ---- SeaJS。

SeaJS也是主要解决两个问题：

* 多个JS文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器。
* JS加载的时候，浏览器会停止渲染页面，加载文件越多，浏览器失去响应时间越长。

通过上述特点，不难看出CMD与AMD非常相似，只不过在模块定义方式和模块加载时机上两者存在不同。

```js
define(factory);

define({"uName":"xdl"});//factory是对象
 
define('Hello world,my name is {{name}}.');    //factory是字符串


define(function(require, exports, module) {
  var aM = require('./aM');        // 引入aM模块，这里是相对路径
  aM.doSomething();  


// 异步加载一个模块，在加载完成时，执行回调
  require.async('./aModule', function(aModule) {
    aModule.doSomething();
  });
 
  // 异步加载多个模块，在加载完成时，执行回调
  require.async(['./bModule', './cModule'], function(bModule, cModule) {
    bModule.doSomething();
    cModule.doSomething();
  })

  // 对外提供 uName 属性
  exports.uName = 'xdl';
 
  // 对外提供 doSomething 方法
  exports.doSomething = function() {
    console.log('Hello world!');
  };

  // 通过 return 直接提供接口
  return {
    uName: 'xdl',
    doSomething: function() {
        console.log('Hello world');
    }
  };

  module.exports = {
      uName: 'xdl',
      doSomething: function() {
          console.log('Hello world!');
      }
  }

  // exports 是 module.exports 的一个引用
  console.log(module.exports === exports); // true
 
  // 重新给 module.exports 赋值为 XXXCLass 类的一个实例
  module.exports = new XXXClass();
 
  // exports 不再等于 module.exports
  console.log(module.exports === exports); // false
})
```

与之前介绍的 AMD 规范相比，CMD 规范在尽量保持简单同时，能够与 CommonJS 和 Node.js 的 Modules 规范保持很强的兼容性。

通过 CMD 规范书写的模块，可以很容易在 Node.js 中运行。

## 8、ES Modules

* 在 Node.js 环境，遵循 CommonJs规范来组织模块；
* 在浏览器环境中，遵循 ES Modules 规范。

ES Modules 最初制定，很多浏览器并不支持，随着 webpack 等一系列的打包工具出现，逐渐被主力浏览器接受，并且浏览器逐步的支持原生 ES Modules。

### 特点

* 自动采用严格模式，忽略 ' use strict';
* 每个 ESM 模块都是单独的私有作用域;
* ESM 是通过 CORS 跨域请求 去请求外部 JS 模块的;
* ESM 的 script 标签会延迟执行脚本 （等待网页渲染完成再执行脚本）;

### ES Module用法和注意事项

* 导出成员并不是一个字面量对象或里面的值，而是一个存放成员的**地址**，拿到成员会受到当前模块修改的影响；
* 在外部导入的成员，导入的模块成员是一个只读成员；
* import时不会去执行模块

[ES Modules 参考](https://zhuanlan.zhihu.com/p/448054417)

```js
// module.js
var fooo = 'es module 666';
export { fooo };

// app.js
import {fooo}from './module.js';
console.log(fooo);
```

## 9、四种比较成熟的模块加载方案

* 1、第一种是 CommonJS 方案，它通过 require 来引入模块，通过 module.exports 定义模块的输出接口。这种模块加载方案是服务器端的解决方案，它是以**同步**的方式来引入模块的，因为在服务端文件都存储在**本地磁盘**，所以读取非常快，所以以同步的方式加载没有问题。但如果是在浏览器端，由于模块的加载是使用网络请求，因此使用异步加载的方式更加合适；
* 2、第二种是 AMD 方案，这种方案采用**异步**加载的方式来加载模块，模块的加载不影响后面语句的执行，所有依赖这个模块的语句都定义在一个回调函数里，等到加载完成后再执行回调函数。require.js 实现了 AMD 规范；
* 3、第三种是 CMD 方案，这种方案和 AMD 方案都是为了解决异步模块加载的问题，sea.js 实现了 CMD 规范。它和require.js的区别在于模块**定义时对依赖的处理**不同和对依赖模块的**执行时机**的处理不同；
* 4、第四种方案是 ES6 提出的方案，使用 import 和 export 的形式来导入导出模块。

## 10、CommonJS 和 ES6

* 前者支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案,前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大;
* 而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响;
前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次;
* 但是后者采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化;
* 后者会编译成 require/exports 来执行的。

## 11、AMD 和 CMD

* 第一个方面是在**模块定义时对依赖的处理不同**。AMD推崇依赖前置，在**定义模块的时候就要声明其依赖的模块**。而 CMD 推崇就近依赖，只有在**用到某个模块的时候再去 require**。
* 第二个方面是**对依赖模块的执行时机处理不同**。首先 AMD 和 CMD 对于模块的加载方式都是**异步加载**，不过它们的区别在于模块的执行时机，AMD 在依赖模块**加载完成后就直接执行**依赖模块，依赖模块的执行顺序和我们书写的顺序**不一定一致**。而 CMD在依赖模块**加载完成后并不执行**，只是下载而已，等到所有的依赖模块都加载好后，进入回调函数逻辑，**遇到 require 语句的时候才执行**对应的模块，这样模块的执行顺序就和我们书写的顺序保持一致了。

## 12、总结

* 1、AMD ：requirejs 在推广过程中对模块定义的规范化产出，**提前执行，推崇依赖前置**；
* 2、CMD ：seajs 在推广过程中对模块定义的规范化产出，**延迟执行，推崇依赖就近**；
* 3、CommonJs ：模块输出的是一个值的 **copy**，运行时加载，加载的是一个对象（module.exports 属性），该对象只有在**脚本运行完才会生成**；
* 4、ES6 Module ：模块输出的是一个值的**引用**，编译时输出接口，ES6模块不是对象，它对外接口只是一种静态定义，在代码静态解析**阶段就会生成**。
