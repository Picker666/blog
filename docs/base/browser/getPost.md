# get 和 post 的区别

**get请求**：从指定的资源请求数据，用于获取数据或者附带条件获取数据，一般用于搜索排序和筛选之类的操作。

**post请求**：向指定的资源提交要被处理的数据，用于将数据发送给服务器，一般用于修改和写入数据。

get请求和post请求本质上就是TCP链接，并无差别。但是由于HTTP的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。

* 1、post请求更安全，get请求的参数会作为 url 的一部分，会被缓存（静态资源被缓存，数据不会缓存），会被保存在服务器日志和浏览器历史记录中；post的参数存放在 request body 中，只有经过设置之后才会被缓存，也不会被保存在浏览器历史记录中；
* 2、get 请求发送数据量受限于 url 的参数长度（受浏览器和web服务器决定，一般1-8k，2k），post怎没有限制；
* 3、post 请求可以发送更多类型的数据（multipart/form-data、text/plain、application/json、appliacation/x-www-form-urlencoded），get请求只能进行url编码（appliacation/x-www-form-urlencoded）；
* 4、get请求产生一个TCP数据包；post请求产生两个TCP数据包（get请求，浏览器会把http header和data一并发送出去，服务器响应200返回数据；post请求，浏览器先发送header，服务器对其进行校验，如果校验通过，响应100 continue，浏览器再发送data，服务器响应200 返回数据，如果请求被拒了，服务器就回复个400之类的错误，这个交互就终止了。这样做的优点是可以避免浪费带宽传输请求体）

:::tip 四种enctype属性值

Content-Type 字段

|值 |	描述|
| --- | --- |
| application/x-www-form-urlencoded|  在发送前编码所有字符（默认），提交的数据按照 key1=val1&key2=val2 的方式进行编码|
| multipart/form-data	| 不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。|
| application/json |  |
| text/plain | 空格转换为 "+" 加号，但不对特殊字符编码。|
:::
