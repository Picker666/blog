# 数组的演变和性能

## 真正的数组

数组( Array )在内存中用一串`**连续**`的区域来存放一些值。注意「连续」一词，它至关重要。

![真正数组存储结构](/blog/images/base/javascript1.awebp)

## Javascript 的数组不是真正的数组

JavaScript 的数组通过哈希映射或者字典的方式来实现，所以不是连续的。

![javascript 数组存储结构](/blog/images/base/javascript2.awebp)

在 JavaScript 中，数组是哈希映射。它可以通过多种数据结构实现，其中一种是**链表**。所以，如果在 JavaScript 中声明var arr = new Array(4)；它会产生类似上图的结构。因此，如果你想在程序中某一处读取a[2]，它必须从1201位置开始溯寻a[2]的位置。

这就是 JavaScript 数组和真正的数组不同的地方。显然数学计算要比链表遍历花的时间少。遇到长点的数组，头疼！！！

## Javascript数组的进化

JavaScript 引擎已经在为 **同种数据类型** 的数组分配 **连续** 的存储空间了。保持数组的数据类型一致 是提高数组性能的关键，这样编译器 (JIT) 就能像 C 编译器一样通过计算读取数组了。

**但是，如果你想在同种类型的数组中插入不同类型的元素，JIT 会销毁整个数组然后用以前的办法重建。**

因此，如果你写的是同类型的数组，那么，JavaScript 的Array对象会维护一个真正的数组。

## 同类型数组 vs 不同类型数组 - 插入

```js
console.time('======array create');
let arr = new Array(10000000);
for (var i = 0; i < 10000000; i++) {
  arr[i] = i;
}
console.timeEnd('======array create');

console.time('======array1 create');
let arr1 = new Array(10000000);
arr1.push([{ a: 1 }]); // 往数组新增一个不同与number类型的 array类型的数据，使之变为不连续存储的数组
for (var i = 0; i < 10000000; i++) {
  arr1[i] = i;
}
console.timeEnd('======array1 create');

console.log(arr.length, arr1.length);
```

![javascript 数组存储结构](/blog/images/base/javascript3.png)

性能上有了巨大的变化：相差将近25倍。

## 同类型数组 vs 不同类型数组 - 读取

```js
let a;
console.time('======array create');
let arr = new Array(10000000);
for (var i = 0; i < 10000000; i++) {
  a = arr[i];
}
console.timeEnd('======array create');

let a1;
console.time('======array1 create');
let arr1 = new Array(10000000);
arr1.push([{ a: 1 }]);
for (var i = 0; i < 10000000; i++) {
  a1 = arr1[i];
}
console.timeEnd('======array1 create');

console.log(arr.length, arr1.length);
```

![javascript 数组存储结构](/blog/images/base/javascript4.png)

性能上相差将近9倍。

读取数组第一个和读取数组最后一个所使用的时间一样？
