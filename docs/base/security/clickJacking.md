# 点击挟持

## ClickJacking点击劫持

当访问某网站时，利用CSS将攻击者实际想让你点击的页面进行透明化隐藏，然后在页面后显示 一些东西诱导让你点击，点击后则会在用户毫不知情的情况下做了某些操作，这就是点击劫持ClickJacking。
案例：当我们点击弹窗右上角的"X"想关闭弹窗事，跳转到其他页面。

## iframe覆盖

第三方网站通过iframe内嵌某一个网站，并且将iframe设置为透明不可见，将其覆盖在其他经过伪装的DOM上，伪装的可点击DOM（按钮等）与实际内嵌网站的可点击DOM位置相同，当用户点击伪装的DOM时，实际上点击的是iframe中内嵌的网页的DOM从而触发请求操作。

## 防御

* Javascript禁止内嵌：当网页没有被使用iframe内嵌时，top和window是相等的；当网页被内嵌时，top和window是不相等的；可以在本网站的页面中添加如下判断：

```html
<script>
    if (top.location != window.location) {
        //如果不相等，说明使用了iframe，可进行相关的操作
    }
</script>
```

但是这种方式并不是万能的，因为iframe标签中的属性sandbox属性是可以禁用内嵌网页的脚本的：

```html
<iframe sandbox='allow-forms' src='...'></iframe>
```

* 设置http响应头X-FRAME-OPTIONS是目前最可靠的方法。X-FRAME-OPTIONS是微软提出的一个HTTP头，专门用来防御利用iframe嵌套的点击劫持攻击。

[iframe sandbox属性](https://blog.csdn.net/weixin_33881140/article/details/88765572)

```js
DENY // 禁止内嵌
SAMEORIGIN // 只允许同域名内嵌
ALLOW-FROM // 指定可以内嵌的地址
```

* 一些辅助手段，比如添加验证码，提高用户的防范意识。

