# 跨站脚本攻击(xss)

cross site scripting

## 什么是XSS

简单来说，就是在页面中植入恶意代码。

攻击者在web页面恶意插入HTML或script标签，当用户浏览该页面时，恶意代码就会被执行，从而达到攻击的目的。XSS利用的是用户对指定网站的信任。

## 类型

### （1）反射型xss(非持久)
  
需要欺骗用户自己去点击带有特定参数的XSS代码链接才能触发，一般是欺骗用户点击特定链接来进行恶意攻击，攻击代码就在url当中;

例如，将正常的网页url

```js
http://www.dvwa.com/vulnerabilities/xss_r/?name=index
```

改成下面这般便，可以实现恶意弹窗了

```js
http://www.dvwa.com/vulnerabilities/xss_r/?name=<script>alert(document.cookie)</script>
```

便能实现获取当前用户的cookie，这种攻击结合csrf(跨站请求伪造)，例如通过 XMLHttpRequest与CORS功能将数据发送给攻击方服务器，之后便可以在千里之外模拟用户登录，进而进行恶意操作。

### （2）存储型xss

是指将恶意代码被当做正常数据插入到服务器上的数据库中，当用户正常访问页面的时候，恶意代码从数据库中提取出来并被触发。

这类方法和反射型最大的区别在于其攻击载荷的存储位置不同，反射型XSS的攻击载荷并不存储在服务器上，攻击时需要将链接发送给特定用户，存储型XSS的攻击载荷直接保存在了服务器上，因此很多时候是无差别攻击。

例如一个留言板被黑客利用进行XSS攻击，提交了形如<script>alert(“please follow serendipity！”)</script>的代码，那么所有访问这个留言板的用户都将可能执行这段恶意脚本。

利用存储型XSS可实现劫持访问，盗取访问者cookie或者配合csrf攻击完成恶意请求等攻击。

### （3）DOM based xss

DOM based XSS通过恶意脚本修改页面的DOM节点来发起攻击，是发生在前端的攻击。DOM型XSS的特殊之处在于，用户的输入经过了DOM操作，特别是在innerHTML、ajax中经常出现。

最经典的存储型XSS漏洞是留言板，当用户A在留言板留言一段JS代码`<script>alert("run javascript");</script>`,后端未经过滤直接存储到数据库，当正常用户浏览到他的留言后，这段JS代码就会被执行，可以借此来盗取cookie。

一般的攻击流程大致如下：

* 攻击者构造出特殊的URL，其中包含恶意代码，例如 `<script>alert(document.cookie)</script>`;
* 用户打开带有恶意代码的URL;
* 用户浏览器接受到响应后执行解析，前端JavaScript取出URL中的恶意代码并执行;
* 恶意代码窃取用户数据并发送到攻击者的网站，冒充用户行为，调用目标网站接口执行攻击者指定的操作。

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
