---
sidebarDepth: 4
---
# Set/Map/WeakSet/WeakMap

::: tip
[本文代码例子链接](https://github.com/Picker666/blog-example/tree/main/src/component/Base/SetMap.tsx)
:::

## Set （集合）

### set定义及特征

* 在js中Set 对象允许存储任何类型的**唯一值**，无论是原始值或者是对象引用。
* 顶层数据结构不具备key—>value特征,内部会自动加index序列。
* 可以存储不同类型的任何数据。
* 向Set对象加入值得时候，不会发生类型转换，所以，5和'5'是两个不同的值。
* Set 内部判断两个值是否不通，是哦那个的算法叫做： “same-value-zero equality”,类似与精确想等运算符 `===`，主要区别是: **NaN 等于自身，而全等认为NaN不等于自身**。

::: tip 唯一性：?
对于原始数据类型（boolean，number，string，null，undefined）如果存储相同值则只会保存一个，对于引用类型做“==”判断即引用地址完全相同则只会存一个。
:::

```ts
let set = new Set();
//a,b属于object 值完全相同
let a: { name: string; age: number } | string = {
  name: 'cc',
  age: 28,
};
let b = {
  name: 'cc',
  age: 28,
};

//d,f属于number类型 值完全相同
//c,f 属于Date类型，值相同
let c = new Date(),
  d = 0,
  f = 0,
  e = c,
  g = new Date();

set.add(a);
set.add(b);
set.add(c);
set.add(d);
set.add(e);
set.add(f);
set.add(g);

a = 'abc';
b = {
  name: 'cc',
  age: 30,
};
set.add(a);
set.add(b);

console.log(set);
```

![执行结果](/blog/images/base/setMap1.png)

### set方法

#### 操作方法

* size属性: 返回集合的元素个数。（类似数组的长度length）
* add(value)方法: 向集合中添加一个元素value。注意：如果向集合中添加一个已经存在的元素，不报错但是集合不会改变。
* delete(value)方法: 从集合中删除元素value。
* has(value)方法: 判断value是否在集合中，返回true或false.
* clear()方法: 清空集合

::: tip
Array.from() 方法 或者 结构运算符（...）可将 Set 结构转化为数组。
:::

```ts
const set = new Set([1,2,3,2]);
const arr = Array.from(set);
console.log(arr); // [1,2,3]

// or

const array = [...set];
console.log(array); // [1,2,3]
```

#### 遍历方法（遍历顺序为插入顺序）

* keys()：返回一个包含集合中所有**键**的迭代器；
* values()：返回一个包含集合中所有**值**的迭代器；
* entries()：返回一个包含Set对象中所有**键值对**迭代器
* 支持forEach(callbackFn, thisArg)，循环执行callbackFn, 如果提供了 thisArg ,回调中的this会是这个参数，没有返回值。
* Set 可默认遍历，默认迭代器生成函数是 values();
* Set 可以使用 map, filter 等方法。

```ts
let set = new Set([1, 2, 8]);
console.log(set.keys());
console.log(set.values());
console.log(set.entries());

set.forEach((value, key) => {
  console.log(key, ': ', value);
});

console.log(
  ' Set.prototype[Symbol.iterator] === Set.prototype.values;',
  Set.prototype[Symbol.iterator] === Set.prototype.values
);
```

![执行结果](/blog/images/base/setMap2.png)

### set应用场景

鉴于set存储值的不重复特性，经常被用来求数组去重，交集，并集，差集等操作。

#### 1、数组去重

```ts
const array = [1, 2, 3, 4, 4,1,2,3,2];
const mySet = new Set(array);
const newArray = [...mySet]; // [1, 2, 3, 4]
```

#### 2、求并集，交集,差集

```ts
//set求并集
let arrayA= [2,3,4,5,6],arrayB = [3,4,5,6,7,8];
let setAB = new Set([...arrayA,...arrayB]);
let newArrayAB = [...setAB];
console.log(newArrayAB); //[2,3,4,5,6,7,8]

//求交集
let arrayC= [2,3,4,5,6],arrayD = [3,4,5,6,7,8];
let setC = new Set(arrayC);
let setD = new Set(arrayD);
let newArrayC_D = arrayA.filter(x=>setD.has(x));
console.log(newArrayC_D); //[3,4,5,6]

//求差集
let newArrayD_C = arrayA.filter(x=>!setD.has(x));
let newArrayD_D = arrayB.filter(x=>!setC.has(x));
let newArrayCD = [...newArrayD_C,...newArrayD_D];
console.log(newArrayCD); //[2,7,8]
```

## WeakSet

WeakSet 对象允许将`弱引用对象`存储在一个集合中

### WeakSet 和 Set 的区别

* WeakSet 只能存储对象引用，不能存放值，而 Set 对象都可以；
* WeakSet 对象中储存的对象值都是被弱引的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或者属性引用这个对象值，则这个对象会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以， WeakSet 对象有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数有可能不一致，遍历结果之后，有的成员可能取不到（被垃圾回收了），WeakSet 对象是无法被遍历的（ES6 规定 WeakSet 不可遍历），也没办法拿到它包含的所有元素。

### 属性

constructor: 构造函数，任何一个具有Iterable 接口的对象，都可以作为参数

```ts
const arr = [
  [1, 2],
  [3, 4],
];
const weakSet = new WeakSet(arr);
console.log(weakSet);
```

![执行结果](/blog/images/base/setMap3.png)

### 方法

* add(value)：在 WeakSet 对象中添加一个元素 value;
* has(value)：判断 WeakSet 对象中是否 包含value;
* delete(value)：删除元素 value;
* clear()：清空所有元素，（该方法已废弃）

```ts
let ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(obj); // false

ws.delete(window); // true
ws.has(window); // false
```

## Map (字典)

