# 存储

## 优劣

### 1．`localStorage`

* 将数据保存在客户端本地的硬件设备(通常指硬盘，也可以是其他硬件设备)中，即使浏览器被关闭了，该数据仍然存在，下次打开浏览器访问网站时仍然可以继续使用。

**优点：**

* `localStorage`生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除`localStorage`信息，否则这些信息将永远存在。
* 相同浏览器的不同页面间可以共享相同的 `localStorage`（页面属于相同域名和端口）。

**缺点:**

* 同一个属性名的数据会被替换。
* 不同浏览器无法共享`localStorage`或`sessionStorage`中的信息。

### ２．`sessionStorage`

* 将数据保存在`session`对象中。所谓`session`，是指用户在浏览某个网站时，从进入网站到浏览器关闭所经过的这段时间，也就是用户浏览这个网站所花费的时间。`session`对象可以用来保存在这段时间内所要求保存的任何数据

**优点：**

* `sessionStorage`生命周期为当前窗口或标签页，
* `sessionStorage`的数据不会被其他窗口清除
* 页面及标 签页仅指顶级窗口，如果一个标签页包含多个iframe标签且他们属于[同源](/base/storage.html#同源)页面，那么他们之间是可以共享`sessionStorage`的。

**缺点：**

* 一旦窗口或标签页被永久关闭了，那么所有通过`sessionStorage`存储的数据也就被清空了。

### cookie

* `HTTP Cookie`简称`cookie`,在HTTP请求发送`Set-Cookie` HTTP头作为响应的一部分。通过`name=value`的形式存储
* `cookie`的构成：
名称：`name`(不区分大小写,但最好认为它是区分的)<br/>
值: `value`(通过URL编码:`encodeURIComponent`)<br/>
域<br/>
路径<br/>
失效时间:一般默认是浏览器关闭失效,可以自己设置失效时间<br/>
安全标志:设置安全标志后只有SSL连接的时候才发送到服务器<br/>

* `cookie`的作用:主要用于保存登录信息
* 生命期为只在设置的`cookie`过期时间之前一直有效，即使窗口或浏览器关闭。 存放数据大小为4K左右 。有个数限制（各浏览器不同），一般不能超过`20`个。与服务器端通信：每次都会携带在`HTTP`头中，如果使用`cookie`保存过多数据会带来性能问题

### `cookie`的优点

* 具有极高的扩展性和可用性
* 通过良好的编程，控制保存在`cookie`中的session对象的大小
* 通过加密和安全传输技术，减少`cookie`被破解的可能性
* 只有在`cookie`中存放不敏感的数据，即使被盗取也不会有很大的损失
* 控制`cookie`的生命期，使之不会永远有效。这样的话偷盗者很可能拿到的就 是一个过期的`cookie`

### `cookie`的缺点

* `cookie`的长度和数量的限制。每个domain最多只能有20条`cookie`，每个`cookie`长度不能超过4KB，否则会被截掉
安全性问题。
* 如果`cookie`被人拦掉了，那个人就可以获取到所有session信息。
* 加密的话也不起什么作用。
* 有些状态不可能保存在客户端。例如，为了防止重复提交表单，我们需要在服务端保存一个计数器。若吧计数器保存在客户端，则起不到什么作用

|         |          cookie         |      localStorage      | sessionStorage |
| ------- | ----------------------- | ---------------------- | -------------- |
| 声明周期 |     可自行设置过期时间     |   需自行删除否则一直存在   |    浏览器关闭    |
|   大小   |       20条，每条4K       |           5MB          |      5MB       |
|   使用   |    不方便，需要自己封装    |        可直接使用        |    可直接使用    |
|  作用域  | 当前域内，可以使不同的标签页 | 同源，不同标签页间可以共享 |   仅当前标签页    |
| 存储位置 |   本地硬件设备（如：硬盘）   |  本地硬件设备（如：硬盘）  |    session对象   |

::: warning 注意
时刻注意[XSS](/base/xss)注入的风险，因为可以在控制台直接访问它们，所以不要存入敏感数据
:::

## 操作

一个图表来说明：

|                |   存储   |   获取   |    删除    | 清除所有 |
| -------------- | ------- | ------- | ---------- | ------- |
|  localStorage  | setItem | getItem | removeItem |  clear  |
| sessionStorage | setItem | getItem | removeItem |  clear  |

::: warning 注意
`JSON`对象提供的`parse`和`stringify`将其他数据类型转化成字符串，再存储到`storage`中就可以了
:::

如下

```js
// 存
const person = {"name":"Picker666","age":"18"}
localStorage.setItem("userInfo",JSON.stringify(person));

// 取：
const user = JSON.parse(localStorage.getItem("userInfo"))

// 删除：
localStorage.remove("userInfo");

// 清空：
localStorage.clear();
```

## 同源

同源的判断规则：

URL"http://www.example.com/dir/page.html"的对比。

| 对比URL | 结果 | 结果 |
| ---- | ---- | ---- |
| http://www.example.com/dir/page2.html | 同源 | 相同的协议，主机，端口 |
| http://www.example.com/dir2/other.html | 同源 | 相同的协议，主机，端口
| http://username:password@www.example.com/dir2/other.html | 同源 | 相同的协议，主机，端口 |
| http://www.example.com:81/dir/other.html | 不同源 | 相同的协议，主机，端口不同 |
| https://www.example.com/dir/other.html | 不同源 | 协议不同 |
| http://en.example.com/dir/other.html | 不同源 | 不同主机 |
| http://example.com/dir/other.html | 不同源 | 不同主机(需要精确匹配) |
| http://v2.www.example.com/dir/other.html | 不同源 | 不同主机(需要精确匹配) |
| http://www.example.com:80/dir/other.html | 看情况 | 端口明确，依赖浏览器实现 |
