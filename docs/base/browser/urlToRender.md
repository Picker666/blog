# 从URL输入到页面展现

[](https://github.com/ljianshu/Blog/issues/24)

先给大家来张总体流程图

[过程](/blog/images/base/urlToRender1.png)

总体来说分为以下几个过程:

* 1、DNS 解析：将域名解析成 IP 地址；
* 2、TCP 连接：TCP 三次握手；
* 3、发送 HTTP 请求；
* 4、服务器处理请求并返回 HTTP 报文；
* 5、浏览器解析渲染页面；
* 6、断开连接：TCP 四次挥手。
