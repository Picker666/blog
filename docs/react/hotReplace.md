# react 热替换

* 1、webpack-dev-server 启动静态服务器，开通 socket 连接;
* 2、当文件发生修改的时候，webpack会监听到文件变化，然后对模块重新编译打包，并将打包后的代码通过简单对象保存在内存中；
* 3、webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中；
* 4、webpack-dev-server 对文件变化的一个监控，变化后会通知浏览器端对应用进行 live reload（配置文件中配置 devServer.watchContentBase： true ）；
* 5、websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，最主要信息还是新模块的 hash 值；
* 6、浏览器 将 更新信息传回给webpack，由 webpack 决定是模块热更新还是刷新浏览器；
* 7、浏览器根据新模块的hash值，发送ajax请求，获取到新模块的所有更新信息，然后在通过jsonp方式获取所要更新的代码；
* 8、HotModulePlugin 将对比新旧模块，决定是否更新新的模块，并检查新模块的依赖，更新依赖；
* 9、当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。
