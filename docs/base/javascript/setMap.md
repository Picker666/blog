# Set/Map/WeakSet/WeakMap

::: tip
[本文代码例子链接](https://github.com/Picker666/blog-example/tree/main/src/component/Base/SetMap.tsx)
:::

## Set

### set定义及特征

* 在js中Set 对象允许存储任何类型的**唯一值**，无论是原始值或者是对象引用。
* 顶层数据结构不具备key—>value特征,内部会自动加index序列。
* 可以存储不同类型的任何数据。

::: tip 唯一性：
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

* size属性: 返回集合的元素个数。（类似数组的长度length）
* add(value)方法: 向集合中添加一个元素value。注意：如果向集合中添加一个已经存在的元素，不报错但是集合不会改变。
* delete(value)方法: 从集合中删除元素value。
* has(value)方法: 判断value是否在集合中，返回true或false.
* clear()方法: 清空集合

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
