---
sidebarDepth: 2
---

# JavaScript 基础

## 原始类型

::: tip
JavaScript 中原始类型有六种，原始类型既只保存原始值，是没有函数可以调用的。
:::

### 六种原始类型

- string
- number
- boolean
- null
- undefined
- symbol

::: warning 注意
为什么说原始类型没有函数可以调用，但`'1'.toString()`却又可以在浏览器中正确执行？
:::
因为`'1'.toString()`中的字符串`'1'`在这个时候会被封装成其对应的字符串对象，以上代码相当于`new String('1').toString()`，因为`new String('1')`创建的是一个对象，而这个对象里是存在`toString()`方法的。

### null 到底是什么类型

现在很多书籍把`null`解释成空对象，是一个对象类型。然而在早期`JavaScript`的版本中使用的是 32 位系统，考虑性能问题，使用低位存储变量的类型信息，`000`开头代表对象，而`null`就代表全零，所以将它错误的判断成`Object`，虽然后期内部判断代码已经改变，但`null`类型为`object`的判断却保留了下来，至于`null`具体是什么类型，属于仁者见仁智者见智，你说它是一个`bug`也好，说它是空对象，是对象类型也能理解的通。

### 对象类型

::: tip
在 JavaScript 中，除了原始类型，其他的都是对象类型，对象类型存储的是地址，而原始类型存储的是值。
:::

```js
var a = []
var b = a
a.push(1)
console.log(b) // 输出[1]
```

在以上代码中，创建了一个对象类型`a`(数组)，再把`a`的地址赋值给了变量`b`，最后改变`a`的值，打印`b`时，`b`的值也同步发生了改变，因为它们在内存中使用的是同一个地址，改变其中任何一变量的值，都会影响到其他变量。

### 对象当做函数参数

```js
function testPerson(person) {
  person.age = 52
  person = {
    name: '李四',
    age: 18,
  }
  return person
}
var p1 = {
  name: '张三',
  age: 23,
}
var p2 = testPerson(p1)
console.log(p1.age) // 输出52
console.log(p2.age) // 输出18
```

**代码分析**：

1. `testPerson`函数中，`person`传递的是对象`p1`的指针副本
2. 在函数内部，改变`person`的属性，会同步反映到对象`p1`上，`p1`对象中的`age`属性发生了改变，即值为 52
3. `testPerson`函数又返回了一个新的对象，这个对象此时和参数`person`没有任何关系，因为它分配了一个新的内存地址
4. 以上分析可以用如下图表示

![对象当做函数参数图片](/blog/images/fontEndBase/1.png)

---

## 类型判断

### typeof

::: tip
`typeof`能准确判断除`null`以外的原始类型的值，对于对象类型，除了函数会判断成`function`，其他对象类型一律返回`object`
:::

```js
typeof 1          // number
typeof '1'        // string
typeof true       // boolean
typeof undefined  // undefined
typeof Symbol()   // symbol
typeof []         // object
typeof {}         // object
typeof console.log// function
```

### instanceof

::: tip
`instanceof`通过原型链可以判断出对象的类型，但并不是百分百准确
:::
```js
function Person(name) {
  this.name = name;
}
var p1 = new Person();
console.log(p1 instanceof Person) // true
var str = new String('abc');
console.log(str instanceof String)// true
```

### Object.prototype.toString.call

```js
console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]
```

::: warning
无法区分自定义对象类型，自定义类型可以采用 `instanceof` 区分
:::

为什么这样就能区分呢？于是我去看了一下 `toString` 方法的用法：`toString` 方法返回反映这个对象的字符串。

```js
console.log("jerry".toString());//jerry
console.log((1).toString());//1
console.log([1,2].toString());//1,2
console.log(new Date().toString());//Wed Dec 21 2016 20:35:48 GMT+0800 (中国标准时间)
console.log(function(){}.toString());//function (){}
console.log(null.toString());//error
console.log(undefined.toString());//error
```

同样是检测对象obj调用 `toString` 方法（关于 `toString()` 方法的用法的可以参考 [toString的详解](/fontEndBase/toString.md) ，`obj.toString()` 的结果和 `Object.prototype.toString.call(obj)` 的结果不一样，这是为什么？

这是因为 `toString` 为 `Object` 的原型方法，而 `Array` 、`Function` 等类型作为 `Object` 的实例，都重写了 `toString` 方法。不同的对象类型调用 `toString` 方法时，根据原型链的知识，调用的是对应的重写之后的 `toString` 方法（ `Function` 类型返回内容为函数体的字符串，`Array` 类型返回元素组成的字符串.....），而不会去调用 `Object` 上原型 `toString` 方法（返回对象的具体类型），所以采用 `obj.toString()` 不能得到其对象类型，只能将 obj 转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用 `Object` 上原型 `toString` 方法。

我们可以验证一下，将数组的 `toString` 方法删除，看看会是什么结果：

```js
var arr=[1,2,3];
console.log(Array.prototype.hasOwnProperty("toString"));//true
console.log(arr.toString());//1,2,3
delete Array.prototype.toString;//delete操作符可以删除实例属性
console.log(Array.prototype.hasOwnProperty("toString"));//false
console.log(arr.toString());//"[object Array]"
```

删除了 `Array` 的 `toString` 方法后，同样再采用 `arr.toString()` 方法调用时，不再有屏蔽 `Object` 原型方法的实例方法，因此沿着原型链，`arr` 最后调用了 `Object` 的 `toString` 方法，返回了和 `Object.prototype.toString.call(arr)` 相同的结果。
