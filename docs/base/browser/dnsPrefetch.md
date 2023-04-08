# dns-Prefetch

## DNS 优化

* 减少DNS请求次数；
* 缩短DNS解析的时间 -- dns-prefetch

## 关于dns-prefetch

dns-prefetch(DNS预获取)是前端网络性能优化的一种措施。

它根据浏览器定义的规则，提前解析之后**可能**会用到的域名，使解析结果缓存到系统缓存中，缩短DNS解析时间，进而提高网站的访问速度。

但是 dns 缓存的时间是有限的

系统

* Windows 默认值是 MaxCacheTTL，86400s，也就是一天；
* macOS 严格遵循DNS协议中的TTL。

浏览器：

浏览器也会缓存DNS记录, 但是浏览器DNS缓存时间跟TTL无关，每种浏览器都有一个固定值。

* Chrome 对每个域名会默认缓存60s；
* IE DNS缓存30min；
* Firefox 默认缓存时间只有1分钟，可以通过修改该默认值加快DNS解析速度；
  * 打开一个新的窗口，地址栏输 入 about:config，回车，进入设置界面。然后搜索 network.dnsCacheExpiration ，把原来的60改成6000（表示缓存6000秒），再搜索network.dnsCacheEntries 把默认的20改成1000（表示缓存1000条）。如果没有上面两个项目，新建它们即可，新建条目类型为整数型。 当然也可以按照需要设置成其它的值。
* afari 约 10s。

:::tip
TTL(Time-To-Live)，就是一条域名解析记录在DNS服务器中的存留时间

浏览器DNS缓存的时间跟DNS服务器返回的TTL值无关, 它的缓存时间取决于浏览器自身设置。

系统缓存会参考DNS服务器响应的TTL值，但是不完全等于TTL值。

国内和国际上很多平台的TTL值都是以秒为单位的，很多的默认值都是3600，也就是默认缓存1小时。
:::

## dns-prefetch 是如何优化

每当浏览器从（第三方）服务器发送一次请求时，都要先通过DNS解析将该跨域域名解析为 IP地址，然后浏览器才能发出请求。每次的DNS解析都会花时间的，并且这部分时间什么也干不了。

如果同一时间内，有多个请求都发送给同一个服务器，那么DNS解析会多次并且重复触发。这样会导致整体的网页加载有延迟的情况。虽然DNS解析占用不了多大带宽，但是它会产生很高的延迟，尤其是对于移动网络会更为明显。

dns-prefetch 预解析技术，是在请求连接之前进行查询，并缓存，一方面避免了请求连接时候再次DNS查询，另一方面，避免并发多个相同请求造成重复域名解析。

:::warning
dns-prefetch最大的缺点就是使用它太多,对网络是一种负担。
:::

## dns-prefetch 过程

当浏览器访问一个域名的时候，需要解析一次DNS，获得对应域名的ip地址。 在解析过程中，按照:

* 浏览器缓存
* 系统缓存 -- 缓存之后DNS解析时间可以低至0-1m；
* 路由器缓存 -- 缓存后的解析时间最小也要约15ms；
* ISP(运营商)DNS缓存 -- 缓存后解析时间在80-120ms，不常见的域名，平均需要200-300ms；
* 根域名服务器
* 顶级域名服务器
* 主域名服务器

dns-prefetch 相当于在浏览器缓存之后，在本地操作系统中做了DNS缓存。

从第二步之后已经不受我们控制，时间大概是 15 - 300ms，也就是使用 dns-prefetch 后续的解析步骤就不用执行了，可以带来 15 - 300ms 时间上的优化。

## 使用

DNS Prefetch 应该尽量的放在网页的前面，推荐放在 `<meta charset="UTF-8">` 后面。

开始是为了适配  https  和   http  。就是当前请求链接是https ，那么这个//前面自动补充https ，反则补充http 。

```html
<link rel="dns-prefetch" href="//www.baidu.com.cn/">
```

* 1、对静态资源域名做手动dns prefetching。
* 2、对js里会发起的跳转、请求做手动dns prefetching。
* 3、不用对超链接(a标签的hre)做手动dns prefetching，因为chrome会自动做dns prefetching。
* 4、dns-prefetch 仅对跨域域上的 DNS查找有效，因此请避免使用它来指向相同域

:::warning
手动dns prefetching的代码实际上还是会增加html的代码量的，特别是域名多的情况下
:::

:::tip
考虑将 dns-prefetch 与 preconnect(预连接)提示配对。

如果站点是通过HTTPS服务的，两者的组合会涵盖DNS解析，建立TCP连接以及执行TLS握手。将两者结合起来可提供进一步减少跨域请求的感知延迟的机会。如下所示：

```html
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
<link rel="dns-prefetch" href="https://fonts.gstatic.com/">
```

如果页面需要建立与许多第三方域的连接，则将它们预先连接会适得其反。 preconnect 提示最好仅用于最关键的连接。对于其他的，只需使用 `<link rel="dns-prefetch">` 即可节省第一步的时间DNS查找

:::

dns缓存前：
![dns缓存前](/images/base/dnsPrefetch1.png)

dns缓存后：
![dns缓存后](/images/base/dnsPrefetch2.png)
