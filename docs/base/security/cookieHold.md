# Cookie挟持

HTTP是无状态的协议，为了维持和跟踪用户的状态，引入了Cookie和Session。 Cookie包含了浏览器客户端的用户凭证，相对较小。Session则维护在服务器，用于维护相对较大的用户信息。可以把Cookie当成密码，而Session是保险柜。由于HTTP是明文传输，Cookie很容易被盗取，如果被盗取，别人就可以冒充你的身份，打开你的保险柜，获取你的信息，动用你的资金，这是很危险的。

Cookie和Session的关系可以看这篇：[浅谈session和cookie的关系](https://www.cnblogs.com/suguangti/p/11043039.html)

## 危害

盗取cookie信息，冒充他人身份，盗取信息。

## 防御

* 给cookie添加HttpOnly属性，该属性设置后，只能在http请求中传递，在脚本中，document.cookie无法获取到该cookie值，对XSS攻击有防御作用，但对网络拦截还是会泄露。
* 在cookie中添加校验信息，这个校验信息和当前用户外置环境有些关系，比如ip、user agent等有关.这样当cookie被人劫持冒用时，在服务器端校验的时候，发现校验值发生了变化，因此会要求用户重新登录，可以规避cookie劫持。
* cookie中session id的定时更换，让session id按一定频率变换，同时对用户而言，该操作是透明的，这样保证了服务体验的一致性。
