---
sidebarDepth: 3
---

# webpack 优化

## 一、影响webpack性能的因素

如果我们在构建项目中使用了大量的loader和第三方库，会使我们构建项目的**时间过长**，打包之后的代码**体积过大**。于是，就遇到了webpack 的优化瓶颈,总结webpack影响性能主要是两个方面：

* webpack 的构建过程太花时间
* webpack 打包的结果体积太大

## 二、webpack 优化解决方案

### 1、合理使用loader

* 用 test，include 或 exclude 来帮我们避免不必要的转译，优化loader的管辖范围。

比如 webpack 官方在介绍 babel-loader 时给出的示例：

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}
```

### 2、缓存babel编译过的文件

```js
loader: 'babel-loader?cacheDirectory=true'
```

如上，我们只需要为 loader 增加相应的参数设定。选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升**两倍**。

像dll第三方类库的本质也是**减少打包类库次数 ， 实现代码抽离 ，减少打包以后的文件体积**。

### 3、使externals优化cdn静态资源

我们可以将些JS件存储在CDN上(减少Webpack打包出来的js体积)，在index.html中通过标签引，如:

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="ie=edge">
 <title>Document</title>
</head>
<body>
 <div id="root">root</div>
 <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
</body>
</html>
```

我们希望在使时，仍然可以通过import的式去引(如：import $ from 'jquery' )，并且希望webpack不会对其进打包，此时就可以配置 externals 。

```js
//webpack.config.js
module.exports = {
//...
externals: {
//jquery通过script引之后，全局中即有了 jQuery 变量
'jquery': 'jQuery'
 }
}
```

### 4、DLLPlugin类库引入

处理第三方库的姿势有很多：

* Externals 会引发重复打包的问题；[详见](https://juejin.cn/post/6844903439999172622)
* 而CommonsChunkPlugin 每次构建时都会重新构建一次 vendor；
* 出于对效率的考虑，DllPlugin是最佳选择。

DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

用 DllPlugin 处理文件，要分两步走：

* （1）、基于 dll 专属的配置文件，打包 dll 库。
* （2）、基于 webpack.config.js 文件，打包业务代码。

以一个基于 React 的简单项目为例，我们的 dll 的配置文件可以编写如下：

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
      // 依赖的库数组
      vendor: [
        'prop-types',
        'babel-polyfill',
        'react',
        'react-dom',
        'react-router-dom',
      ]
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      library: '[name]_[hash]',
    },
    plugins: [
      new webpack.DllPlugin({
        // DllPlugin的name属性需要和libary保持一致
        name: '[name]_[hash]',
        path: path.join(__dirname, 'dist', '[name]-manifest.json'),
        // context需要和webpack.config.js保持一致
        context: __dirname,
      }),
    ],
}
```

编写完成之后，运行这个配置文件，我们的 dist 文件夹里会出现这样两个文件：`vendor-manifest.json` 和 `vendor.js`。

vendor.js 不必解释，是我们第三方库打包的结果。

这个多出来的 vendor-manifest.json，则用于描述每个第三方库对应的具体路径，我这里截取一部分给大家看下：

```js
{
  "name": "vendor_397f9e25e49947b8675d",
  "content": {
    "./node_modules/core-js/modules/_export.js": {
      "id": 0,
        "buildMeta": {
        "providedExports": true
      }
    },
    "./node_modules/prop-types/index.js": {
      "id": 1,
        "buildMeta": {
        "providedExports": true
      }
    },
    ...
  }
}
```

随后，我们只需在 webpack.config.js 里针对 dll 稍作配置：

```js
const path = require('path');
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  // 编译入口
  entry: {
    main: './src/index.js'
  },
  // 目标文件
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js'
  },
  // dll相关配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest就是我们第一步中打包出来的json文件
      manifest: require('./dist/vendor-manifest.json'),
    })
  ]
}
```

### 5、CodeSplit

在生产环境下，webpack 默认开启了 CodeSplit，它会有一套最佳实践的默认配置，但是对于你的项目可能会略有不同。下面列出了配置项的解释：

```js
splitChunks: {
    chunks: "async", // 可选值 "initial", "async" and "all"， 代表同步导入、异步导入、两个都包括
    minSize: 30000,  // 被分割的文件大小 最小为 30kb，只有被分割的代码加起来大于这个 size，才会分割一个单独文件，否则就不分割
    maxSize: 60000, // 最大的文件大小，maxSize只是一个提示，当模块大于maxSize 可能会违反给定的规则
    maxAsyncSize: 60000,// 按需加载时的最大文件大小, 不设置等于 maxSize
    maxInitialSize: 60000, // 页面初始化加载时的最大文件大小，不设置等于 maxSize
    minRemainingSize: 0, // 打包时的最后一个 chunk 的大小不小于其给定的值，development 下默认为 0, production 模式下默认值等于 minSize
    minChunks: 1,    // 打包出来的 chunck 有 1 一个以上的chunck对其进行了引用, 
    maxAsyncRequests: 5, // 通过代码分割最终分离出来的后，页面在进行加载时，按需加载时的最大并行请求数，相当于文件数。
    maxInitialRequests: 3, // 页面初始化时的最大并行请求数
    automaticNameDelimiter: '~', // 分割符
    automaticNamePrefix: '', // 设置前缀
    name: true, // chunk 的名字，设置为 true 会基于 cacheGroup 的 key 和 chunk 来取名，也可以传递一个 function
    cacheGroups: { // 可以重写 splitChunks 中的任何选项
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    other: {
            enforce: false, // 忽略 splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequests 并且总是为这个 cacheGroup 创建 chunk
            filename: '', // 页面初始化时的 chunk 名称
            idHint: 'vendors',
            test: /[\\/]src[\\/]/, // 可以是一个路径，也可以是一个 chunkName, 如果一个 chunkName 被匹配到，那个所有这个 chunk 中的 module 将会被选中
            minChunks: 2,     // 打包出来的 chunck 有 2 一个以上的chunck对其进行了引用， 例如 如果只有一个地方对 lodash 进行了引用，那么不会对 lodash 进行代码分割
            priority: -20, // 优先级 值越大优先级越高
            reuseExistingChunk: true // 防止分割的代码当中包含重复的，如果当前块包含已经分离出来的模块，它将被重用，而不是生成一个新的。这可能会影响块的结果文件名。
        }
    }
}
```

在 CodeSplit 的基础之上，我们可以使用导入语法 import() 来实现按需加载，从而降低代码体积。

```js
import(/* webpackChunkName: "lodash" */ 'lodash').then(({ default: _ }) => {
   _.join(['hello'], ['webpack'])
})
```

CodeSplit 会把动态导入的模块单独生成一个文件，使用时再进行下载。

webpack 4.6.0 之后支持了 prefetching 和 preloading，即预加载。使用方法分别如下：

```js
????
import(/* webpackPrefetch: true */ 'lodash').then(({ default: _ }) => {
   _.join(['hello'], ['webpack'])
})
import(/* webpackPreload: true */ 'lodash').then(({ default: _ }) => {
   _.join(['hello'], ['webpack'])
})
```

两者的区别在于：

* prefetch：使用 prefetch 加载的文件在未来可能会用到，所以 webpack 会在父组件 loaded 后将以下标签添加到 head 标签内，并在浏览器有**空闲时间**的时候去下载该文件。

```html
<link rel="prefetch" href="xxxxx"> 
```

* preload：加载的文件需要立即用到，在浏览器的**主渲染机制介入前**就进行预加载，这一机制使得资源可以更早的得到加载并可用，且更不易阻塞页面的初步渲染，进而提升性能。

```html
<link rel="preload" href="xxxxx"> 
```

### 6、happypack多线程编译

我们都知道nodejs是单线程。无法一次性执行多个任务。这样会使得所有任务都排队执行。happypack可以根据cpu核数优势，建立子进程child_process,充分利用多核优势解决这个问题。提高了打包的效率。

```js
const HappyPack = require('happypack')
// 手动创建进程池
const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  module: {
    rules: [
      ...
      {
        test: /\.js$/,
        // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
        loader: 'happypack/loader?id=happyBabel',
        ...
      },
    ],
  },
  plugins: [
    ...
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory']
    })
  ],
}
```

happypack成功，启动了三个进程编译。加快了loader的加载速度。

### 7、并行压缩 terser-webpack-plugin

使用 terser-webpack-plugin 插件

配置

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true
            })
        ]
    }
}
```

### 8、scope Hoisting

scope Hoisting的作用是分析模块之前的依赖关系 ， 把打包之后的公共模块合到同一个函数中去。它会代码体积更小，因为函数申明语句会产生大量代码；代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');

module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
  ],
};
```

### 9、tree Shaking 删除冗余代码

Tree-Shaking可以通过分析出import/exports依赖关系。对于没有使用的代码。可以自动删除。这样就减少了项目的体积。

举个例子：

```js
import { a, b } from './pages'
a()
```

pages 文件里，我虽然导出了两个页面：

```js
export const a = ()=>{ console.log(666) }
export const b = ()=>{ console.log(666) }
```

所以打包的结果会保留这部分：

```js
export const a = ()=>{ console.log(666) }
```

b方法直接删掉，这就是 Tree-Shaking 帮我们做的事情。删掉了没有用到的代码。

Tree Shaking 是一个术语，在计算机中表示消除死代码，依赖于ES Module的静态语法分析（不执行任何的代码，可以明确知道模块的依赖关系）

在webpack实现Tree shaking有两种不同的方案：

* usedExports：通过标记某些函数是否被使用，之后通过Terser来进行优化的
* sideEffects：跳过整个模块/文件，直接查看该文件是否有副作用

两种不同的配置方案， 有不同的效果

#### usedExports

配置方法也很简单，只需要将usedExports设为true

```js
module.exports = {
    ...
    optimization:{
        usedExports
    }
}
```

使用之后，没被用上的代码在webpack打包中会加入unused harmony export mul注释，用来告知 Terser 在优化时，可以删除掉这段代码

#### sideEffects

sideEffects用于告知webpack compiler哪些模块时有副作用，配置方法是在package.json中设置sideEffects属性
如果sideEffects设置为false，就是告知webpack可以安全的删除未用到的exports
如果有些文件需要保留，可以设置为数组的形式

```js
"sideEffecis":[
    "./src/util/format.js",
    "*.css" // 所有的css文件
]
```

上述都是关于javascript的tree shaking，css同样也能够实现tree shaking

### 10、按需加载

像vue 和 react spa应用，首次加载的过程中，由于初始化要加载很多路由，加载很多组件页面。会导致 首屏时间 非常长。一定程度上会影响到用户体验。所以我们需要换一种按需加载的方式。一次只加载想要看到的内容

* require.ensure 形式

当我们不需要按需加载的时候，我们的代码是这样的

```js
import AComponent from '../pages/AComponent'
<Route path="/a" component={AComponent}>
```

为了开启按需加载，我们要稍作改动。

首先 webpack 的配置文件要走起来：

```js
output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath,
    // 指定 chunkFilename
    chunkFilename: '[name].[chunkhash:5].chunk.js',
},
```

```js
const getComponent => (location, cb) {
  require.ensure([], (require) => {
    cb(null, require('../pages/AComponent').default)
  }, 'a')
}
<Route path="/a" getComponent={getComponent}>
```

对，核心就是这个方法：

```js
require.ensure(dependencies, callback, chunkName)
```

* import形式

```js
import B from '@/pages/business/b.vue'
```

按需加载变成了：

```js
const B = () => import('@/pages/business/b.vue')
```

无论是require.ensure形式，还是import 形式的按需加载。都是采取**异步模式**，跳转 对应这个路由的时候，异步方法的回调才会生效，才会真正地去获取组件页面的内容。做到了按需加载的目的。

### 11、按需引入

不知道大家有没有体会到，当我们用antd等这种UI组件库的时候。明明只想要用其中的一两个组件，却要把整个组件库连同样式库一起引进来，就会造成打包后的体积突然增加了好几倍。为了解决这个问题，我们可以采取按需引入的方式。

拿antd为例，需要我们在.babelrc文件中这样声明，

```js
{
"presets": [
   [
    "@babel/preset-env",
    {
      "targets": {
          "chrome": "67"
      },
    "useBuiltIns": "usage",
     "corejs": 2
    }
   ],
    "@babel/preset-react"
 ],
  "plugins": [
  [
   "@babel/plugin-transform-runtime",
  ],
  //重点按需引入antd里面的style
  [  "import", {
   "libraryName": "antd",
   "libraryDirectory": "es",
   "style": true
  }]
 ]
}
```

经过如上配置之后，我们会发现体积比没有处理的要小很多。

### 12、优化resolve.modules

resolve.modules配置webpack去哪些目录下寻找第三方模块。默认是去node_modules目录下寻找。

有时你的项目中会有一些模块大量被其他模块依赖和导入，由于其他模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径，这个路径有时候会很长，例如：import './../../components/button'，这时你可以利用modules配置项优化，假如那些大量导入的模块都在./src/components目录下：

```js
modules:['./src/components', 'node_modules']
```

### 13、优化resolve.alias

resolve.alias配置通过别名来将原导路径映射成个新的导路径。拿react为例，我们引的react库，般存在两套代码：

cjs

采commonJS规范的模块化代码

umd

已经打包好的完整代码，没有采模块化，可以直接执

默认情况下，webpack会从件./node_modules/bin/react/index开始递归解析和处理依赖的件。我们可以直接指定件，避免这处的耗时。

```js
resolve: {
//查找第三方优化
modules: [path.resolve(__dirname, "./node_modules")],
alias: {
"@": path.join(__dirname, "./src"),
react: path.resolve(__dirname, "./node_modules/react/umd/react.production.min.js"),
"react-dom": path.resolve(__dirname, "./node_modules/react-dom/umd/react-dom.production.min.js")
  },
},
```

### 14、图片压缩

通常一个项目我们会引入很多各种格式的图片，多张图片被打包以后，如果不做压缩的话，体积还是相当大的，所以生产环境对图片体积的压缩就显得格外重要了。

方式

* 使用tinypng手动压缩，比较零碎，也不够自动化
* imagemin
* image-webpack-loader来进行自动压缩

```js
module.exports = {
    module: {
        {
            test: /\.(jpg|jpeg|png|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        outputPath: "img/",
                        name: "[name]-[hash:6].[ext]"
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: {
                        progressive: true,
                        quality: 65
                      },
                      // optipng.enabled: false will disable optipng
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: '65-90',
                        speed: 4
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                      // the webp option will enable WEBP
                      webp: {
                        quality: 75
                      }
                    }
                }
            ]
        }
    }
}
```

### 15、动态Polyfill (优化构建体积)

通常我们在项目中会使用babel来将很多es6中的API进行转换成es5，但是还是有很多新特性没法进行完全转换，比如promise、async await、map、set等语法，那么我们就需要通过额外的polyfill（垫片）来实现语法编译上的支持。

![各个polyfill版本的优缺点](/blog/images/webpack/optimization1.png)

这里我们还是推荐使用第三种方式，由polyfill.io 官方为我们提供的服务。

我们可以先来使用polyfill.io 验证一下，在不同的User Agent，是会下发不同的polyfill。

### 16、resolve.extensions

resolve.extensions在导⼊语句没带⽂件后缀时，webpack会⾃动带上后缀后，去尝试查找⽂件是否存在。

* 后缀尝试列表尽量的⼩
* 导⼊语句尽量的带上后缀。

如果想优化到极致的话，不建议用extensionx, 因为它会消耗一些性能。虽然它可以带来一些便利。

### 17、抽离css

借助mini-css-extract-plugin:本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

### 18、css代码压缩

css-minimizer-webpack-plugin

### 19、Html文件代码压缩

html-minifier-terser

### 20、文件大小压缩

对文件的大小进行压缩，减少http传输过程中宽带的损耗

compression-webpack-plugin

### 21、css tree shaking

```js
const PurgeCssPlugin = require('purgecss-webpack-plugin')
module.exports = {
    ...
    plugins:[
        new PurgeCssPlugin({
            path:glob.sync(`${path.resolve('./src')}/**/*`), {nodir:true}// src里面的所有文件
            satelist:function(){
                return {
                    standard:["html"]
                }
            }
        })
    ]
}
```

* paths：表示要检测哪些目录下的内容需要被分析，配合使用glob
* 默认情况下，Purgecss会将我们的html标签的样式移除掉，如果我们希望保留，可以添加一个safelist的属性

### 22、babel-plugin-transform-runtime减少ES6转化ES5的冗余

Babel 插件会在将 ES6 代码转换成 ES5 代码时会注入一些辅助函数。在默认情况下， Babel 会在每个输出文件中内嵌这些依赖的辅助函数代码，如果多个源代码文件都依赖这些辅助函数，那么这些辅助函数的代码将会出现很多次，造成代码冗余。为了不让这些辅助函数的代码重复出现，可以在依赖它们时通过 require('babel-runtime/helpers/createClass') 的方式导入，这样就能做到只让它们出现一次。babel-plugin-transform-runtime 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。
