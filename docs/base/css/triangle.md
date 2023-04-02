# 纯css画一个三角形

```css
 .triangle {
      width: 0px;
      height: 0px;
      border-top: 100px solid transparent;
      border-bottom: 100px solid red;
      border-left: 100px solid transparent;
      border-right: 100px solid transparent;
  }
  
<div class="triangle"></div>
```

```css
   #triangle {
        margin: 100px;
        /* width: 100px;
        height: 100px; */
        background-color: pink;
        position: relative;
    }

    #triangle::before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        top: 0px;
        left: 100px;
        border-top: solid 50px transparent;
        border-left: solid 50px pink;
        border-bottom: solid 50px transparent;
    }
<div id='triangle'></div>

```