# >跨站脚本攻击(xss cross site scripting)

## 什么是XSS

简单来说，就是在页面中植入恶意代码。

攻击者在web页面恶意插入HTML或script标签，当用户浏览该页面时，恶意代码就会被执行，从而达到攻击的目的。XSS利用的是用户对指定网站的信任。

## 类型

* （1）反射型xss(非持久)。攻击者事先制作好攻击链接,需要欺骗用户自己去点击链接才能触发XSS代码，所谓反射型XSS就是将恶意用户输入的js脚本，反射到浏览器执行。
* （2）存储型xss。会把攻击者的数据储存到服务端，攻击行为将伴随攻击数据一直存在，每当用户访问该页面就会触发代码执行。
* （3）DOM型：基于文档对象模型的漏洞。

最经典的存储型XSS漏洞是留言板，当用户A在留言板留言一段JS代码`<script>alert("run javascript");</script>`,后端未经过滤直接存储到数据库，当正常用户浏览到他的留言后，这段JS代码就会被执行，可以借此来盗取cookie。

## 危害

* 盗取网页浏览中的cookie值，盗用cookie实现无密码登录，盗取用户信息。
* 劫持访问，实现恶意跳转。
* 配合CSRF攻击完成恶意请求。

## 防御方法

* 标签过滤，如`<script>`、`<img>`、`<a>`标签等;
* 编码，对字符< 、>、&、" 、' 、+、/等进行转义;
* cookie防盗，将cookie设置为http-only,js脚本将无法读取到cookie信息;
* 纯前端渲染，明确innerText、setAttribute、style，将代码与数据分隔开;
* 避免不可信的数据拼接到字符串中传递给这些API，如DOM中的内联事件监听器，`location`、`onclick`、`onload`、`onmouseover`等，`<a`>标签的`href`属性，`JavaScript`的`eval()`、`setTimeout()`、`setInterval()`等，都能把字符串作为代码运行。
