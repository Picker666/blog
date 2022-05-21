# webpack interview

## 1、谈谈你对Webpack的看法

* 1. Webpack是一个模块打包工具，可以使用它管理项目中的模块依赖，并编译输出模块所需的静态文件。
* 2. 它可以很好地管理、打包开发中所用到的HTML,CSS,JavaScript和静态文件（图片，字体）等，让开发更高效。
* 3. 对于不同类型的依赖，Webpack有对应的模块加载器，而且会分析模块间的依赖关系，最后合并生成优化的静态资源。

## 2、Webpack的基本功能有哪些

* 1. 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等等
* 2. 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等
* 3. 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
* 4. 模块合并：在采用模块化的项目有很多模块和文件，需要构建功能把模块分类合并成一个文件
* 5. 自动刷新：监听本地源代码的变化，自动构建，刷新浏览器
* 6. 代码校验：在代码被提交到仓库前需要检测代码是否符合规范，以及单元测试是否通过
* 7. 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

## 3、Webpack构建过程

[详解](/engineering/webpack/buildProcess.html)

webpack 的运行是一个串行的过程，从启动到结束一次会执行以下流程：

* 1. 初始化参数：从配置文件读取与合并参数，得出最终的参数；
* 2. 开始编译：用上一步得到的参数初始化  Compiler 对象，加载所有配置的插件，开始进行编译；
* 3. 确定入口：根据配置中的 entry 找到所有的入口文件；
* 4. 编译模块：从entry里配置的module开始，根据配置的loader去找对应的转换规则，递归解析entry依赖的所有module
* 5. 完成模块编译：在经历第四步使用loader转换完所有的模块后，得到了每个模块被转换后的最终内容以及他们的依赖关系；
* 6. 输出资源：根据入口文件和文件的依赖关系，组成一个个包含多个模块的 Chunk ，再把每个 Chunk 转换成一个独立的文件加入到输出列表，这步是可以修改内容的最后机会了；
* 7. 输出完成：再确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

以上过程中，webpack会在特定的时间点广播出特定的事件，插件在监听到感性却的事件后会执行特定的逻辑，并且插件可以调用webpack 提供的 API 改变 webpack的运行结果。

## 4、有哪些常见的Loader

* 1.file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
* 2.url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码 (处理图片和字体)
* 3. css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
* 4. style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
* 5. json-loader: 加载 JSON 文件（默认包含）
* 6. ts-loader: babel-loader：把 ES6 转换成 ES5
* 7. ts-loader: 将 TypeScript 转换成 JavaScript
* 8. less-loader：将less代码转换成CSS
* 9. eslint-loader：通过 ESLint 检查 JavaScript 代码
* 10. vue-loader:加载 Vue单文件组件

## 5、有哪些常见的Plugin

* 1. html-webpack-plugin：根据模板页面生成打包的 html 页面
* 2. uglifyjs-webpack-plugin：不支持 ES6 压缩 ( Webpack4 以前)
* 3. mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载
* 4. clean-webpack-plugin: 目录清理
* 5. copy-webpack-plugin: 拷贝文件
* 6. webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)

## 6、Loader和Plugin的区别

* 1. Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
* 2. Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
* 3. Loader 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。
* 4. Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。

## 7、Webpack 的热更新原理

Webpack 的热更新又称热替换（Hot Module Replacement），缩写为 HMR。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR的核心就是客户端从服务端拉去更新后的文件，准确地说是 chunk diff (chunk 需要更新的部分)，实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 Ajax 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该chunk的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 HotModulePlugin 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR。

## 8、如何优化 Webpack 的构建速度

* 1. 使用高版本的 Webpack 和 Node.js
* 2. 压缩代码
  * 1). 通过 uglifyjs-webpack-plugin 压缩JS代码
  * 2). 通过 mini-css-extract-plugin 提取 chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
* 3. 多线程/多进程构建：thread-loader, HappyPack
* 4. 压缩图片: image-webpack-loader
* 5. 缩小打包作用域
  * 1). exclude/include (确定 loader 规则范围)
  * 2). resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
  * 3). resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
  * 4). resolve.extensions 尽可能减少后缀尝试的可能性
  * 5). noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
  * 6). ignorePlugin (完全排除模块)
  * 7). 合理使用alias

* 6. 提取页面公共资源, 基础包分离
  * 1). 使用html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中。
  * 2). 使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件。

* 7. 充分利用缓存提升二次构建速度：
  * babel-loader 开启缓存
  * terser-webpack-plugin 开启并行压缩
  * 使用 cache-loader 或者hard-source-webpack-plugin

* 8. Tree shaking

打包过程中检测工程中没有引用过的模块并进行标记，在资源压缩时将它们从最终的bundle中去掉(只能对ES6 Modlue生效) 开发中尽可能使用ES6 Module的模块，提高tree shaking效率

禁用 babel-loader 的模块依赖解析，否则 Webpack 接收到的就都是转换过的 CommonJS 形式的模块，无法进行 tree-shaking

使用 PurifyCSS(不在维护) 或者 uncss 去除无用 CSS 代码

purgecss-webpack-plugin 和 mini-css-extract-plugin配合使用(建议)

* 9. Scope hoisting

构建后的代码会存在大量闭包，造成体积增大，运行代码时创建的函数作用域变多，内存开销变大。Scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止变量名冲突。

## 9、webpack 优点

* 1、专注模块化的项目，能做到开箱即用，一步到位；
* 2、通过plugin扩展，完整好用又不失零活；
* 3、通过loaders扩展，可以让 webpack 把所有的类型的文件都解析打包；
* 4、社区庞大、活跃，经常引入跟随时代发展的新特性，能为大多数场景找到已有的开源扩展。

## 10、webpack、grunt 和 gulp的区别

* 1、三者的区别

  * 三个都是前端构建工具，grunt和gulp在早期比较流行，现在webpack相对来说比较主流，不过一些轻量级的任务还是会用gulp 来处理，比如单独打包css文件；
  * grunt 和 gulp 是基于任务和流（task 和 stream）的。类似JQuery，找到一个（或者一类）文件，对其一系列链式操作，更新流上的数据整条链式操作构成一个任务，多个任务就构成了整个web的构建流程；
  * webpack 是基于 入口的。webpack 会自动地递归解析入口所需要加载的所有资源文件，然后用不同的Loader来处理不同的文件，用Plugin来扩招webpack的功能。

* 2、从构建思路上来说
  grunt和gulp需要开发者将整个前端构建过程拆分成多个Task，并合理的控制所有的Task的调用关系，webpack 需要开发者找到入口，并需要清楚对于不同的资源应该使用什么Loader做何解析和加工；

* 3、背景
  gulp更像是后端的开发思路，需要对于整个流程了如执掌 webpack更倾向于前端开发的思路。