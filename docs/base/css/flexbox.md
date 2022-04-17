# flex box（弹性盒布局模型）

## 一、是什么

Flexible Box 简称 flex，意为”弹性布局”，可以简便、完整、响应式地实现各种页面布局

采用Flex布局的元素，称为flex容器container

它的所有子元素自动成为容器成员，称为flex项目item

[弹性布局](/blog/images/base/flex1.png)

容器中默认存在两条轴，主轴和交叉轴，呈90度关系。项目默认沿主轴排列，通过flex-direction来决定主轴的方向

每根轴都有起点和终点，这对于元素的对齐非常重要。

## 二、属性

关于flex常用的属性，我们可以划分为容器属性和容器成员属性

容器属性有：

* 1、flex-direction
* 2、flex-wrap
* 3、flex-flow
* 4、justify-content
* 5、align-items
* 6、align-content

...

[rest](https://vue3js.cn/interview/css/flexbox.html#%E4%BA%8C%E3%80%81%E5%B1%9E%E6%80%A7)