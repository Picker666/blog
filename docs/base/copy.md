# 深拷贝和浅拷贝

## 一、赋值（Copy）

赋值是将某一数值或对象赋给某个变量的过程，分为下面 2 部分

- 基本数据类型：赋值，赋值之后两个变量互不影响
- 引用数据类型：赋`址`，两个变量具有相同的引用，指向同一个对象，相互之间有影响
  对基本类型进行赋值操作，两个变量互不影响。

::: warning
赋`址`: 对引用数据类型来说，实际上是对内存地址的赋值操作。
:::

```js
let a = 'Picker666'
let b = a
console.log(b) // Picker666

a = 'Picker'
console.log(a) // Picker
console.log(b) // Picker666
```

对引用类型进行赋`址`操作，两个变量指向同一个对象，改变变量 a 之后会影响变量 b，哪怕改变的只是对象 a 中的基本类型数据。

```js
let a = {
  name: 'Picker666',
  book: {
    title: "You Don't Know nothing",
    price: '45',
  },
}
let b = a
console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know nothing", price: "45"}
// }

a.name = 'Picker'
a.book.price = '55'
console.log(a)
// {
//  name: "Picker",
//  book: {title: "You Don't Know nothing", price: "55"}
// }

console.log(b)
// {
//  name: "Picker",
//  book: {title: "You Don't Know nothing", price: "55"}
// }
```

通常在开发中并不希望改变变量 a 之后会影响到变量 b，这时就需要用到浅拷贝和深拷贝。

## 二、浅拷贝（Shallow Copy）

### 1、什么是浅拷贝

创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。

![深浅拷贝对比的示意图](/images/base/2.webp)

上图中，SourceObject 是原对象，其中包含基本类型属性 field1 和引用类型属性 refObj。浅拷贝之后基本类型数据 field2 和 filed1 是不同属性，互不影响。但引用类型 refObj 仍然是同一个，改变之后会对另一个对象产生影响。

简单来说可以理解为浅拷贝只解决了第一层的问题，拷贝第一层的`基本类型值`，以及第一层的`引用类型地址`。

### 2、浅拷贝使用场景

- `Object.assign()`

`Object.assign()` 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

```js
let a = {
  name: 'Picker666',
  book: {
    title: "You Don't Know nothing",
    price: '45',
  },
}
let b = Object.assign({}, a)
console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know nothing", price: "45"}
// }

a.name = 'Picker'
a.book.price = '55'
console.log(a)
// {
//  name: "Picker",
//  book: {title: "You Don't Know nothing", price: "55"}
// }

console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know nothing", price: "55"}
// }
```

上面代码改变对象 a 之后，对象 b 的基本属性保持不变。但是当改变对象 a 中的对象 book 时，对象 b 相应的位置也发生了变化。

- 展开语法 `Spread`

```js
let a = {
  name: 'Picker666',
  book: {
    title: "You Don't Know JS",
    price: '45',
  },
}
let b = { ...a }
console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know JS", price: "45"}
// }

a.name = 'Picker'
a.book.price = '55'
console.log(a)
// {
//  name: "Picker",
//  book: {title: "You Don't Know JS", price: "55"}
// }

console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know JS", price: "55"}
// }
```

通过代码可以看出实际效果和 `Object.assign()` 是一样的。

- `Array.prototype.slice()`

`slice()` 方法返回一个新的数组对象，这一对象是一个由 `begin` 和 `end`（不包括`end`）决定的原数组的浅拷贝。原始数组不会被改变。

```js
let a = [0, '1', [2, 3]]
let b = a.slice(1)
console.log(b)
// ["1", [2, 3]]

a[1] = '99'
a[2][0] = 4
console.log(a)
// [0, "99", [4, 3]]

console.log(b)
//  ["1", [4, 3]]
```

可以看出，改变 `a[1]` 之后 `b[0]` 的值并没有发生变化，但改变 `a[2][0]` 之后，相应的 `b[1][0]` 的值也发生变化。说明 `slice()` 方法是`浅拷贝`，相应的还有 'concat' 等，在工作中面对复杂数组结构要额外注意。

## 三、深拷贝（Deep Copy）

[手写深拷贝](/newFunction/deepCopy.html)

### 1、什么是深拷贝

深拷贝会拷贝所有的属性，并拷贝属性指向的动态分配的内存。当对象和它所引用的对象一起拷贝时即发生深拷贝。深拷贝相比于浅拷贝速度较慢并且花销较大。拷贝前后两个对象互不影响。

![深拷贝的说明示意图](/images/base/3.webp)

### 2、深拷贝使用场景

`JSON.parse(JSON.stringify(object))`

```js
let a = {
  name: 'Picker666',
  book: {
    title: "You Don't Know JS",
    price: '45',
  },
}
let b = JSON.parse(JSON.stringify(a))
console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know JS", price: "45"}
// }

a.name = 'Picker'
a.book.price = '55'
console.log(a)
// {
//  name: "Picker",
//  book: {title: "You Don't Know JS", price: "55"}
// }

console.log(b)
// {
//  name: "Picker666",
//  book: {title: "You Don't Know JS", price: "45"}
// }
```

完全改变变量 a 之后对 b 没有任何影响，这就是深拷贝的魔力。

我们看下对数组深拷贝效果如何。

```js
let a = [0, '1', [2, 3]]
let b = JSON.parse(JSON.stringify(a.slice(1)))
console.log(b)
// ["1", [2, 3]]

a[1] = '99'
a[2][0] = 4
console.log(a)
// [0, "99", [4, 3]]

console.log(b)
//  ["1", [2, 3]]
```

对数组深拷贝之后，改变原数组不会影响到拷贝之后的数组。

但是该方法有以下几个问题。

1、会忽略 `undefined`

2、会忽略 `symbol`

3、不能序列化函数

4、不能解决循环引用的对象

5、不能正确处理 `new Date()`

6、不能处理正则

- `undefined`、`symbol` 和函数这三种情况，会直接忽略

```js
let obj = {
  name: 'Picker666',
  a: undefined,
  b: Symbol('Picker666'),
  c: function () {},
}
console.log(obj)
// {
//  name: "Picker666",
//  a: undefined,
//  b: Symbol(Picker666),
//  c: ƒ ()
// }

let b = JSON.parse(JSON.stringify(obj))
console.log(b)
// {name: "Picker666"}
```

- 循环引用情况下，会报错。

```js
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.a = obj.b
obj.b.c = obj.a

let b = JSON.parse(JSON.stringify(obj))
// Uncaught TypeError: Converting circular structure to JSON
```

- `new Date` 情况下，转换结果不正确。

```js
new Date()
// Mon Dec 24 2018 10:59:14 GMT+0800 (China Standard Time)

JSON.stringify(new Date())
// ""2018-12-24T02:59:25.776Z""

JSON.parse(JSON.stringify(new Date()))
// "2018-12-24T02:59:41.523Z"
```

解决方法转成字符串或者时间戳就好了。

```js
let date = new Date().valueOf()
// 1545620645915

JSON.stringify(date)
// "1545620673267"

JSON.parse(JSON.stringify(date))
// 1545620658688
```

- 正则情况下，

```js
let obj = {
  name: 'Picker666',
  a: /'123'/,
}
console.log(obj)
// {name: "Picker666", a: /'123'/}

let b = JSON.parse(JSON.stringify(obj))
console.log(b)
// {name: "Picker666", a: {}}
```

PS：为什么会存在这些问题可以学习一下 JSON。

除了上面介绍的深拷贝方法，常用的还有 `jQuery.extend()` 和 `lodash.cloneDeep()`！

## 四、总结

| ---    | 和源数据是否指向同一对象 |    第一层数据为基本数据    |     源数据中包含子对象     |
| ------ | :----------------------: | :------------------------: | :------------------------: |
| 赋值   |            是            |   改变会使原数据一同改变   |   改变会使原数据一同改变   |
| 浅拷贝 |            否            | 改变`不`会使原数据一同改变 |   改变会使原数据一同改变   |
| 深拷贝 |            否            | 改变`不`会使原数据一同改变 | 改变`不`会使原数据一同改变 |
