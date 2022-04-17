# BFC (Block Formatting Context)

## Block Formatting Context

BFC（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：

* 内部的盒子会在垂直方向上一个接一个的放置
* 对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。
* 每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
* BFC的区域不会与float的元素区域重叠
* 计算BFC的高度时，浮动子元素也参与计算
* BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

## 触发条件

* 根元素，即HTML元素
* 浮动元素：float值为left、right
* overflow值不为 visible，为 auto、scroll、hidden
* display的值为inline-block、inltable-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
* position的值为absolute或fixed
