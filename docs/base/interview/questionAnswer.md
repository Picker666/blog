# 问答

## 1、表单可以跨域吗

首先，表单的提交方式有两种

* 一种是直接指定表单的action。
* 一种是ajax接手控制请求

直接使用action的时候，是直接把请求交给了action里面的域，本身页面不会去管他的请求结果，后面的步骤交给了action里面的域。好比：

```js
<from action="baidu.com">
    // you form filed
</from>
```

上面这个表单提交后，剩余的操作就交给了action里面的域baidu.com，本页面的逻辑和这个表单没啥关系，由于**不关系请求的响应，所以浏览器认为是安全的**。

而使用ajax来控制form的请求的时候，页面js会需要知道请求的返回值，这个时候，浏览器发出跨域请求，需要获得授权才可以成功请求，否则是会拒绝的。

看看跨域的定义：

跨域指的是“跨域资源共享（Cross-Origin Resource Sharing，CORS）”。当一个资源从与改资源本身所在服务器的不同的域或不同的端口请求一个资源时，资源会发起一个跨域HTTP请求。

## 2、为什么说js是单线程，而不是多线程

先说下js是运行在浏览器上的脚本语言，通过与用户进行互动来对DOM进行操作，举个例子，假设js有2个线程，一个线程给a节点添加内容，另一个线程对a节点进行删除操作，那么浏览器应该以哪个线程为准哪？ 所以js是单线程。

## 3、为什么typeof可以检测类型，有没有更好的方法

typeof 一般被用于判断一个变量的类型，我们可以利用 typeof 来判断number, string, object, boolean, function, undefined, symbol 这七种类型，这种判断能帮助我们搞定一些问题，js在底层存储变量的时候会在变量的机器码的低位1-3位存储其类型信息(000：对象，010：浮点数，100：字符串，110：布尔，1：整数)，但是null所有机器码均为0，直接被当做了对象来看待。
...

## 4、如何理解事件委托？事件委托的优缺点有哪些

JavaScript事件代理则是一种简单的技巧，通过它你可以把事件处理器添加到一个上级元素上，这样就避免了把事件处理器添加到多个子级元素上。当我们需要对很多元素添加事件的时候，可以通过将事件添加到它们的上级元素而将事件委托给上级元素来触发处理函数。这主要得益于浏览器的事件冒泡机制。事件代理用到了两个在JavaScript事件中常被忽略的特性：事件冒泡以及目标元素。

优点：

* 1、减少事件注册，节省内存。比如
  * 在table上代理所有td的click事件。
  * 在ul上代理所有li的click事件。
* 2、简化了dom节点更新时，相应事件的更新。比如
  * 不用在新添加的li上绑定click事件。
  * 当删除某个li时，不用移解绑上面的click事件。

缺点：

* 1、事件委托基于冒泡，对于不冒泡的事件不支持
* 2、层级过多，冒泡过程中，可能会被某层阻止掉。
* 3、理论上委托会导致浏览器频繁调用处理函数，虽然很可能不需要处理。所以建议就近委托，比如在table上代理td，而不是在document上代理td。
* 4、把所有事件都用代理就可能会出现事件误判。比如，在document中代理了所有button的click事件，另外的人在引用改js时，可能不知道，造成单击button触发了两个click事件。

## 5、使用js如何改变url，并且页面不刷新？

改变URL的目的是让js拿到不同的参数，进行不同的页面渲染，其实就是vue-router的原理

* 最简单的就是改变hash，改变hash是并不会刷新页面的，也会改变URL，也能监听`onhashchange`事件进行页面的渲染
* 还有一种就是使用history.pushState()方法，该方法也可以改变url然后不刷新页面，但是该方法并不能够触发popstate事件，不过pushState使我们手动触发的，还能不知道url改变了么，其实这时候并不需要监听popstate我们就能够知道url改变拿到参数并渲染页面

::: tip

* 1、window.history.pushState
  在window.history里新增一个历史记录点

  ```js
    // 当前的url为：http://qianduanblog.com/index.html
  var json={time:new Date().getTime()};
  // @状态对象：记录历史记录点的额外对象，可以为空
  // @页面标题：目前所有浏览器都不支持
  // @可选的url：浏览器不会检查url是否存在，只改变url，url必须同域，不能跨域
  window.history.pushState(json,"","http://qianduanblog.com/post-1.html");
  ```

  执行了pushState方法后，页面的url地址为http://qianduanblog.com/post-1.html。 但是页面不会重新渲染

* 2、window.history.replaceState
  window.history.replaceState和window.history.pushState类似，不同之处在于replaceState不会在window.history里新增历史记录点，其效果类似于window.location.replace(url)，都是不会在历史记录点里新增一个记录点的。当你为了响应用户的某些操作，而要更新当前历史记录条目的状态对象或URL时，使用replaceState()方法会特别合适。

window.onpopstate 监听url的变化，并且可以获取存储在该历史记录点的状态对象，也就是上文说到的json对象

注意的：javascript脚本执行window.history.pushState和window.history.replaceState不会触发onpopstate事件。

谷歌浏览器和火狐浏览器在页面第一次打开的反应是不同的，谷歌浏览器奇怪的是回触发onpopstate事件，而火狐浏览器则不会。

谷歌浏览器和火狐浏览器在页面第一次打开的反应是不同的，谷歌浏览器奇怪的是回触发onpopstate事件，而火狐浏览器则不会。
:::

## 6、为什么推荐requestAnimationFrame实现的动画

* 1、requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随**浏览器的刷新频率**，一般来说，这个频率为每秒60帧。
* 2、在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的的cpu，gpu和内存使用量。

怎么停止requestAnimationFrame？

cancelAnimationFrame()接收一个参数 requestAnimationFrame默认返回一个id

## 7、js中自定义事件的使用与触发

```js
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```
