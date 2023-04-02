# 伪类和伪元素的区别

伪类：当我们希望样式在某些特定状态下才被呈现到指定的元素时，换句话说就是，当某个元素状态改变时，我们期待给这个元素添加一些特殊效果，那么我们就可以往元素的选择器后面加上对应的伪类。比如**: hover**就能够指定当我们悬浮在某元素上时，期望该元素要显示的样式。

伪元素：则是创建了一些不在文档树中的元素，并为其添加样式，需要注意的是伪元素样式里必须要给它一个content属性。比如可以通过**::before**伪元素在个元素前增加一些文本，并为这些文本添加样式。这些文本实际上不在文档树中的，所以叫伪元素。

总结来看，伪类的操作对象是文档树中已有的元素，而伪元素则是创建文档树以外的元素并为其添加样式。所以二者最核心区别就在于，是否创造了“新的元素"。

```html
<template>
  <div>
    <div class="div1">第一个字符是红色。</div>
    <div class="div2">选择部分背景是黑色哟。</div>
    <div class="div3">该内容前面插入内容123。</div>链接被访问后是红色，悬浮是绿色。<div>
    <p>第一个p元素会是黄色</p>
    <p>第一个p元素会是黄色</p>
    </div>
  </div>
</template>
<style scoped>
/*单冒号(是伪类，双冒号《::》是伪元素*/
.div1::first-letter{
    color: red;
}
.div2::selection{
  background-color: black;
}
.div3::before{
  content:'123';
}
a:visited {
  color: red;
}
a:hover{
  color: limegreen;
}
p:first-child {
  color:yellow;
}
<style>

```
