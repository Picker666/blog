# Service Worker

Service Worker本质上也是浏览器缓存资源用的，只不过他不仅仅是cache，也是通过worker的方式来进一步优化。
他基于h5的web worker，所以绝对不会阻碍当前js线程的执行，sw最重要的工作原理就是

* 后台线程：独立于当前网页线程；
* 网络代理：在网页发起请求时代理，来缓存文件

目前淘宝、网易新闻、考拉都使用了sw，该技术值得尝试。

## sw生命周期

![sw生命周期](/blog/images/base/serviceWorker1.png)

## 注册

要使用Service worker，首先需要注册一个sw，通知浏览器为该页面分配一块内存，然后sw就会进入安装阶段。
一个简单的注册方式

```js
(function() {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
})()
```

前面提到过，由于sw会监听和代理所有的请求，所以sw的作用域就显得额外的重要了，比如说我们只想监听我们专题页的所有请求，就在注册时指定路径：

```js
前面提到过，由于sw会监听和代理所有的请求，所以sw的作用域就显得额外的重要了，比如说我们只想监听我们专题页的所有请求，就在注册时指定路径：
```

这样就只会对topics/下面的路径进行优化。

## Installing

我们注册后，浏览器就会开始安装sw，可以通过事件监听

```js
//service worker安装成功后开始缓存所需的资源
var CACHE_PREFIX = 'cms-sw-cache';
var CACHE_VERSION = '0.0.20';
var CACHE_NAME = CACHE_PREFIX+'-'+CACHE_VERSION;
var allAssets = [
    './main.css'
];
self.addEventListener('install', function(event) {

    //调试时跳过等待过程
    self.skipWaiting();


    // Perform install steps
    //首先 event.waitUntil 你可以理解为 new Promise，
    //它接受的实际参数只能是一个 promise，因为,caches 和 cache.addAll 返回的都是 Promise，
    //这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
    //另外，event.waitUntil 还有另外一个重要好处，它可以用来延长一个事件作用的时间，
    //这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，
    //并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，
    //就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise
    //如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('[SW]: Opened cache');
                return cache.addAll(allAssets);
            })
    );

});
```

安装时，sw就开始缓存文件了，会检查所有文件的缓存状态，如果都已经缓存了，则安装成功，进入下一阶段。

## activated

如果是第一次加载sw，在安装后，会直接进入activated阶段，而如果sw进行更新，情况就会显得复杂一些。流程如下：

首先老的sw为A，新的sw版本为B。
B进入install阶段，而A还处于工作状态，所以B进入waiting阶段。只有等到A被terminated后，B才能正常替换A的工作。

![sw生命周期](/blog/images/base/serviceWorker2.png)

这个terminated的时机有如下几种方式：

* 1、关闭浏览器一段时间；
* 2、手动清除service worker；
* 3、在sw安装时直接跳过waiting阶段

```js
//service worker安装成功后开始缓存所需的资源
self.addEventListener('install', function(event) {
    //跳过等待过程
    self.skipWaiting();
});
```

然后就进入了activated阶段，激活sw工作。

activated阶段可以做很多有意义的事情，比如更新存储在cache中的key和value：

```js
var CACHE_PREFIX = 'cms-sw-cache';
var CACHE_VERSION = '0.0.20';
/**
 * 找出对应的其他key并进行删除操作
 * @returns {*}
 */
function deleteOldCaches() {
    return caches.keys().then(function (keys) {
        var all = keys.map(function (key) {
            if (key.indexOf(CACHE_PREFIX) !== -1 && key.indexOf(CACHE_VERSION) === -1){
                console.log('[SW]: Delete cache:' + key);
                return caches.delete(key);
            }
        });
        return Promise.all(all);
    });
}
//sw激活阶段,说明上一sw已失效
self.addEventListener('activate', function(event) {


    event.waitUntil(
        // 遍历 caches 里所有缓存的 keys 值
        caches.keys().then(deleteOldCaches)
    );
});
```

## idle

这个空闲状态一般是不可见的，这种一般说明sw的事情都处理完毕了，然后处于闲置状态了。
浏览器会周期性的轮询，去释放处于idle的sw占用的资源。

## fetch

该阶段是sw最为关键的一个阶段，用于拦截代理所有指定的请求，并进行对应的操作。
所有的缓存部分，都是在该阶段，这里举一个简单的例子：

```js
//监听浏览器的所有fetch请求，对已经缓存的资源使用本地缓存回复
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                //该fetch请求已经缓存
                if (response) {
                    return response;
                }
                return fetch(event.request);
                }
            )
    );
});
```

生命周期大概讲清楚了，我们就以一个具体的例子来说明下原生的service worker是如何在生产环境中使用的吧。

## 栗子

我们可以以网易新闻的wap页为例,其针对不怎么变化的静态资源开启了sw缓存，具体的sw.js逻辑和解读如下：

```js
'use strict';
//需要缓存的资源列表
var precacheConfig = [
    ["https://static.ws.126.net/163/wap/f2e/milk_index/bg_img_sm_minfy.png",
        "c4f55f5a9784ed2093009dadf1e954f9"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/change.png",
        "9af1b102ef784b8ff08567ba25f31d95"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/icon-download.png",
        "1c02c724381d77a1a19ca18925e9b30c"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/icon-login-dark.png",
        "b59ba5abe97ff29855dfa4bd3a7a9f35"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/icon-refresh.png",
        "a5b1084e41939885969a13f8dbc88abd"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/icon-video-play.png",
        "065ff496d7d36345196d254aff027240"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/icon.ico",
        "a14e5365cc2b27ec57e1ab7866c6a228"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/iconfont_1.eot",
        "e4d2788fef09eb0630d66cc7e6b1ab79"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/iconfont_1.svg",
        "d9e57c341608fddd7c140570167bdabb"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/iconfont_1.ttf",
        "f422407038a3180bb3ce941a4a52bfa2"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/iconfont_1.woff",
        "ead2bef59378b00425779c4ca558d9bd"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/index.5cdf03e8.js",
        "6262ac947d12a7b0baf32be79e273083"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/index.bc729f8a.css",
        "58e54a2c735f72a24715af7dab757739"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-app-bohe.png",
        "ac5116d8f5fcb3e7c49e962c54ff9766"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-app-mail.png",
        "a12bbfaeee7fbf025d5ee85634fca1eb"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-app-manhua.png",
        "b8905b119cf19a43caa2d8a0120bdd06"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-app-open.png",
        "b7cc76ba7874b2132f407049d3e4e6e6"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-app-read.png",
        "e6e9c8bc72f857960822df13141cbbfd"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/logo-site.png",
        "2b0d728b46518870a7e2fe424e9c0085"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/version_no_pic.png",
        "aef80885188e9d763282735e53b25c0e"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/version_pc.png",
        "42f3cc914eab7be4258fac3a4889d41d"],
    ["https://static.ws.126.net/163/wap/f2e/milk_index/version_standard.png",
        "573408fa002e58c347041e9f41a5cd0d"]
];
var cacheName = 'sw-precache-v3-new-wap-index-' + (self.registration ? self.registration.scope : '');

var ignoreUrlParametersMatching = [/^utm_/];

var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};
var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }
    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();
    return bodyPromise.then(function(body) {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};
var createCacheKey = function(originalUrl, paramName, paramValue,
                              dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);
    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }
    return url.toString();
};
var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
        return true;
    }
    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};
var stripIgnoredUrlParameters = function(originalUrl,
                                         ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';
    url.search = url.search.slice(1) // Exclude initial '?'
        .split('&') // Split into an array of 'key=value' strings
        .map(function(kv) {
            return kv.split('='); // Split each 'key=value' string into a [key, value] array
        })
        .filter(function(kv) {
            return ignoreUrlParametersMatching.every(function(ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
            });
        })
        .map(function(kv) {
            return kv.join('='); // Join each [key, value] array into a 'key=value' string
        })
        .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each
    return url.toString();
};

var hashParamName = '_sw-precache';
//定义需要缓存的url列表
var urlsToCacheKeys = new Map(
    precacheConfig.map(function(item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);
//把cache中的url提取出来,进行去重操作
function setOfCachedUrls(cache) {
    return cache.keys().then(function(requests) {
        //提取url
        return requests.map(function(request) {
            return request.url;
        });
    }).then(function(urls) {
        //去重
        return new Set(urls);
    });
}
//sw安装阶段
self.addEventListener('install', function(event) {
    event.waitUntil(
        //首先尝试取出存在客户端cache中的数据
        caches.open(cacheName).then(function(cache) {
            return setOfCachedUrls(cache).then(function(cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
                        //如果需要缓存的url不在当前cache中,则添加到cache
                        if (!cachedUrls.has(cacheKey)) {
                            //设置same-origin是为了兼容旧版本safari中其默认值不为same-origin,
                            //只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息
                            var request = new Request(cacheKey, {credentials: 'same-origin'});
                            return fetch(request).then(function(response) {
                                //通过fetch api请求资源
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }
                                return cleanResponse(response).then(function(responseToCache) {
                                    //并设置到当前cache中
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        }).then(function() {

            //强制跳过等待阶段,进入激活阶段
            return self.skipWaiting();

        })
    );
});
self.addEventListener('activate', function(event) {
    //清除cache中原来老的一批相同key的数据
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.keys().then(function(existingRequests) {
                return Promise.all(
                    existingRequests.map(function(existingRequest) {
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            //cache中删除指定对象
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function() {
            //self相当于webworker线程的当前作用域
            //当一个 service worker 被初始注册时，页面在下次加载之前不会使用它。 claim() 方法会立即控制这些页面
            //从而更新客户端上的serviceworker
            return self.clients.claim();

        })
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
        // 标识位,用来判断是否需要缓存
        var shouldRespond;
        // 对url进行一些处理,移除一些不必要的参数
        var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
        // 如果该url不是我们想要缓存的url,置为false
        shouldRespond = urlsToCacheKeys.has(url);
        // 如果shouldRespond未false,再次验证
        var directoryIndex = 'index.html';
        if (!shouldRespond && directoryIndex) {
            url = addDirectoryIndex(url, directoryIndex);
            shouldRespond = urlsToCacheKeys.has(url);
        }
        // 再次验证,判断其是否是一个navigation类型的请求
        var navigateFallback = '';
        if (!shouldRespond &&
            navigateFallback &&
            (event.request.mode === 'navigate') &&
            isPathWhitelisted([], event.request.url)) {
            url = new URL(navigateFallback, self.location).toString();
            shouldRespond = urlsToCacheKeys.has(url);
        }
        // 如果标识位为true
        if (shouldRespond) {
            event.respondWith(
                caches.open(cacheName).then(function(cache) {
                    //去缓存cache中找对应的url的值
                    return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
                        //如果找到了,就返回value
                        if (response) {
                            return response;
                        }
                        throw Error('The cached response that was expected is missing.');
                    });
                }).catch(function(e) {
                    // 如果没找到则请求该资源
                    console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                    return fetch(event.request);
                })
            );
        }
    }
});
```

这里的策略大概就是优先在cache中寻找资源，如果找不到再请求资源。可以看出，为了实现一个较为简单的缓存，还是比较复杂和繁琐的，所以很多工具就应运而生了。

工具： [Workbox](/base/browser/worker.html)
