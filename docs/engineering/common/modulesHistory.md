# 模块化进化史

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

::: TIP

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

CommonJS是Nodejs中所遵循的模块化规范，该规范一个文件就是一个模块，每个模块都有单独的作用域，通过 modules.exports导出成员，再通过 require 函数载入模块。

但是，在浏览器端会存在一些问题：

CommonJS 是启动时同步加载模块，在浏览器端会导致大量同步请求，进而导致长时间页面空白。

## 6、AMD（Asynchronous Modules Definition）

AMD是专门为浏览器端设计的一种规范，异步模块定义规范。

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

但是，当页面的模块划分比较细致的时候，可能存在同一个页面中对一个模块请求次数过多的情况，导致运行效率低。

## 7、ES Modules

* 在 Node.js 环境，遵循 CommonJs规范来组织模块；
* 在浏览器环境中，遵循 ES Modules 规范。

ES Modules 最初制定，很多浏览器并不支持，随着 webpack 等一系列的打包工具出现，逐渐被主力浏览器接受，并且浏览器逐步的支持原生 ES Modules。

```js
// module.js
var fooo = 'es module 666';
export { fooo };

// app.js
import {fooo}from './module.js';
console.log(fooo);
```
