# ajax的封装

## XMLHttpRequest

XMLHttpRequest 得到了所有现代浏览器较好的支持。唯一的浏览器依赖性涉及 XMLHttpRequest 对象的创建。在 IE 5 和 IE 6 中，必须使用特定于 IE 的 ActiveXObject() 构造函数。

### readyState

| 状态 | 名称 | 描述 |
| ---- | ---- | ---- |
|0    | Uninitial | 初始化状态。XMLHttpRequest 对象已经创建或已被 abort() 方法重置|
|1  | Open | open() 方法已调用，但是 send() 方法未调用，请求还没发送。|
|2  | Sent | Send() 方法已调用，HTTP 请求已发给送Web服务器。未接收响应。|
|3  | Receiving| 所有的响应头部已经接收到。响应题开始接受但未完成。|
|4  | Loaded | HTTP 响应已经完成接收。|

:::tip
readyState 的值不会递减，除非当一个请求在处理过程中的时候调用了 abort() 或 open() 方法。每次这个属性的值增加的时候，都会触发 onreadystatechange 事件句柄。
:::

### responseText

如果 readyState 小于 3，这个属性就是一个空字符串。当 readyState 为 3，这个属性返回目前已经接收的响应部分。如果 readyState 为 4，这个属性保存了完整的响应体。

### responseXML

对请求的响应，解析为 XML 并作为 Document 对象返回。

### status

由服务器返回的 HTTP 状态代码，如 200 表示成功，而 404 表示 “Not Found” 错误。当 readyState 小于 3 的时候读取这一属性会导致一个异常。

### statusText

这个属性用名称而不是数字指定了请求的 HTTP 的状态代码。也就是说，当状态为 200 的时候它是 “OK”，当状态为 404 的时候它是 “Not Found”。和 status 属性一样，当 readyState 小于 3 的时候读取这一属性会导致一个异常。

### onreadystatechange

每次 readyState 属性改变的时候调用的事件句柄函数。当 readyState 为 3 时，它也可能调用多次。

### abort()

取消当前响应，关闭连接并且结束任何未决的网络活动。

这个方法把 XMLHttpRequest 对象重置为 readyState 为 0 的状态，并且取消所有未决的网络活动。例如，如果请求用了太长时间，而且响应不再必要的时候，可以调用这个方法。

### getAllResponseHeaders()

把 HTTP 响应头部作为未解析的字符串返回。

如果 readyState 小于 3，这个方法返回 null。否则，它返回服务器发送的所有 HTTP 响应的头部。头部作为单个的字符串返回，一行一个头部。每行用换行符 “\r\n” 隔开。

### getResponseHeader()

返回指定的 HTTP 响应头部的值。其参数是要返回的 HTTP 响应头部的名称。可以使用任何大小写来制定这个头部名字，和响应头部的比较是不区分大小写的。

该方法的返回值是指定的 HTTP 响应头部的值，如果没有接收到这个头部或者 readyState 小于 3 则为空字符串。如果接收到多个有指定名称的头部，这个头部的值被连接起来并返回，使用逗号和空格分隔开各个头部的值

### open()

初始化 HTTP 请求参数，例如 URL 和 HTTP 方法，但是并不发送请求。

open(method, url, async, username, password)

method 参数是用于请求的 HTTP 方法。值包括 GET、POST 和 HEAD。

url 参数是请求的主体。大多数浏览器实施了一个同源安全策略，并且要求这个 URL 与包含脚本的文本具有相同的主机名和端口。

async 参数指示请求使用应该异步地执行。如果这个参数是 false，请求是同步的，后续对 send()
的调用将阻塞，直到响应完全接收。如果这个参数是 true 或省略，请求是异步的，且通常需要一个 onreadystatechange
事件句柄。

username 和 password 参数是可选的，为 url 所需的授权提供认证资格。如果指定了，它们会覆盖 url
自己指定的任何资格。

### send()

send(body)

发送 HTTP 请求，使用传递给 open() 方法的参数，以及传递给该方法的可选请求体。

如果通过调用 open() 指定的 HTTP 方法是 POST 或 PUT，body 参数指定了请求体，作为一个字符串或者 Document对象。如果请求体不适必须的话，这个参数就为 null。对于任何其他方法，这个参数是不可用的，应该为 null（有些实现不允许省略该参数）

### setRequestHeader()

setRequestHeader(name, value)

name 参数是要设置的头部的名称。这个参数不应该包括空白、冒号或换行。
value 参数是头部的值。这个参数不应该包括换行。

方式一：

```js
ajax = (method, url, options) => {
  //从options里拿到成功和失败两个函数
  const { success, fail } = options;
  //创建请求对象
  const request = new XMLHttpRequest();
  //打开一个请求,这里的参数现在是ajax函数传入的
  request.open(method, url);
  //监听请求事件
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status < 400) {
        //请求成功将response传给成功函数
        success(request.response);
      } else if (request.status >= 400) {
        //请求失败将resource传给失败函数
        fail(request.response);
      }
    }
  };
  //发送这个请求
  request.send();
};
```

方式二：

```js
function ajax({
  url= null,
  method = 'GET',
  dataType = 'JSON',
  async = true}){

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open(method, url, async)
      xhr.responseType = dataType;
      xhr.onreadystatechange = () => {
        if(!/^[23]\d{2}$/.test(xhr.status)) return;
        if(xhr.readyState === 4) {
          let result = xhr.responseText;
          resolve(result);
        }
      }
      xhr.onerror = (err) => {
        reject(err);
      };

      xhr.send();
    })
}
```
