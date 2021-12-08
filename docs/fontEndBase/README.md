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

![对象当做函数参数图片](/images/fontEndBase/1.png)
