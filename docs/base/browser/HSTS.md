# HSTS

HSTS 是 HTTP 严格传输安全（HTTP Strict Transport Security） 的缩写。

这是一种网站用来声明他们只能使用安全连接（HTTPS）访问的方法。 如果一个网站声明了 HSTS 策略，浏览器必须拒绝所有的 HTTP 连接并阻止用户接受不安全的 SSL 证书。

创建这个标准的主要目的，是为了避免用户遭受使用 SSL stripping（剥离） 的 中间人攻击（man-in-The-middle，MITM）。

SSL stripping 是一种攻击者强迫浏览器使用 HTTP 协议连接到站点的技术，这样他们就可以嗅探数据包，拦截或修改敏感信息。

另外，HSTS 也是一个很好的保护自己免受 cookie 劫持（cookie hijacking）的方法。

## 工作原理

通常，当您在 Web 浏览器中输入 URL 时，您会跳过协议部分。 例如，你输入的是 http://www.baidu.com。 在这种情况下，浏览器 Web Server 会返回 **301 状态码**将请求重定向到 HTTPS 站点。 接下来浏览器使用 HTTPS 连接到 www.baidu.com。 这时 HSTS 安全策略保护开始使用 HTTP 响应头：

```http
Strict-Transport-Security: max-age=172800;
```

![hsts](/blog/images/base/hsts1.png)

响应头的 Strict-Transport-Security 给浏览器提供了详细的说明。 从现在开始，每个连接到该网站及其子域的下48小时（17200秒）从这个头被接收的时刻起必须是一个 HTTPS 连接。 **HTTP 连接是完全不允许的**。 如果浏览器接收到使用 HTTP 加载资源的请求，则 返回 **307状态码**重定向，使用 HTTPS 请求替代。 如果 HTTPS 不可用，则必须直接终止连接。

此外，**如果证书无效，将阻止你建立连接**。 通常来说，如果 HTTPS 证书无效（如：过期、自签名、由未知 CA 签名等），浏览器会显示一个可以规避的警告。 但是，如果站点有 HSTS，浏览器就不会让你绕过警告。 若要访问该站点，必须从浏览器内的 HSTS 列表中删除该站点。

## HSTS 是否完全安全？

不幸的是，你第一次访问这个网站，你不受 HSTS 的保护。 如果网站向 HTTP 连接添加 HSTS 头，则该报头将被忽略。 这是因为攻击者可以在中间人攻击（man-in-the-middle attack）中删除或添加头部。 HSTS 报头不可信，除非它是通过 HTTPS 传递的。

每次您的浏览器读取 header 时，HSTS max-age 都会**刷新**，最大值为两年。 这意味着保护是永久性的，只要两次访问之间不超过两年。 如果你两年没有访问一个网站，它会被视为一个新网站。 与此同时，如果你提供 max-age 0 的 HSTS header，浏览器将在下一次连接尝试时将该站点视为一个新站点（这对测试非常有用）。

你可以使用称为 HSTS 预加载列表（HSTS preload list）的附加保护方法。 Chromium 项目维护一个使用 HSTS 的网站列表，该列表通过浏览器发布。 如果你把你的网站添加到预加载列表中，浏览器会首先检查内部列表，这样你的网站就永远不会通过 HTTP 访问，甚至在第一次连接尝试时也不会。 这个方法不是 HSTS 标准的一部分，但是它被所有主流浏览器(Chrome、 Firefox、 Safari、 Opera、 IE11 和 Edge)使用

目前唯一可用于绕过 HSTS 的已知方法是基于 NTP 的攻击。 如果客户端计算机容易受到 NTP 攻击（ NTP-based attack），它可能会被欺骗，使 HSTS 策略到期，并使用 HTTP 访问站点一次。

[参考](https://zhuanlan.zhihu.com/p/130946490)
