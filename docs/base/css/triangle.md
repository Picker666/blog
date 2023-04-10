# 纯css画一个三角形

## 画个三角形

```css
/* 方案一 */
 .triangle {
      width: 0px;
      height: 0px;
      border-top: 100px solid transparent;
      border-bottom: 100px solid red;
      border-left: 100px solid transparent;
      border-right: 100px solid transparent;
  }

/* 方案二： */
  #triangle1::before{
    content: " ";
    display: inline-block;
    border-width: 40px 20px 0px;
    border-style: solid;
    border-color: orange transparent transparent;
    width: 40px;
}
  
<div class="triangle"></div>
```

## 画个梯形

```css
/* 方案一： */
.ladderShaped {
   display: inline-block;
    border-width: 40px 20px 0px;
    border-style: solid;
    border-color: orange transparent transparent;
    width: 60px;
}
/* 方案二： */
.ladderShaped1 {
  overflow: hidden;
  height: 30px;

   &::before{
    content: " ";
    display: inline-block;
    border-width: 40px 20px 0px;
    border-style: solid;
    border-color: orange transparent transparent;
    width: 40px;
  }
}

/* 方案三： */
.ladderShaped2 {

   &::before{
    content: " ";
    display: inline-block;
    border-width: 40px 20px 0px;
    border-style: solid;
    border-color: orange transparent transparent;
    width: 60px;
  }
<div id='ladderShaped2'></div>
```
