# WebPageTest

https://blog.csdn.net/caixiangting/article/details/126389391

## 配置

* 1、输入测试地址
* 2、选择测试地点
* 3、选择浏览器
* 4、高级配置
  * 网络情况设置；
  * 测试次数；
  * first view and repeat view；
  * capture video（录视频）。

## 解读报告

* 瀑布图
  * Queueing
  * Stalled、DNS Lookup、Initial connection、SSL
  * Request sent、Waiting for server response（TTFB）、Content Download
* first view 首次访问 TTDB, start rander, page index
* repeat view 二次访问, 反应资源缓存情况

## 本地部署 WebPageTest

docker
