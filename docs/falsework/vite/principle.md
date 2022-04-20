# Vite 原理分析

![vite](/blog/images/vite/vitePrinciple1.awebp)

## Vite 是什么

::: tip
作者原话: Vite，一个基于浏览器原生 ES Modules 的开发服务器。利用浏览器去解析模块，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。
:::

Vite(读音类似于[weɪt]，法语，快的意思) 是一个由原生 ES Module 驱动的 Web 开发构建工具。在开发环境下基于浏览器原生 ES imports 开发，在生产环境下基于 Rollup 打包。

## Vite 的特点

* Lightning fast cold server start  - 闪电般的冷启动速度
* Instant hot module replacement (HMR) - 即时热模块更换（热更新）
* True on-demand compilation - 真正的按需编译

为了实现上述特点，Vite 要求项目完全由 ES Module 模块组成，common.js 模块不能直接在 Vite 上使用。因此不能直接在生产环境使用。在打包上依旧还是使用 rollup 等传统打包工具。因此 Vite 目前更像是一个类似于 webpack-dev-server 的开发工具.

## ES Modules

ES Modules 是浏览器支持的一种模块化方案，允许在代码中实现模块化。关于 ES Module 的更多介绍 以 vite 自带的 demo 为例子。

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>
<script>
import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

当浏览器解析 import HelloWorld from './components/HelloWorld.vue'时，会往当前域名发送一个请求获取对应的资源。

![vite](/blog/images/vite/vitePrinciple2.awebp)

::: tip
值得一提的是我们平时在 Webpack 中写的 mjs 格式的代码最终被 Webpack 打包成 cjs。最终在浏览器上还是以 cjs 的形式运行的。所以并不是 真正的 mjs。
:::

## 浏览器兼容性

Vite 采用了 ES Module 来实现 模块的加载。目前基于 web 标准的ES Module 已经覆盖了超过90%的浏览器。

![vite](/blog/images/vite/vitePrinciple3.awebp)

## Webpack VS Vite

### 打包和热更新

当我们使用如 webpack 的打包工具时，经常会遇到改动一小行代码，webpack 常常需要耗时数秒甚至十几秒进行重新打包。这是因为 webpack 需要将所有模块打包成一个一个或者多个模块。

![vite](/blog/images/vite/vitePrinciple4.awebp)

如下面的代码为例，当我们使用如 webpack 类的打包工具时。最终会将所有的代码打包入一个 bundle.js 文件中。

```js
// a.js 
export const a = 10

// b.js 
export const b = 20;

// main.js 
import { a } from 'a.js'
import { b } from 'b.js'
export const getNumber = () => {
    return a + b;
}

// bundle.js
const a = 10;
const b = 20;
const getNumber = () => {
    return a + b;
}
export { getNumber };
```

不可避免的，当我们修改模块中的一个子模块b.js，整个bundle.js 都需要重新打包，随着项目规模的扩大，重新打包(热更新)的时间越来越长。我们常用如 thread-loader , cache-loader ,代码分片等方法进行优化。但随着项目规模的进一步扩大，热更新速度又将变慢，又将开始新一轮的优化。随着项目规模的不断扩大,基于 bunder 构建的项目优化也将达到一定的极限。

![vite](/blog/images/vite/vitePrinciple5.awebp)

::: tip
Webpack 之所以慢，是因为 Webpack 会将许多资源构成一个或者多个 bundle 。如果我们跳过打包的过程，当需要某个模块时再通过请求去获取是不是能完美解决这个问题呢？
:::

![vite](/blog/images/vite/vitePrinciple6.awebp)

因此，Vite 来了。一个由原生 ES Module 驱动的 Web 开发构建工具，完全做到按需加载，一劳永逸的解决了热更新慢的问题！

### 冷启动速度对比

![vite](/blog/images/vite/vitePrinciple16.awebp)

从左到右依次是: vue-cli3 + vue3 的demo, vite 1.0.0-rc + vue 3的demo， vue-cli3 + vue2的demo。
在这个 gif 中已经可以明显感受到 vite 的优势了。vue-cli3 启动Vue2大概需要5s左右，vue-cli3 启动Vue3需要4s左右，而vite 只需要1s 左右的时间。
从理论上讲 Vite 是ES module 实现的。随着项目的增大启动时间也不会因此增加。而 Webpack 随着代码体积的增加启动时间是要明显增加的。

### 热更新速度对比

Vite 热更新速度很难用图直接比较（在项目较小时热更新速度都挺快的)，只能从理论上讲讲，因为 Vite 修改代码后只是重新请求修改部分的代码不受代码体积的影响，而且使用了esbuild这种理论上快webpack打包几十倍的工具。所以相比于webpack这种每次修改都需要重新打包 bundle 的项目是能明显提升热更新速度的。

## Vite 实现

### 请求拦截原理

Vite 的基本实现原理，就是启动一个 koa 服务器拦截浏览器请求ES Module的请求。通过 path 找到目录下对应的文件做一定的处理最终以 ES Modules 格式返回给客户端

![vite](/blog/images/vite/vitePrinciple7.awebp)

这里稍微提一下Vite 对 js/ts 的处理没有使用如 gulp, rollup 等传统打包工具，而是使用了 esbuild。esbuild 是一个全新的js打包工具，支持如babel, 压缩等的功能，他的特点是快(比 rollup 等工具会快上几十倍)！你可以点击这里了解更多关于esbuild的知识

![vite](/blog/images/vite/vitePrinciple8.awebp)

而快的主要原因是他使用了 go 作为底层语言(go 这样的静态语言会比 动态语言 快很多)。

### node_modules 模块的处理

首先说一下 基于 ES Module 模块的局限性，在我们平时写代码时。如何不是相对路径的引用,而是直接引用一个 node_modules模块时，我们都是以如下的格式进行引用。

```js
import vue from 'vue'
```

如 Webpack & gulp 等打包工具会帮我们找到模块的路径。但浏览器只能通过相对路径去寻找。为了解决这个问题，Vite对其做了一些特殊处理。以 Vite 官方 demo 为例，当我们请求 localhost:3000

![vite](/blog/images/vite/vitePrinciple9.awebp)

Vite 先返回 index.html 代码, 渲染 index.html 后 发送请求src/main.js。 main.js 代码如下。

```js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
createApp(App).mount('#app')
```

![vite](/blog/images/vite/vitePrinciple10.awebp)

可以观察到浏览器请求 vue.js 时， 请求路径是 @modules/vue.js。 在 Vite 中约定若 path 的请求路径满足 /^/@modules// 格式时，被认为是一个 node_modules 模块。

* 如何将代码中的 /:id 转化为 /@modules/:id

Vite 对 ES module 形式的js文件模块的处理使用了 ES Module Lexer 处理。Lexer 会返回js文件中导入的模块并以数组形式返回。Vite 通过该数组判断是否为一个 node_modules 模块。若是则进行对应重写。

```js
// Plugin for rewriting served js.
// - Rewrites named module imports to `/@modules/:id` requests, e.g.
//   "vue" => "/@modules/vue"
export const moduleRewritePlugin: ServerPlugin = ({
  root,
  app,
  watcher,
  resolver
}) => {
  app.use(async (ctx, next) => {
    await initLexer
    const importer = removeUnRelatedHmrQuery(
      resolver.normalizePublicPath(ctx.url)
    )
    ctx.body = rewriteImports(
      root,
      content!,
      importer,
      resolver,
      ctx.query.t
    )
  }
})
```

我们还能有另一个形式进行一个ES module 形式的导入，那就是直接使用script标签，对于 script标签导入的模块也会有对应的处理。

```js
const scriptRE = /(<script\b[^>]*>)([\s\S]*?)<\/script>/gm
const srcRE = /\bsrc=(?:"([^"]+)"|'([^']+)'|([^'"\s]+)\b)/  
async function rewriteHtml(importer: string, html: string) {
  await initLexer
  html = html!.replace(scriptRE, (matched, openTag, script) => {
    if (script) {
    } else {
      const srcAttr = openTag.match(srcRE)
      if (srcAttr) {
        // register script as a import dep for hmr
        const importee = resolver.normalizePublicPath(
          cleanUrl(slash(path.resolve('/', srcAttr[1] || srcAttr[2])))
        )
        ensureMapEntry(importerMap, importee).add(importer)
      }
      return matched
    }
  })
  return injectScriptToHtml(html, devInjectionCode)
}
```

* 通过 /@modules/:id 在 node_modules 文件下找到对应模块

浏览器发送 path 为 /@modules/:id 的对应请求后。会被 Vite 客户端做一层拦截，最终找到对应的模块代码进行返回。

```js
export const moduleRE = /^\/@modules\//
// plugin for resolving /@modules/:id requests.
app.use(async (ctx, next) => {
    if (!moduleRE.test(ctx.path)) {
      return next()
    }
    // path maybe contain encode chars
    const id = decodeURIComponent(ctx.path.replace(moduleRE, ''))
    ctx.type = 'js'
    const serve = async (id: string, file: string, type: string) => {
      moduleIdToFileMap.set(id, file)
      moduleFileToIdMap.set(file, ctx.path)
      debug(`(${type}) ${id} -> ${getDebugPath(root, file)}`)
      await ctx.read(file)
      return next()
    }   }
    // alias 
    const importerFilePath = importer ? resolver.requestToFile(importer) : root
    const nodeModulePath = resolveNodeModuleFile(importerFilePath, id)
    if (nodeModulePath) {
      return serve(id, nodeModulePath, 'node_modules')
    }
})
```

* .vue 文件的处理

当 Vite 遇到一个 .vue 后缀的文件时。由于 .vue 模板文件的特殊性，它被拆分成 template , css ,script 模块三个模块进行分别处理。最后会对 script ,template, css 发送多个请求获取。

![vite](/blog/images/vite/vitePrinciple11.awebp)

如上图 App.vue 获取script , App.vue?type=template 获取 template , App.vue?type=style。这些代码都被插入在app.vue 返回的代码中。

![vite](/blog/images/vite/vitePrinciple12.awebp)

```js
 if (descriptor.customBlocks) {
  descriptor.customBlocks.forEach((c, i) => {
    const attrsQuery = attrsToQuery(c.attrs, c.lang)
    const blockTypeQuery = `&blockType=${qs.escape(c.type)}`
    let customRequest =
      publicPath + `?type=custom&index=${i}${blockTypeQuery}${attrsQuery}`
    const customVar = `block${i}`
    code += `\nimport ${customVar} from ${JSON.stringify(customRequest)}\n`
    code += `if (typeof ${customVar} === 'function') ${customVar}(__script)\n`
  })
}
if (descriptor.template) {
  const templateRequest = publicPath + `?type=template`
  code += `\nimport { render as __render } from ${JSON.stringify(
    templateRequest
  )}`
  code += `\n__script.render = __render`
}
code += `\n__script.__hmrId = ${JSON.stringify(publicPath)}`
code += `\n__script.__file = ${JSON.stringify(filePath)}`
code += `\nexport default __script`
```

### 静态资源(statics & asset & JSON )的加载

当请求的路径符合 imagesRE, mediaRE , fontsRE 或 JSON 格式，会被认为是一个静态资源。静态资源将处理成 ES Module 模块返回

```js
// src/node/utils/pathUtils.ts
const imagesRE = /\.(png|jpe?g|gif|svg|ico|webp)(\?.*)?$/
const mediaRE = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
const fontsRE = /\.(woff2?|eot|ttf|otf)(\?.*)?$/i
export const isStaticAsset = (file: string) => {
  return imagesRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}

// src/node/server/serverPluginAssets.ts
app.use(async (ctx, next) => {
    if (isStaticAsset(ctx.path) && isImportRequest(ctx)) {
      ctx.type = 'js'
      ctx.body = `export default ${JSON.stringify(ctx.path)}`
      return
    }
    return next()
})

export const jsonPlugin: ServerPlugin = ({ app }) => {
  app.use(async (ctx, next) => {
    await next()
    // handle .json imports
    // note ctx.body could be null if upstream set status to 304
    if (ctx.path.endsWith('.json') && isImportRequest(ctx) && ctx.body) {
      ctx.type = 'js'
      ctx.body = dataToEsm(JSON.parse((await readBody(ctx.body))!), {
        namedExports: true,
        preferConst: true
      })
    }
  })
}
```

### 热更新(Hot Module Reload)原理

Vite 的热加载原理，其实就是在客户端与服务端建立了一个 websocket 链接，当代码被修改时，服务端发送消息通知客户端去请求修改模块的代码，完成热更新。

### 服务端原理

服务端做的就是监听代码文件的改变，在合适的时机向客户端发送 websocket 信息通知客户端去请求新的模块代码。

### 客户端原理

Vite的 websocket 相关代码在 处理 html 中时被写入代码中。

```js
export const clientPublicPath = `/vite/client`

const devInjectionCode = `\n<script type="module">import "${clientPublicPath}"</script>\n`

  async function rewriteHtml(importer: string, html: string) {
    return injectScriptToHtml(html, devInjectionCode)
  }
```

当request.path 路径是 /vite/client 时，请求得到对应的客户端代码，因此在客户端中我们创建了一个 websocket 服务并与服务端建立了连接。
Vite 会接受到来自客户端的消息。通过不同的消息触发一些事件。做到浏览器端的即时热模块更换（热更新）。

```js
// Listen for messages
socket.addEventListener('message', async ({ data }) => {
  const payload = JSON.parse(data) as HMRPayload | MultiUpdatePayload
  if (payload.type === 'multi') {
    payload.updates.forEach(handleMessage)
  } else {
    handleMessage(payload)
  }
})
async function handleMessage(payload: HMRPayload) {
  const { path, changeSrcPath, timestamp } = payload as UpdatePayload
  console.log(path)
  switch (payload.type) {
    case 'connected':
      console.log(`[vite] connected.`)
      break
    case 'vue-reload':
      queueUpdate(
        import(`${path}?t=${timestamp}`)
          .catch((err) => warnFailedFetch(err, path))
          .then((m) => () => {
            __VUE_HMR_RUNTIME__.reload(path, m.default)
            console.log(`[vite] ${path} reloaded.`)
          })
      )
      break
    case 'vue-rerender':
      const templatePath = `${path}?type=template`
      import(`${templatePath}&t=${timestamp}`).then((m) => {
        __VUE_HMR_RUNTIME__.rerender(path, m.render)
        console.log(`[vite] ${path} template updated.`)
      })
      break
    case 'style-update':
      // check if this is referenced in html via <link>
      const el = document.querySelector(`link[href*='${path}']`)
      if (el) {
        el.setAttribute(
          'href',
          `${path}${path.includes('?') ? '&' : '?'}t=${timestamp}`
        )
        break
      }
      // imported CSS
      const importQuery = path.includes('?') ? '&import' : '?import'
      await import(`${path}${importQuery}&t=${timestamp}`)
      console.log(`[vite] ${path} updated.`)
      break
    case 'style-remove':
      removeStyle(payload.id)
      break
    case 'js-update':
      queueUpdate(updateModule(path, changeSrcPath, timestamp))
      break
    case 'custom':
      const cbs = customUpdateMap.get(payload.id)
      if (cbs) {
        cbs.forEach((cb) => cb(payload.customData))
      }
      break
    case 'full-reload':
      if (path.endsWith('.html')) {
        // if html file is edited, only reload the page if the browser is
        // currently on that page.
        const pagePath = location.pathname
        if (
          pagePath === path ||
          (pagePath.endsWith('/') && pagePath + 'index.html' === path)
        ) {
          location.reload()
        }
        return
      } else {
        location.reload()
      }
  }
}
```

## Vite 做的一些优化

Vite 基于的 ES module，在使用某些模块时。由于模块依赖了另一些模块，依赖的模块又基于另一些模块。会出现页面初始化时一次发送数百个模块请求的情况。 这里以 lodash-es 为例，一共发送了651个请求。一共花费1.

![vite](/blog/images/vite/vitePrinciple13.awebp)

Vite 为了优化这个情况，给了一个 optimize 指令。我们可以直接使用 vite optimize 使用它

![vite](/blog/images/vite/vitePrinciple14.awebp)

Optimize 原理类似于 webpack 的 dll-plugin ,提前将 package.json 中的 dependencies 打包成一个一个 esmodule 模块。这样在页面初始化时能减少大量请求。

![vite](/blog/images/vite/vitePrinciple15.awebp)

有的人肯定会问：如果我的组件嵌套很深，一个组件import了十个组件，十个组件又import了十个组件怎么处理。这是粗略的提一下我的想法

* 1、首先可以看到请求 lodash 时651个请求只耗时1.53s。这个耗时是完全可以接受的。
* 2、Vite 是完全按需加载的，在页面初始化时只会请求初始化页面的一些组件。（使用一些如  dynamic import 的优化）
* 3、ES module 是有一些优化的，浏览器会给请求的模块做一次缓存。当请求路径完全相同时，浏览器会使用浏览器缓存的代码。[关于ES module 的更多信息](https://segmentfault.com/a/1190000014318751)
* 4、Vite 只是一个用于开发环境的工具，上线仍会打包成一个 commonJs 文件进行调用。

正基于上面这些原因，Vite 启动的项目在刚进入页面时会发送大量请求。但是它耗费的时候是完全可以接受的(会比 webpack 打包快)。而且由于缓存的原因，当修改代码时，只会请求修改部分的代码（发送请求会附上一个t=timestamp的参数）。

## React下的可行性

已经说了这么多，是不是很想在React中也尝试Vite呢？ 由于社区的贡献，Vite 已经支持 react 开发了。你可以使用 npm init vite-app --template react 尝试使用。
