# HTTP/1 、HTTP/2 及 HTTP/3

## http1.0与http1.1之间的区别

* 1、缓存策略

**http1.0 强缓存；http1.1加入协商缓存**。

http1.0的缓存策略主要是依赖header中的If-Modified-Since,Expire(到期)

http1.1的缓存策略要比http1.0略多,例如 Entity tag(实体标签), If-Unmodified-Since, If-Match, If-None-Match等.

* 2、宽带和网络连接优化

加入**断点续传**。

http1.0中会存在一些性能浪费,比如我们的只需要对象中的一部分,但是每次请求返回的却是整个对象,这无疑造成了性能的损害

http1.1则不然,它可以通过在请求头处设置range头域,就可以返回请求资源的某一部分,也就是返回码为206(Partial Content)的时候,这对于性能优化很有必要.

::: tip
这里所谓的请求资源的一部分,也就是大家常说的断点续传
:::

关于断点续传的应用场景,例如用户需要下载一个大文件,最佳的方式是将这个大文件分割成几部分,然后由多个进程同时进行.

这个时候,我们可以在请求头中设置range字段,来规定分割的byte数范围.

而服务端会给客户端返回一个包含着content-range的响应头,来对应相应的分割byte数范围

请求头中:

Range: bytes=0-801 // 一般请求下载整个文件是bytes=0- 或不用这个头
响应头中:

Content-Range: bytes 0-800/801 //801:文件总大小

* 3、新增部分错误通知

http1.1版本新增了24个错误状态响应码,比如

409(Conflict)表示: 请求的资源与当前的状态发生冲突
410(Gone)表示服务器上某个资源被永久性的删除了

* 4、Host头处理:

http1.0中默认每台服务器都绑定唯一的一个IP地址,所以请求消息中url并没有传递主机名,也就是hostname.

http1.1中请求消息和响应消息都支持Host头域,而且,如果我们不传这个字段还会报一个400(bad request)的状态码

这里也介绍下头域的内容:

通用头域:

**Cache-Control**: 缓存头域 => 常见值为no-cache(不允许缓存), no-store(无论请求还是响应均不允许缓存), max-age(规定可以客户端可以接受多长生命期的数据)

**Keep-Alive**: 使得服务端和客户端的链接长时间有效

**Date**: 信息发送的时间

**Host**: 请求资源的主机IP和端口号

**Range**: 请求资源的某一部分

**User-Agent**: 发出请求的用户的信息(鉴权)

* 5、长连接:

http1.1支持长连接和请求的流水线(pipelining),在一个TCP链接上可以传送多个http请求和响应.这样就不用多次建立和关闭TCP连接了。

## http2.0和http1.x的区别

* 1、http1的解析是基于文本协议的各式解析,而http2.0的协议解析是二进制格式,更加的强大
* 2、多路复用(Mutiplexing) : 一个连接上可以有多个request,且可以随机的混在一起,每个不同的request都有对应的id,服务端可以通过request_id来辨别,大大加快了传输速率
* 3、header压缩: http1.x中的header需要携带大量信息，而且每次都要重复发送。http2.0使用encode来减少传输的header大小，而且客户端和服务端可以各自缓存(cache)一份header filed表，避免了header的重复传输，还可以减少传输的大小。
* 4、服务端推送(server push): 可以通过解析html中的依赖，只能的返回所需的其他文件(css或者js等)，而不用再发起一次请求。

## http与https的区别

* 1、https协议需要CA申请证书(换句换说,是要钱的)
* 2、http协议运行在TCP协议之上,传输的内容都是明文传送,安全性较差,而https则是运行在SSL/TLS层之上, 而SSL/TLS层是运行在TCP层之上,https传输的内容都是经过加密的,安全性较高
* 3、http与https使用不同的连接方式.其中http默认用的是80端口,而https默认用的是443端口。

::: tip
SSL/TLS ==> secure socket layer / transport layer security
:::

[](https://juejin.cn/book/6844733763675488269/section/6844733763792961550)

[](https://zhuanlan.zhihu.com/p/85093818)
