# 简单请求和非简单请求

## 简单请求

只要同时满足以下两大条件，就属于简单请求。

* 请求方法是以下三种方法之一：
  * HEAD
  * GET
  * POST
* HTTP的头信息不超出以下几种字段：
  * Accept
  * Accept-Language
  * Content-Language
  * Last-Event-ID
  * Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

如果Origin指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含Access-Control-Allow-Origin字段（详见下文），就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。

如果Origin指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```js
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

## 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者`Content-Type`字段的类型是`application/json`;

**非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）**。

浏览器先询问服务器，

* 当前网页所在的域名是否在服务器的许可名单之中，以及
* 可以使用哪些HTTP动词和头信息字段

---

只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

下面是一段浏览器的JavaScript脚本。

```js
var url = ‘http://api.alice.com/cors’;
var xhr = new XMLHttpRequest();
xhr.open(‘PUT’, url, true);
xhr.setRequestHeader(‘X-Custom-Header’, ‘value’);
xhr.send();
```

上面代码中，HTTP请求的方法是PUT，并且发送一个自定义头信息X-Custom-Header。

浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。下面是这个"预检"请求的HTTP头信息。

```js
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0…
```

"预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。

除了Origin字段，"预检"请求的头信息包括两个特殊字段。


[参考](https://blog.csdn.net/yexudengzhidao/article/details/100104134)