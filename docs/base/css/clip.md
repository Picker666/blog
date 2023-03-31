# 元素剪切

## clip

前提（二者之一）：

* 绝对定位：“position:absolute”；
* 固定定位：“position:fixed”。

```css
clip: auto | rect(top, right, bottom, left) | inherit;
```

* 1、auto：该元素未被剪裁；
* 2、inherit：元素从其父级继承其clip值；
* 3、rect(top, right, bottom, left)：指定矩形剪切区域。也就是说，它指定在剪切元素后的可见的元素区域是矩形的。

## clip-path

clip-path CSS 属性可以创建一个只有元素的部分区域可以显示的剪切区域。区域内的部分显示，区域外的隐藏。

### 1.inset； 将元素剪裁为一个矩形

clip-path: inset(<距离元素上面的距离>,<距离元素右面的距离> ,<距离元素下面的距离>,<距离元素左面的距离>,<圆角边框> ），

括号内的值类似于margin、padding值的写法，可以写一个值，也可以写多个值。

```css
clip-path: inset(2px 2px 20px 20px round 10px);
```

### 2、circle；将元素剪裁成一个圆

clip-path: circle(圆的半径 at 圆心)；

```css
clip-path: ellipse(20px 40px at 50% 50%)
```

### 3.　ellipse；将元素剪裁成一个椭圆

clip-path: ellipse(圆的水平半径 圆的垂直半径 at 圆心)

```css
clip-path: ellipse(20px 40px at 50% 50%)
```

### polygon；将元素剪裁成一个多边形

这里其实就是描点，多点连线，最少三个点，以距离左上角的长度为单位，跟canvas画布很像，下面以三角形为例

clip-path: polygon(<距离左上角的X轴长度  距离左上角Y轴的长度>，<距离左上角的X轴长度  距离左上角Y轴的长度>，<距离左上角的X轴长度  距离左上角Y轴的长度>)

```css
clip-path: polygon(40px 0px, 0px  80px, 80px 80px);
```
