# ECMAScript

## ECMAScript 2015（ES6）

### 1、类（Class）

### 2、箭头函数（Arrow function）

### 3、模板字符串（Template string）

### 4、解构赋值（Destructuring assignment）

### 5、模块化（Module）

### 6、扩展操作符（Spread operator）

:::tip 注意
扩展操作符只能用于可迭代对象。如数组，（对象不可以哦）
:::

### 7、对象属性简写（Object attribute shorthand）

```js
let cat = 'Miaow'
let dog = 'Woof'
let bird = 'Peet peet'

// ES5
var someObject = {
  cat: cat,
  dog: dog,
  bird: bird
}

// ES6
let someObject = {
  cat,
  dog,
  bird
}
```

### 8、Promise

### 9、for…of

for...of语句在可迭代对象（包括 Array，Map，Set，String，TypedArray，arguments 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句。

### 10、Symbol

### 11、迭代器（Iterator）/ 生成器（Generator）

### 12、Set/WeakSet

WeakSet 结构与 Set 类似，但区别有以下两点：

* WeakSet 对象中只能存放对象引用, 不能存放值, 而 Set 对象都可以。
* WeakSet 对象中存储的对象值都是被弱引用的, 如果没有其他的变量或属性引用这个对象值, 则这个对象值会被当成垃圾回收掉. 正因为这样, WeakSet 对象是**无法被枚举的**, 没有办法拿到它包含的所有元素。

### 13、Map/WeakMap

WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。

### 14、Proxy/Reflect

Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

:::tip 注意
如果对象带有configurable: false 跟writable: false 属性，则代理失效。
:::

### 15、Regex对象的扩展

* i 修饰符 - 不区分大小写
* y修饰符 - 在lastIndex位置继续匹配
  
```js
let s='bbb_bb_b';
  let a1=/b+/g;
  let a2=/b+/y;
  
  console.log('one',a1.exec(s),a2.exec(s));
  //one 
  //["bbb", index: 0, input: "bbb_bb_b"] 
  //["bbb", index: 0, input: "bbb_bb_b"]
  console.log('two',a1.exec(s),a2.exec(s));
  //two
  //["bb", index: 4, input: "bbb_bb_b"] 
  //null
```

* String.prototype.flags - 查看RegExp构造函数的修饰符
* unicode模式

```js
var s = ' '
/^.$/.test(s) // false
/^.$/u.test(s) // true
```

* u转义 ?

```js
// u转义
/\,/ // /\,/
/\,/u // 报错 没有u修饰符时，逗号前面的反斜杠是无效的，加了u修饰符就报错。
```

* 引用 ?

```js
const RE_TWICE = /^(?<word>[a-z]+)!\k<word>$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false

const RE_TWICE = /^(?<word>[a-z]+)!\1$/;
RE_TWICE.test('abc!abc') // true
RE_TWICE.test('abc!ab') // false
```

* 字符串方法的实现改为调用RegExp方法
  * String.prototype.match 调用 RegExp.prototype[Symbol.match]
  * String.prototype.replace 调用 RegExp.prototype[Symbol.replace]
  * String.prototype.search 调用 RegExp.prototype[Symbol.search]
  * String.prototype.split 调用 RegExp.prototype[Symbol.split]

### 16、正则新增属性

* RegExp.prototype.sticky 表示是否有y修饰符
* RegExp.prototype.flags获取修饰符

### 17、Math对象的扩展

* 二进制表示法 : 0b或0B开头表示二进制(0bXX或0BXX)
* 二进制表示法 : 0b或0B开头表示二进制(0bXX或0BXX)
* 八进制表示法 : 0o或0O开头表示二进制(0oXX或0OXX)
* Number.EPSILON : 数值最小精度
* Number.MIN_SAFE_INTEGER : 最小安全数值(-2^53)
* Number.MAX_SAFE_INTEGER : 最大安全数值(2^53)
* Number.parseInt() : 返回转换值的整数部分
* Number.parseFloat() : 返回转换值的浮点数部分
* Number.isFinite() : 是否为有限数值
* Number.isNaN() : 是否为NaN
* Number.isInteger() : 是否为整数
* Number.isSafeInteger() : 是否在数值安全范围内
* Math.trunc() : 返回数值整数部分
* Math.sign() : 返回数值类型(正数1、负数-1、零0)
* Math.cbrt() : 返回数值立方根
* Math.clz32() : 返回数值的32位无符号整数形式
* Math.imul() : 返回两个数值相乘
* Math.fround() : 返回数值的32位单精度浮点数形式
* Math.hypot() : 返回所有数值平方和的平方根
* Math.expm1() : 返回e^n - 1
* Math.log1p() : 返回1 + n的自然对数(Math.log(1 + n))
* Math.log10() : 返回以10为底的n的对数
* Math.log2() : 返回以2为底的n的对数
* Math.sinh() : 返回n的双曲正弦
* Math.cosh() : 返回n的双曲余弦
* Math.tanh() : 返回n的双曲正切
* Math.asinh() : 返回n的反双曲正弦
* Math.acosh() : 返回n的反双曲余弦
* Math.atanh() : 返回n的反双曲正切

### 18、Array对象的扩展

* Array.prototype.from()

转换具有Iterator接口的数据结构为真正数组，返回新数组。

* Array.prototype.of()

转换一组值为真正数组，返回新数组。

* Array.prototype.copyWithin()?
* Array.prototype.find()
* Array.prototype.findIndex()
* Array.prototype.fill()
* Array.prototype.keys()
* Array.prototype.values()
* Array.prototype.entries()

## ECMAScript 2016(ES7)

### 1、Array.prototype.includes()

### 2、幂运算符**

### 3、模板字符串（Template string） 新规则

自ES7起，带标签的模版字面量遵守以下转义序列的规则：

* Unicode字符以"\u"开头，例如\u00A9
* Unicode码位用"\u{}"表示，例如\u{2F804}
* 十六进制以"\x"开头，例如\xA9
* 八进制以""和数字开头，例如\251

## ECMAScript 2017(ES8)

### 1、async/await

### 2、Object.values()

### 3、Object.entries()

### 4、padStart()

### 5、padEnd()

### 6、ShareArrayBuffer（因安全问题，暂时在Chrome跟FireFox中被禁用）

### 7、Object.getOwnPropertyDescriptors()

## ECMAScript 2018(ES9)

### 1、for await…of

for await...of 语句会在异步或者同步可迭代对象上创建一个迭代循环，包括 String，Array，Array-like 对象（比如arguments 或者NodeList)，TypedArray，Map， Set和自定义的异步或者同步可迭代对象。其会调用自定义迭代钩子，并为每个不同属性的值执行语句。

```js
async function* asyncGenerator() {
      var i = 0
      while (i < 3) {
            yield i++
      }
}

(async function() {
      for await (num of asyncGenerator()) {
            console.log(num)
      }
})()
// 0
// 1
// 2
```

### 2、模板字符串（Template string）

ES9开始，模板字符串允许嵌套支持常见转义序列，移除对ECMAScript在带标签的模版字符串中转义序列的语法限制。

### 4、正则表达式 Unicode 转义

### 5、正则表达式 s/dotAll 模式

### 6、正则表达式命名捕获组

### 7、对象扩展操作符

### 8、Promise.prototype.finally()

## ECMAScript 2019(ES10)

### 1、Array.prototype.flat() / flatMap()

### 2、Object.fromEntries()

### 3、Symbol.prototype.description

### 4、String.prototype.matchAll

### 5、Function.prototype.toString() 返回注释与空格

### 6、try-catch

```js
    // ES10之前
try {
      // tryCode
} catch (err) {
      // catchCode
}

// ES10
try {
      console.log('Foobar')
} catch {
      console.error('Bar')
}
```

### 7、BigInt

### 8、String.trimStart 和 String.trimEnd

### 9、私有元素与方法

```js
// web component 写法
class Counter extends HTMLElement {
      get x() { 
          	return this.xValue
      }
      set x(value) {
              this.xValue = value
              window.requestAnimationFrame(this.render.bind(this))
      }

      clicked() {
            this.x++
      }

      constructor() {
            super()
            this.onclick = this.clicked.bind(this)
            this.xValue = 0
      }

      connectedCallback() { 
          	this.render()
      }

      render() {
            this.textContent = this.x.toString()
      }
}
window.customElements.define('num-counter', Counter)
```

```js
// es10
class Counter extends HTMLElement {
      #xValue = 0

      get #x() { 
          return #xValue
      }
      set #x(value) {
            this.#xValue = value
            window.requestAnimationFrame(this.#render.bind(this))
      }

      #clicked() {
            this.#x++
      }

      constructor() {
            super();
            this.onclick = this.#clicked.bind(this)
      }

      connectedCallback() { 
          	this.#render()
      }

      #render() {
            this.textContent = this.#x.toString()
      }
}
window.customElements.define('num-counter', Counter)
```

[ES6-ES10](https://mp.weixin.qq.com/s/JuWoahhnEunkOTi4qNtWQg)

## ES2020

### 1、可选链操作符（Optional Chaining） ?.

### 2、空位合并操作符（Nullish coalescing Operator）??

### 3、Promise.allSettled

### 4、String.prototype.matchAll ？

### 5、Dynamic import

静态的import 语句用于导入由另一个模块导出的绑定。无论是否声明了 严格模式，导入的模块都运行在严格模式下。在浏览器中，import 语句只能在声明了 type="module" 的 script 的标签中使用。

但是在ES10之后，我们有动态 import()，它不需要依赖 type="module" 的script标签。

### 6、BigInt ？

### 7、globalThis

```js
// worker.js
globalThis === self
// node.js
globalThis === global
// browser.js
globalThis === window
```

[ES2020](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247484943&idx=1&sn=14e3307fce425a38e3b3b1932f3c93ca&chksm=c0668799f7110e8faec89cc4bc2642c142587bfe732e906f7f7e7ef722899aaa9f7dd4a70307&cur_album_id=1340070874191446016&scene=189#wechat_redirect)

## ES2021

### 1、String.prototype.replaceAll

有了这个 API，替换字符不用写正则了

### 2、Promise.any()

返回第一个 fullfilled 的 promise ，若全部 reject，则返回一个带有失败原因的 AggregateError。

### 3、新增逻辑赋值操作符： ??=、&&=、 ||=

### 4、WeakRefs

WeakRef是一个 Class，一个WeakRef对象可以让你拿到一个对象的弱引用。这样，就可以不用阻止垃圾回收这个对象了。 可以使用其构造函数来创建一个WeakRef对象。

```js
// anObject 不会因为 ref 引用了这个对象，而不会被垃圾回收
let ref = new WeakRef(anObject);
```

我们可以用WeakRef.prototype.deref()来取到anObject的值。但是，在被引用对象被垃圾回收之后，这个函数就会返回undefined。

```js
// 如果 someObj 被垃圾回收了，则 obj 就会是 undefined
let obj = ref.deref();
```

### 5、下划线 (_) 分隔符

使用 _ 分隔数字字面量以方便阅读

```js
let x = 2_3333_3333
// x 的值等同于 233333333，只是这样可读性更强，不用一位一位数了
```

### 6、Intl.ListFormat

用来处理和多语言相关的对象格式化操作

```js
const list = ['Apple', 'Orange', 'Banana']
new Intl.ListFormat('en-GB', { style: 'long', type: 'conjunction' }).format(list);
// "Apple, Orange and Banana"
new Intl.ListFormat('zh-cn', { style: 'short', type: 'conjunction' }).format(list);
// 会根据语言来返回相应的格式化操作
// "Apple、Orange和Banana"
```

### 7、Intl.DateTimeFormat

API 中的 dateStyle 和 timeStyle 的配置项：用来处理多语言下的时间日期格式化的函数

[ES2021](https://zhuanlan.zhihu.com/p/426900928)

## ECMAScript 2022

### 1、class 静态块

```js
class A {
  static x = 3;
  static y;
  static z;

  static {
    // this 为 class 自身
    try {
      const obj = foo(this.x);

      this.y = obj.y;
      this.z = obj.z;
    }
    catch {
      this.y = 0;
      this.z = 0;
    }
  }
}
```

### 2、in 运算符

在类的外部直接访问私有属性（无论是否存在）都会报错，但是访问不存在的公共属性不会报错。而在类内部直接访问存在的私有属性不会报错，访问不存在的私有属性会报错。

可以通过该特性来判断某个对象是否为类的实例。

```js
class ClassWithPrivateSlot {
  #privateSlot = true
  static hasPrivateSlot(obj) {
    return #privateSlot in obj
  }
}
const obj1 = new ClassWithPrivateSlot()
assert.equal(ClassWithPrivateSlot.hasPrivateSlot(obj1), true)

const obj2 = {}
assert.equal(ClassWithPrivateSlot.hasPrivateSlot(obj2), false)
```

### 3、模块中的顶层 await

```js
const res = await fetch('https://www.baidu.com')
const html = await res.text()
console.log(html)
```

### 4、.at()

```js
const arr = ['a', 'b', 'c']

arr.at(0)
// 'a'

arr.at(-1)
// 'c'
```

以下“可索引”类型具有方法.at()：

* string
* Array
* 所有类型化数组类：Uint8Array 等

### 5、Object.hasOwn(obj, propKey)

Object.hasOwn(obj, propKey)提供了一种安全的方法来检查对象 obj 是否具有自己的（非继承的）属性和 key propKey：

### 6、正则表达式匹配索引

给正则表达式添加修饰符 d，会生成匹配对象，记录每个组捕获的开始和结束索引：

### 7、Error 对象的 cause 属性

```js
const actual = new Error('an error!', { cause: 'Error cause' })

actual.cause // 'Error cause'

// -------------------------------------------

try {
  foo()
} catch (err) {
  throw new Error('foo failed!', { cause: err })
}
```