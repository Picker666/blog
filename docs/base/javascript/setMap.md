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
* Set 内部判断两个值是否不通，是通过算法叫做： “same-value-zero equality”,类似与精确想等运算符 `===`，主要区别是: **NaN 等于自身，而全等认为NaN不等于自身**。

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

* `size` 属性: 返回集合的元素个数。（类似数组的长度length）
* `add(value)` 方法: 向集合中添加一个元素value。注意：如果向集合中添加一个已经存在的元素，不报错但是集合不会改变。
* `delete(value)` 方法: 从集合中删除元素value。
* `has(value)` 方法: 判断value是否在集合中，返回true或false.
* `clear()` 方法: 清空集合

::: tip
`Array.from()` 方法 或者 结构运算符（`...`）可将 Set 结构转化为数组。
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

* `keys()`：返回一个包含集合中所有**键**的迭代器；
* `values()`：返回一个包含集合中所有**值**的迭代器；
* `entries()`：返回一个包含Set对象中所有**键值对**迭代器
* 支持`forEach(callbackFn, thisArg)`，循环执行callbackFn, 如果提供了 thisArg ,回调中的this会是这个参数，没有返回值。
* Set 可默认遍历，默认迭代器生成函数是 `values()`;
* Set 可以使用 `map`, `filter` 等方法。

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

* WeakSet 只能存储`对象引用`，`不能存放值`，而 Set 对象都可以；
* WeakSet 对象中储存的对象值都是被弱引的，即垃圾回收机制不考虑 WeakSet 对该对象的应用，如果没有其他的变量或者属性引用这个对象值，则这个对象会被垃圾回收掉（不考虑该对象还存在于 WeakSet 中），所以， WeakSet 对象有多少个成员元素，取决于垃圾回收机制有没有运行，运行前后成员个数有可能不一致，遍历结果之后，有的成员可能取不到（被垃圾回收了）;
* WeakSet 对象是`无法被遍历`的（ES6 规定 WeakSet 不可遍历），也没办法拿到它包含的所有元素。

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

* `add(value)`：在 WeakSet 对象中添加一个元素 value;
* `has(value)`：判断 WeakSet 对象中是否 包含value;
* `delete(value)`：删除元素 value;
* `clear()`：清空所有元素，（该方法已废弃）

:::warning
没有 `size` 属性！
:::

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

### Set 和 Map 的区别

* 共同点：集合、字典 可以储存不重复的值
* 不同点：集合 是以 [value, value]的形式储存元素，字典 是以 [key, value] 的形式储存

```ts
const m = new Map()
const o = {p: 'picker'}
m.set(o, 'content');
m.get(o); // content

m.has(o); // true
m.delete(o); // true
m.has(o); // false
```

### 与Object的区别

* 一个 Object 的键只能是字符串或者 Symbols，但一个 Map 的键可以是`任意值`。
* Map 中的键值是`有序`的（FIFO 原则），而添加到对象中的键则不是。
* Map 的键值对个数可以从 `size` 属性获取，而 Object 的键值对个数只能手动计算。
* Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突，而map健不可重复，如果`键名冲突则会覆盖`对应的值。

* 初始化与使用 
* Key order
* Map 可以 forEach 迭代，Object不行
* 序列化和解析， Map JSON.stringify 之后的结果是 '{}'。
* Map 对象在涉及频繁添加和删除键值对的场景中表现更好，而普通对象没有优化。

[参考](https://blog.csdn.net/snsHL9db69ccu1aIKl9r/article/details/124010243)

```ts
let map = new Map();
    let s = {
        name:'cc',
        job:'programmer'
    }
    let m ={
        dd:'cdcdcd',
        do:function(str){
            console.log(str)
        }
    }
    map.set(s,m);
    map.set(m,s);
    map.set(0,s);
    map.set(0,m);
    console.log(map)
```

![执行结果](/blog/images/base/setMap4.png)

### Map 的属性及方法

#### 属性

* constructor：构造函数
* size：返回字典中所包含的元素个数

```ts
const map = new Map([
  ['name', 'An'],
  ['des', 'JS']
]);

map.size // 2
```

* 任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数，例如：
如果读取一个未知的键，则返回undefined。

::: warning 注意
只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
:::

```ts
const map = new Map();

map.set(['a'], 555);
const map1 = map.get(['a']); // undefined

// 上面代码的set和get方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此get方法无法读取该键，返回undefined。

let arr = ['aa'];
map.set(arr, 666);
const map2 = map.get(arr); // 666

console.log(map1, '==============', map2);
```

::: tip
由上可知，Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
:::

* 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键

  * `0`和`-0`就是`一个键`;
  * 布尔值true和字符串true则是两个不同的键;
  * undefined和null也是两个不同的键;
  * 虽然`NaN`不严格相等于自身，但 Map 将其视为`同一个键`

```ts
let map = new Map();
 
map.set(-0, 123);
map.get(+0) // 123
 
map.set(true, 1);
map.set('true', 2);
map.get(true) // 1
 
map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3
 
map.set(NaN, 123);
map.get(NaN) // 123
```

#### 操作方法

* `set(key, value)`：向字典中添加新元素；
* `get(key)`：通过键查找特定的数值并返回；
* `has(key)`：判断字典中是否存在键key；
* `delete(key)`：通过键 key 从字典中移除对应的数据；
* `clear()`：将这个字典中的所有元素删除。

```ts
const map = new Map([
            ['name', 'An'],
            ['des', 'JS']
        ]);
console.log(map.entries())// MapIterator {"name" => "An", "des" => "JS"}
console.log(map.keys()) // MapIterator {"name", "des"}
```

Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。

```ts
map[Symbol.iterator] === map.entries
```

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（`...`）。

对于 forEach ，看一个例子

```ts
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

let map = new Map([
    ['name', 'An'],
    ['des', 'JS']
])
map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
// Key: name, Value: An
// Key: des, Value: JS
```

在这个例子中， forEach 方法的回调函数的 this，就指向 reporter

### 与其他数据结构的相互转换

#### Map 转 Array

```ts
const map = new Map([[1, 1], [2, 2], [3, 3]])
console.log([...map])	// [[1, 1], [2, 2], [3, 3]]
```

#### Array 转 Map

```ts
const map = new Map([[1, 1], [2, 2], [3, 3]])
console.log(map)	// Map {1 => 1, 2 => 2, 3 => 3}
```

#### Map 转 Object

因为 Object 的键名都为字符串，而Map 的键名为对象，所以转换的时候会把非字符串键名转换为字符串键名。

```ts
function mapToObj(map) {
    let obj = Object.create(null)
    for (let [key, value] of map) {
        obj[key] = value
    }
    return obj
}
const map = new Map().set('name', 'An').set('des', 'JS')
mapToObj(map)  // {name: "An", des: "JS"}
```

#### Object 转 Map

```ts
function objToMap(obj) {
    let map = new Map()
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key])
    }
    return map
}

objToMap({'name': 'An', 'des': 'JS'}) // Map {"name" => "An", "des" => "JS"}
```

#### Map 转 JSON

```ts
function mapToJson(map) {
    return JSON.stringify([...map])
}

let map = new Map().set('name', 'An').set('des', 'JS')
mapToJson(map)	// [["name","An"],["des","JS"]]
```

#### JSON 转 Map

```ts
function jsonToStrMap(jsonStr) {
  return objToMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"name": "An", "des": "JS"}') // Map {"name" => "An", "des" => "JS"}
```

## WeakMap

### WeakMap与Map的区别

WeakMap 对象是一组键值对的集合，其中的键是`弱引用`对象，而值可以是任意。

::: warning 注意
WeakMap 弱引用的只是`键名`，而不是键值。键值依然是正常引用。
:::

WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 `key` 是`不可枚举`的。

### 用WeakMap来实现私有属性

```ts
let Person = (function () {
  let privateData = new WeakMap();

  function Person(name, age) {
    privateData.set(this, { name: name, age: age });
  }

  Person.prototype.getName = function () {
    return privateData.get(this).name;
  };
  Person.prototype.getAge = function () {
    return privateData.get(this).age;
  };
  Person.prototype.setName = function (name) {
    let obj = privateData.get(this);
    obj.name = name;
  };
  Person.prototype.setAge = function (age) {
    let obj = privateData.get(this);
    obj.age = age;
  };

  return Person;
})();

let ssf = new Person('picker', 19);
console.log(ssf.getName());
console.log(ssf.getAge());
ssf.setName('ren');
ssf.setAge(18);
console.log(ssf.getName());
console.log(ssf.getAge());
```

![执行结果](/blog/images/base/setMap5.png)
