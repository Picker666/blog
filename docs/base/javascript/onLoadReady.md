# window.onload和document.ready

## 1、执行时间

![网页加载执行时间图](/blog/images/base/onLoadReady1.png)

window.onload必须等到页面内包括图片的所有元素和资源加载完毕后才能执行，也就是上述图片的时间点2；

document.ready()是DOM加载完毕后就执行，不必等到整个网页资源加载完毕，也就是在上述图片的时间点1。

:::warning
使用document.ready()方法的执行速度比window.onload的方法要快。
:::

## 2、编写个数不同

window.onload不能同时编写多个，如果有多个window.onload方法，只会执行一个

document.ready()可以同时编写多个，并且都可以得到执行。

## window.onload和DOMContentLoaded的区别

* 1、当 onload 事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了。
* 2、当 DOMContentLoaded 事件触发时，仅当**DOM加载完成**，不包括样式表，图片，flash。
