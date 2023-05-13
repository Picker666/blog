# 浏览器渲染优化

## 重绘（repaint）和回流（reflow）

### 回流

影响回流的操作：

* 1、添加、删除元素
* 2、操作styles
* 3、display: none
* 4、offset*（offsetLeft、offsetTop、offsetWidth、offsetHeight）、scroll*（scrollLeft、scrollTop、scrollWidth、scrollHeight）、client*（clientLeft、clientTop、clientWidth、clientHeight ）
* 5、移动元素位置
* 6、修改浏览器大小、字体大小

## 减少回流

* fastdom
* 复合图层

## 减少重绘

* 