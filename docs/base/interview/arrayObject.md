---
sidebarDepth: 3
---
# Array and Object

## 1、类数组（打印结果）

```ts
var obj1 = {
  '6': 6,
  '2': 2,
  '1': 5,
  length: 2,
  splice: Array.prototype.splice,
  push: Array.prototype.push,
};
obj1.push(-6);
obj1.push(0);
obj1.push(6);
obj1.push(66);
obj1.push(666);
console.log(obj1);
```

### 涉及知识点

#### 类数组（ArrayLike）

一组数据由数组来存，但是如果对数组进行扩展，会影响到数组的原型，ArrayLike 的出现则提供了一个中间数据桥梁，ArrayLike 有数组的特性，但是对ArrayLike 的扩展不会影响到原数组。

#### push 方法

push方法有意具有通用性。改方法和call() 和 apply() 一起使用时，可以应用在类数组对象上。**push 方法根据length 属性来决定从哪开始插入给定的值**。如果length不能被转成一个数值，则插入的元素索引为0，包括length不存在时，当length不存在时，将会创建它。

唯一的原生类数组（array-like）对象是 String，尽管如此，让门并不适用该方法，因为字符串是不可改变的。

#### 对象转数组的方式

Array.from()、splice()、concat() 等。

### 题分析

这个obj中定义了两个key值，分别是splice和push分别对应数组圆形中的splice和push方法，因此这个obj可以调用数组中的splice和push方法。

* 调用对象的push方法，push(-6)，

因为此时obj定义的length是2，所以从数组中的第二项开始插入，也就是数组的第三项，因为数组的索引是从0开始，此时定义了2和6的下标，所以会替代第三项也就是下标是2的值，此时key为2的属性值为-6。

* 调用对象的push方法，push(0)，

因为此时obj定义的length是3，所以从数组中的第三项开始插入，也就是数组的第四项，因为数组的索引是从0开始，此时定义了2和6的下标，所以会替代第三项也就是下标是3的值，但是此时没有下标是3的值，所以插入下标3，值为0。

* 因为没有定义0这两项，所以前面会是 empty。

结果：
![结果](/blog/images/base/interview1.png)

## 2、. 和 连续赋值 优先级

```js
var a = {n: 1};
var b = a;
a.x = a = {n: 2};
console.log(a, '====', b)
```

### 结果

![结果](/blog/images/base/interview2.png)

### 分析

* 首先前两行，a和b同时指向了值为{n: 1}的内存地址（以下简称：RAM1）;
* 然后第三句，
  * 需要说的前提是：**`赋值是从右到左的`**，**`. 的优先级高于 =`**；
  * 所以，此时a.x 中的a内存地址是RAM1，并且此时在RAM1内存的值新增了x属性；
  * 后面a={n: 2}优先执行，此时的a执行新的内存地址（RAM2），值为{n: 2}；
  * 然后执行a.x = a，即a.x= {n: 2},a.x指向新a的内存地址（即：RAM2）；
  * 此时的b的内存地址依然是RAM1，b不仅拥有第一步a（{n: 1}）的值，也新增了x属性。

## for 和 forEach 哪个效率高

测试代码：

```ts
let arr = new Array(arrLength);

console.time('for');
for (let i = 0; i < arrLength; i++) {}
console.timeEnd('for');

console.time('forEach');
arr.forEach((a) => {});
console.timeEnd('forEach');
```

结果：
![结果](/blog/images/base/interview3.png)

### 分析

#### for

* 需要获取容器的大小，如果你计算大小比较耗时，那么for循环的效率会很低；(这个问题在例子中可以忽略)
* 为了 防止循环越界，每次循环都需要进行一次比较。

#### forEach

forEach 编译成字节码之后，使用的是迭代器实现的，所以本质上是通过迭代器遍历的。

```js
public static void testForEach(List list) {  
    for (Iterator iterator = list.iterator(); iterator.hasNext();) {  
        Object t = iterator.next();  
        Object obj = t;  
    }  
}
```

可以看到，只比迭代器遍历多了生成中间变量这一步，因此性能也略微下降了一些。

* 无需获取容器大小。
* 需要创建额外的迭代器变量。
* 遍历期间得到的是对象，没有索引位置信息，因此没办法将指定索引位置对象替换为新对象，也就是不能赋值。
