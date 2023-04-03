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

`cancelAnimationFrame()`接收一个参数 `requestAnimationFrame` 默认返回一个id

## 7、js中自定义事件的使用与触发

### 7.1、Event()

```js
const myEvent = new Event(eventName, eventOptions);
```

* eventName : String类型，必选项，表示事件的名称;
* eventOptions : Object类型，事件的可选配置项;

|字段 | 说明 | 类型 | 默认值|
| -- | ---| --- | --- |
|bubbles| 事件是否冒泡 | Boolean | false|
|bubbles | 事件是否冒泡 | Boolean |  false|
|cancelable | 事件是否能被取消| Boolean | false|

```js
var event = new Event('build');

// Listen for the event.
elem.addEventListener('build', function (e) { ... }, false);

// Dispatch the event.
elem.dispatchEvent(event);
```

### 7.2、CustomEvent()

```js
const myEvent = new CustomEvent(eventName, eventOptions);
```

* eventName : String类型，必选项，表示事件的名称
* eventOptions : Object类型，事件的可选配置项

|字段 | 说明 | 类型 | 默认值|
| -- | ---| --- | --- |
|detail| 事件中需要被传递的数据 | Any | null|
|bubbles | 事件是否冒泡 | Boolean |  false|
|cancelable | 事件是否能被取消| Boolean | false|

```js
const sendEvent = new CustomEvent("sendMsg", {detail:{
  name: "Picker"
}})
document.addEventListener("sendMsg",print)
document.dispatchEvent(sendEvent)
function print(e) {
  console.log(e.detail.name)
}
```

::: tip
Event和CustomEvent最大的区别在于，CustomEvent可以传递数据。
:::

## 8、可控组件和非可控组件的选择

受控组件（用户输入 ---> state 更新 ---> 组件更新）的消耗明显比非受控组件大的多，但非受控组件只能在需求非常简单的情况下的使用。

| -特性	-                          | -uncontrolled- | -受控组件 |
| -------------------------------- | -------------- | --------- |
| 只用一次（例如：只在提交时使用） | ✅              | ✅         |
| 提交时验证                       | ✅              | ✅         |
| 立即验证                         | ❌              | ✅         |
| 根据表单填写情况动态禁用提交按钮 | ❌              | ✅         |
| 固定输入格式                     | ❌              | ✅         |
| 多个输入确定一个值               | ❌              | ✅         |
| 动态的输入框（例如：小组成员）   | ❌              | ✅         |

## 9、e.target和e.curerntTarget

e.target 是触发事件的元素。
e.currentTarget 是绑定事件的元素。

## 10、你平常做项目的时候，遇到过哪些安全漏洞？

* 1、form表单提交前加上校验，防止xss攻击。为防止xss攻击，表单的每个字段提交需要做校验或者编码过滤。校验的话可以用正则，比如校验手机号或者邮箱之类的。编码过滤的话，提交前需要对提交的内容进行编码过滤，防止特殊的标签之类的提交到后台。比如用户输入 '’ 这类的脚本或者html标签之类的。要过滤掉，防止提交到后台。
* 2、限制URL访问，越权访问。1在公共模块增加校验方式，查看是否具有对应权限。例如，每个客户只能查看和修改自己的信息，在url地址栏参数中，带的参数有序列号之类的，攻击者可能会想到，客户的序列号是按照顺序往下排的，要是按顺序加一减一是不是就可能访问到别人的账号（水平越权）。还有一种是不同级别的登陆者登陆所拥有的功能权限不同，低权限者可能访问高权限者的账号，从而使用原本它不具有的功能，这种也是越权漏洞，属于垂直越权。2监听路由跳转，在路由跳转之前，增加校验（路由导航守卫）。3和后台联调，将对应的信息存入cookie，在数据访问时进行对比。
* 3、文件上传漏洞。例如用户上传任意类型的文件可能会让攻击者注入危险内容或恶意代码，并在服务器上运行。解决：1严格限制用户上传的文件后缀以及文件类型。2定义上传文件类型白名单，只允许白名单里面类型的文件上传。3文件上传目录禁止执行脚本解析，避免攻击者进行二次攻击。

## 11、HTTP和HTTPS协议的区别是什么?

* 1、http，也就是超文本传输协议，是互联网上应用最为广泛的一种传输协议，它是以**明文**方式发送信息的，所以如果有不法分子截取了Web浏览器和服务器之间的传输报文，就可以直接获得信息，可想而知这样是不安全。
* 2、https可以认为是http的安全版，是在HTTP的基础上加入了**SSL协议**，https中的s就指的是SSL协议，这一层协议加在了**传输层**和**应用层**之间，它可以对通信数据进行[加密](/base/browser/https.html#tls)，且能够验证身份，使得通信更加安全。当然不是绝对安全，只是会增加不法分子的破坏成本。
* 3、https和http的区别：
  * （1）二者的连接方式不同，https的端口是443，而http的端口是80。
  * （2）http传输是明文的，HTTP协议不适合传输一些敏感信息，比如：信用卡号、密码等支付信息。而https是用ssl进行加密的，安全性更高。
  * （3）https要申请ca证书，一般免费证书较少，所以需要一定的费用，而http不需。
  * （4） http协议速度比https更快，因为较https而言，它不需要经过复杂的ssl握手。而https协议需要经过一些复杂的安全过程，页面响应速度会来得慢。

## 12、说一下for…in 和 for…of的区别?

* 1、for…of遍历获取的是对象的**键值**, for…in获取的是对象的**键名**;
* 2、for…in会遍历对象的**整个原型链**, 性能非常差不推荐使用,而for…of只遍历**当前对象**不会遍历原型链;
* 3、对于数组的遍历,for…in会返回数组中所有可枚举的属性(包括原型链上可枚举的属性),for…of只返回数组的下标对应的属性值;

总结：for…in循环主要是为了遍历对象而生,不适用遍历数组; for…of循环可以用来遍历数组、类数组对象、字符串、Set、Map以及Generator对象

## 13、Hash和history有什么区别

* 1.hash就是指url后面的#号以及后面的字符，history没有带#；
* 2.原理：
  * (1) hash通过监听浏览器的onhaschange()事件变化，查找对应的路由规则；
  * (2) history原理：理由H5的history中新增的两个API push State()和replace State() 和一个事件onpopstate监听url变化；
* 3.hash能兼容到IE8，history只能兼容到IE10；
* 4.由于hash值变化不会导致浏览器向服务器发出请求，而且hash改变会触发hashchange事件（hashchange只能改变#后面的url片段）；虽然hash路径出现在url中，但是不会出现在HTTP请求中，对后端完全没有影响，因此改变hash值不会重新加载页面，基本都是使用hash来实现前端路由的。
