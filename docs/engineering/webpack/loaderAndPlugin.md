# Webapck 的 loader 和 plugin

## 区别

* 作用
  * loader是文件加载器，能够加载资源文件，并对文件进行一些**转换**，如**编译**，**压缩** 等，最终一起打包到指定的文件中。
  * plugin赋予了webpack各种灵活的功能，如**打包优化**，**资源管理**，**环境变量**，**注入**等，目的是为了解决loader无法实现的功能。

* 作用时机
  * loader运行在项目打包之前；
  * plugins运行在整个项目的编译时期；

* 工作方式
  * 在Webpack运行的整个生命周期中会广播出许多事件，Plugin会监听这些事件，在合适的事件通过 webpack 提供的 api 改变输出结果。
  * 对于 loader 而言，它实质上是一个转换器，将A文件编译成B文件，操作的是 文件 ，比如将A文件编译成B文件，单纯的是一个文件转换过程。

## 编写loader

在编写 loader 之前，我们需要先理解 loader 的本质，loader 的本质是一个**函数**，函数中的 this 作为上下文会被 webpack 填充，因此我们**不能将  loader 为一个箭头函数**。

函数接受**一个参数**，这个参数为 webpack  传递给  loader 的文件源内容。

函数中的  this 是 webpack  提供的对象，能够获取当前 loader  所需要的各种信息。

函数中有异步操作或者是同步操作的时候，异步操作会通过 **this.callback** 返回，返回值要为 string 或者 Buffer 。

```JS
// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function(source) {
    const content = doSomeThing2JsString(source);
    
    // 如果 loader 配置了 options 对象，那么this.query将指向 options
    const options = this.query;
    
    // 可以用作解析其他模块路径的上下文
    console.log('this.context');
    
    /*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */
    this.callback(null, content); // 异步
    return content; // 同步
}
```

::: warning
一般在做 loader  的功能装换的时候，保持功能单一，避免做多种功能。
:::

## 编写plugin

由于 webpack 基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件会通过监听这些事件，就可以在特定的阶段执行自己的插件任务。

webpack 编译会创建两个核心对象：

* compiler：包含了 webpack 环境**所有的 配置信息**，包括了 options，loader，plugin，和 webpack 整个**生命周期有关的钩子**。
* compilation: 作为 plugin 内置事件回调函数的参数，包含了当前的 **模块资源**，编译**生成资源**，**变化的文件** 以及 **被跟踪的文件** 的状态信息，当检测到了一个文件发生了改变的时候，就会生成一个新的 Compilation 对象。

创建自己的 plugin，也需要遵循一定的规范：

* 插件必须是一个函数或者是一个包含了 apply 方法的对象，这样才能够访问 Compiler 对象。
* 传给每一个插件的 compiler 和 compilation 对象都是同一个应用，因此不建议修改。
* 异步的事件需要在插件处理完任务和调用回调函数通知 webpack 进入下一个流程，不然会卡住。

实现 plugin 的模块如下：

```js
class MyPlugin {
  constructor(options) {
    console.log(options);
  }

    // Webpack 会调用 MyPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply (compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', compilation => {
        // compilation: 当前打包构建流程的上下文
        console.log(compilation);
        
        // do something...
    })
  }
}
```

比如我们可以在构建完成之后，打开一个提示窗口。

```js
class Notifier {
  apply(compiler) {
    compiler.plugin("done", (stats) => {
      const pkg = require("./package.json");
      const notifier = require("node-notifier");
      const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

      notifier.notify({
        title: pkg.name,
        message: `WebPack is done!\n${stats.compilation.errors.length} errors in ${time}s`,
        contentImage: "https://path/to/your/logo.png",
      });
    });
  }
}

module.exports = Notifier;
```

## plugin 扩展

在 emit 事件发生的时候，代表源文件的转换和组装已经完成，可以读取到最终将输出的 资源，代码块，模块，依赖，并且可以修改输出资源的内容。

webpack构建的主要钩子：

* entry-option: 入口操作
* compile：编译
* make：分析模块的依赖
* build-module：构建模块，调用loader处理
* normal-build-loader：acorn编译构建后的module生成ast树
* program：处理生成的ast后面的依赖收集
* seal：封装模块
* emit：生成文件

compiler和compilation都继承于Tapable

webpack的插件是基于Tapable的，Tapable允许你添加和应用插件到javascript模块中，类似于 NodeJS的EventEmitter，可以被继承和mixin到其他模块中

其中关键的方法是

* plugin(name:string, handler:function)
* apply(...pluginInstances: (AnyPlugin|function)[])
* applyPlugins*(name:string, ...)
* mixin(pt: Object)

tapable主要负责处理事件，采用的是发布订阅模式，apply相当于trigger，plugin相当于addEventListener

```JS
Tapable.prototype.plugin = function plugin(name, fn) {
  if(Array.isArray(name)) {
    name.forEach(function(name) {
      this.plugin(name, fn);
    }, this);
    return;
  }
  if(!this._plugins[name])
    this._plugins[name] = [fn];
  else
    this._plugins[name].push(fn);
};
```

plugin方法将插件对应的方法加入一个数组中、注册到事件(name)上，等待apply的时候串行调用/触发

Compilation中做了很多事情，处理编译过程。所对应的方法，如addEntry ，buildModule，processModuleDependencies，createChunkAssets，seal等
