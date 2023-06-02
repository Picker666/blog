# HTTP中Origin和 Referer 的区别

## http 链接来源

HTTP 协议，用 Header 中的 Origin 和 Referer 来表示**请求链接的来源**，他们在使用上有些区别。

## Origin

Origin指示了请求来自于哪个站点，只有服务器名，不包含路径信息，浏览器自动添加到http请求 Header 中，**无需手动设置**。

### 添加 Origin 的情况

* 同源请求：POST、OPTIONS、PUT、PATCH 和 DELETE请求都会添加Origin请求头，GET或HEAD请求不会添加Origin请求头
* 跨域请求：所有跨域请求(CORS)都会添加Origin请求头。

### 用法

```js

Origin: ""
Origin: <scheme> "://" <host> [ ":" <port> ]

// -----
<scheme>
// 请求所使用协议，通常是HTTP或者HTTPS。

<host>
// 服务器的 域名 或 IP。

<port>
// 可选，端口号，HTTP请求，默认端口为 80

Origin: https://developer.mozilla.org

```

## Referer

Referer指示了请求来自于哪个具体页面，包含服务器名和路径的详细URL，浏览器自动添加到http请求 Header 中，**无需手动设置**。

### 不会添加 Referer 的情况

* 来源页面采用 file或 data URI协议；
* 来源页面采用 HTTPS 协议，而请求页面采用 HTTP 协议；

### 用法

```js
Referer: <url>

// url ：表示请求来源页面的绝对路径或者相对路径，但不包含 URL fragments (例如 "#section")和 userinfo (例如 "https://username:password@example.com/foo/bar/" 中的 "username:password" )

Referer: https://developer.mozilla.org/en-US/docs/Web/JavaScript

```

服务端一般使用 Referer请求头识别访问来源，进行统计分析、日志记录、缓存优化、异常访问等。

[参考](https://learn-anything.cn/http-origin-refer)
