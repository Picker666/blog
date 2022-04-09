# Workbox

由于直接写原生的sw.js，比较繁琐和复杂，所以一些工具就出现了，而workbox是其中的佼佼者，由google团队推出。

使用者

有很多团队也是启用该工具来实现service worker的缓存，比如说：

* 淘宝首页
* 网易新闻wap文章页
* 百度的Lavas

## 基本配置

首先，需要在项目的sw.js文件中，引入workbox的官方js，这里用了我们自己的静态资源：

```js
importScripts(
    "https://edu-cms.nosdn.127.net/topics/js/workbox_9cc4c3d662a4266fe6691d0d5d83f4dc.js"
);
```

其中importScripts是webworker中加载js的方式。

引入workbox后，全局会挂载一个workbox对象

```js
if (workbox) {
    console.log('workbox加载成功');
} else {
    console.log('workbox加载失败');
}
```

然后需要在使用其他的api前，提前使用配置

```js
//关闭控制台中的输出
workbox.setConfig({ debug: false });
```

也可以统一指定存储时cache的名称：

```js
//设置缓存cachestorage的名称
workbox.core.setCacheNameDetails({
    prefix:'edu-cms',
    suffix:'v1'
});
```

## precache

workbox的缓存分为两种，一种的precache，一种的runtimecache。

precache对应的是在installing阶段进行读取缓存的操作。它让开发人员可以确定缓存文件的时间和长度，以及在不进入网络的情况下将其提供给浏览器，这意味着它可以用于创建Web离线工作的应用。

## 工作原理

首次加载Web应用程序时，workbox会下载指定的资源，并存储具体内容和相关修订的信息在indexedDB中。

当资源内容和sw.js更新后，workbox会去比对资源，然后将新的资源存入cache，并修改indexedDB中的版本信息。
我们举一个例子：

```js
workbox.precaching.precacheAndRoute([
    './main.css'
]);
```

![缓存示意图](/blog/images/base/workbox1.png)

indexedDB中会保存其相关信息

![缓存示意图](/blog/images/base/workbox2.png)

这个时候我们把main.css的内容改变后，再刷新页面，会发现除非强制刷新，否则workbox还是会读取cache中存在的老的main.css内容。

即使我们把main.css从服务器上删除，也不会对页面造成影响。

所以这种方式的缓存都需要配置一个版本号。在修改sw.js时，对应的版本也需要变更。

## 使用实践

当然了，一般我们的一些不经常变的资源，都会使用cdn，所以这里自然就需要支持域外资源了，配置方式如下：

```js
var fileList = [
    {
        url:'https://edu-cms.nosdn.127.net/topics/js/cms_specialWebCommon_js_f26c710bd7cd055a64b67456192ed32a.js'
    },
    {
        url:'https://static.ws.126.net/163/frontend/share/css/article.207ac19ad70fd0e54d4a.css'
    }
];
//precache 适用于支持跨域的cdn和域内静态资源
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(fileList, {
    "ignoreUrlParametersMatching": [/./]
});
```

这里需要对应的资源配置跨域允许头，否则是不能正常加载的。且文件都要以版本文件名的方式，来确保修改后cache和indexDB会得到更新。

理解了原理和实践后，说明这种方式适合于上线后就不会经常变动的静态资源。

## runtimecache

运行时缓存是在install之后，activated和fetch阶段做的事情。

既然在fetch阶段发送，那么runtimecache 往往应对着各种类型的资源，对于不同类型的资源往往也有不同的缓存策略。

## 缓存策略

workbox提供的缓存策划有以下几种，通过不同的配置可以针对自己的业务达到不同的效果：

## staleWhileRevalidate

这种策略的意思是当请求的路由有对应的 Cache 缓存结果就直接返回，

在返回 Cache 缓存结果的同时会在后台发起网络请求拿到请求结果并更新 Cache 缓存，如果本来就没有 Cache 缓存的话，直接就发起网络请求并返回结果，这对用户来说是一种非常安全的策略，能保证用户最快速的拿到请求的结果。

但是也有一定的缺点，就是还是会有网络请求占用了用户的网络带宽。可以像如下的方式使用 State While Revalidate 策略

```js
workbox.routing.registerRoute(
    new RegExp('https://edu-cms\.nosdn\.127\.net/topics/'),
    workbox.strategies.staleWhileRevalidate({
        //cache名称
        cacheName: 'lf-sw:static',
        plugins: [
            new workbox.expiration.Plugin({
                //cache最大数量
                maxEntries: 30
            })
        ]
    })
);
```

## networkFirst

这种策略就是当请求路由是被匹配的，就采用网络优先的策略，也就是优先尝试拿到网络请求的返回结果，如果拿到网络请求的结果，就将结果返回给客户端并且写入 Cache 缓存。

如果网络请求失败，那最后被缓存的 Cache 缓存结果就会被返回到客户端，这种策略一般适用于返回结果不太固定或对实时性有要求的请求，为网络请求失败进行兜底。可以像如下方式使用 Network First 策略：

```js
//自定义要缓存的html列表
var cacheList = [
    '/Hexo/public/demo/PWADemo/workbox/index.html'
];
workbox.routing.registerRoute(
    //自定义过滤方法
    function(event) {
        // 需要缓存的HTML路径列表
        if (event.url.host === 'localhost:63342') {
            if (~cacheList.indexOf(event.url.pathname)) return true;
            else return false;
        } else {
            return false;
        }
    },
    workbox.strategies.networkFirst({
        cacheName: 'lf-sw:html',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 10
            })
        ]
    })
);
```

## cacheFirst

这个策略的意思就是当匹配到请求之后直接从 Cache 缓存中取得结果，如果 Cache 缓存中没有结果，那就会发起网络请求，拿到网络请求结果并将结果更新至 Cache 缓存，并将结果返回给客户端。这种策略比较适合结果不怎么变动且对实时性要求不高的请求。可以像如下方式使用 Cache First 策略：

```js
workbox.routing.registerRoute(
    new RegExp('https://edu-image\.nosdn\.127\.net/'),
    workbox.strategies.cacheFirst({
        cacheName: 'lf-sw:img',
        plugins: [
            //如果要拿到域外的资源，必须配置
            //因为跨域使用fetch配置了
            //mode: 'no-cors',所以status返回值为0，故而需要兼容
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 40,
                //缓存的时间
                maxAgeSeconds: 12 * 60 * 60
            })
        ]
    })
);
```

## networkOnly

比较直接的策略，直接强制使用正常的网络请求，并将结果返回给客户端，这种策略比较适合对实时性要求非常高的请求。

## cacheOnly

这个策略也比较直接，直接使用 Cache 缓存的结果，并将结果返回给客户端，这种策略比较适合一上线就不会变的静态资源请求。

## 栗子

又到了举个栗子的阶段了，这次我们用淘宝好了，看看他们是如何通过workbox来配置service worker的：

```js
//首先是异常处理
self.addEventListener('error', function(e) {
  self.clients.matchAll()
    .then(function (clients) {
      if (clients && clients.length) {
        clients[0].postMessage({ 
          type: 'ERROR',
          msg: e.message || null,
          stack: e.error ? e.error.stack : null
        });
      }
    });
});

self.addEventListener('unhandledrejection', function(e) {
  self.clients.matchAll()
    .then(function (clients) {
      if (clients && clients.length) {
        clients[0].postMessage({
          type: 'REJECTION',
          msg: e.reason ? e.reason.message : null,
          stack: e.reason ? e.reason.stack : null
        });
      }
    });
})
//然后引入workbox
importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
workbox.setConfig({
  debug: false,
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
});
//直接激活跳过等待阶段
workbox.skipWaiting();
workbox.clientsClaim();
//定义要缓存的html
var cacheList = [
  '/',
  '/tbhome/home-2017',
  '/tbhome/page/market-list'
];
//html采用networkFirst策略，支持离线也能大体访问
workbox.routing.registerRoute(
  function(event) {
    // 需要缓存的HTML路径列表
    if (event.url.host === 'www.taobao.com') {
      if (~cacheList.indexOf(event.url.pathname)) return true;
      else return false;
    } else {
      return false;
    }
  },
  workbox.strategies.networkFirst({
    cacheName: 'tbh:html',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      })
    ]
  })
);
//静态资源采用staleWhileRevalidate策略，安全可靠
workbox.routing.registerRoute(
  new RegExp('https://g\.alicdn\.com/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'tbh:static',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      })
    ]
  })
);
//图片采用cacheFirst策略，提升速度
workbox.routing.registerRoute(
  new RegExp('https://img\.alicdn\.com/'),
  workbox.strategies.cacheFirst({
    cacheName: 'tbh:img',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('https://gtms01\.alicdn\.com/'),
  workbox.strategies.cacheFirst({
    cacheName: 'tbh:img',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);
```

可以看出，使用workbox比起直接手撸来，要快很多，也明确很多。

## 原理

目前分析service worker和workbox的文章不少，但是介绍workbox原理的文章却不多。

这里简单介绍下workbox这个工具库的原理。

首先将几个我们产品用到的模块图奉上：

![缓存示意图](/blog/images/base/workbox3.png)

## 通过Proxy按需依赖

熟悉了workbox后会得知，它是有很多个子模块的，各个子模块再通过用到的时候按需importScript到线程中。

![缓存示意图](/blog/images/base/workbox4.png)

做到按需依赖的原理就是通过Proxy对全局对象workbox进行代理：

```js
new Proxy(this, {
  get(t, s) {
    //如果workbox对象上不存在指定对象，就依赖注入该对象对应的脚本
    if (t[s]) return t[s];
    const o = e[s];
    return o && t.loadModule(`workbox-${o}`), t[s];
  }
})
```

如果找不到对应模块，则通过importScripts主动加载：

```js
/**
 * 加载前端模块
 * @param {Strnig} t 
 */
loadModule(t) {
  const e = this.o(t);
  try {
    importScripts(e), (this.s = !0);
  } catch (s) {
    throw (console.error(`Unable to import module '${t}' from '${e}'.`), s);
  }
}
```

## 通过freeze冻结对外暴露api

workbox.core模块中提供了几个核心操作模块，如封装了indexedDB操作的DBWrapper、对cacheStorage进行读取的cacheWrapper，以及发送请求的fetchWrapper和日志管理的logger等等。
为了防止外部对内部模块暴露出去的api进行修改，导致出现不可预估的错误，内部模块可以通过Object.freeze将api进行冻结保护：

```js
  var _private = /*#__PURE__*/Object.freeze({
    DBWrapper: DBWrapper,
    WorkboxError: WorkboxError,
    assert: finalAssertExports,
    cacheNames: cacheNames,
    cacheWrapper: cacheWrapper,
    fetchWrapper: fetchWrapper,
    getFriendlyURL: getFriendlyURL,
    logger: defaultExport
  });
```

## 总结

通过对service worker的理解和workbox的应用，可以进一步提升产品的性能和弱网情况下的体验。有兴趣的同学也可以对workbox的源码细细评读，其中还有很多不错的设计模式和编程风格值得学习。
https://blog.csdn.net/mevicky/article/details/86605882
