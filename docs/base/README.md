---
sidebarDepth: 2
---

# 数据类型

## js中的8种数据类型

目前阶段JavaScript中的数据类型，一共8种，主要分类两大类型：`基本类型` 和 `引用类型`.

### 两大类型的区别

基本类型又叫做简单类型或者值类型，引用类型又叫做复杂类型；

::: tip
基本类型（按值访问）：在存储时变量中存储的是值本身，因此也叫做值类型；

引用类型（按引用访问）：在存储时变量中存储的仅仅是地址（引用），因此叫做引用数据类型。
:::

栈 `(stack)` ：用来保存简单的数据字段

堆 `(heap)` ：用来保存栈中简单数据字段对指针的**引用**

**区别：**

::: tip

* 栈（操作系统）：
  由操作系统自动分配释放存放函数的参数值、局部变量的值等，其操作方式类似于数据结构中的栈；

  简单数据类型直接存放到栈里面。

* 堆（操作系统）：
  存储复杂类型，一般由程序员分配释放，若程序员不释放，由垃圾回收机制回收；

  复杂数据类型引用放在栈里面，实际数据存放到堆里面。
:::

为啥会导致上述区别。

::: tip

* 基本类型的数据简单，所占用空间比较小，内存由系统自动分配；

* 引用类型数据比较复杂，复杂程度是动态的，计算机为了较少反复的创建和回收引用类型数据所带来的损耗， 就先为其开辟另外一部分空间——即堆内存，以便于这些占用空间较大的数据重复利用；

* 堆内存中的数据不会随着方法的结束立即销毁，有可能该对象会被其它方法所引用， 直到系统的垃圾回收机制检索到该对象没有被任何方法所引用的时候才会对其进行回收。

:::

举个小栗子:

```js
// 基本数据类型
let  a = 1;
let  b = a;
b = 2;
console.log(a, b) // 1， 2
```

```js
let  obj1 = {a: 1, b: 2};
let  obj2 = obj1;
obj2.a = 20;
console.log(obj1.a, obj2.a)
```

### 两大类型的具体细分

![两大类型细分图](/blog/images/base/4.webp)

::: tip
基本数据类型的数据既只保存原始值，是没有函数可以调用的。
:::

为什么说原始类型没有函数可以调用，但`'1'.toString()`却又可以在浏览器中正确执行？

::: tip

因为`'1'.toString()`中的字符串`'1'`在这个时候会被封装成其对应的字符串对象，以上代码相当于`new String('1').toString()`，因为`new String('1')`创建的是一个对象，而这个对象里是存在`toString()`方法的。

详见 **[toString 详解](/base/toString)**
<a name="nullInstruction"></a>

:::

#### 1、null

现在很多书籍把`null`解释成空对象，是一个对象类型。然而在早期`JavaScript`的版本中使用的是 32 位系统，考虑性能问题，使用低位存储变量的类型信息，`000`开头代表对象，而`null`就代表全零，所以将它错误的判断成`Object`，虽然后期内部判断代码已经改变，但`null`类型为`object`的判断却保留了下来，至于`null`具体是什么类型，属于仁者见仁智者见智，你说它是一个`bug`也好，说它是空对象，是对象类型也能理解的通。

来个官方文档贴图：
![关于 `null` 的官方解释截图](/blog/images/base/5.webp)

#### 2、Symbol

Symbol 本质上是一种唯一标识符，可用作对象的唯一属性名，这样其他人就不会改写或覆盖你设置的属性值。声明方法；

```js
let id = Symbol("id");
```

`Symbol` 数据类型的特点是唯一性，即使是用同一个变量生成的值也不相等。

```js
let id1 = Symbol('id');
let id2 = Symbol('id');
console.log(id1 == id2);  //false
```

`Symbol` 数据类型的另一特点是隐藏性，`for···in` 和 `object.keys()` 不能访问:

```js
let id = Symbol("id");
 let obj = {
  [id]:'symbol'
 };
 for(let option in obj){
     console.log(obj[option]); //空
 }
 ```

但是也有能够访问的方法：`Object.getOwnPropertySymbols`， 该方法会返回一个数组，成员是当前对象的所有用作属性名的 `Symbol` 值。

```js
let id = Symbol("id");
let obj = {
 [id]:'symbol'
};
let array = Object.getOwnPropertySymbols(obj);
console.log(array); //[Symbol(id)]
console.log(obj[array[0]]);  //'symbol'
```

虽然这样保证了 `Symbol` 的唯一性，但我们不排除希望能够多次使用同一个 `symbol` 值的情况。为此，官方提供了全局注册并登记的方法：`Symbol.for()`

```js
let name1 = Symbol.for('name'); //检测到未创建后新建
let name2 = Symbol.for('name'); //检测到已创建后返回
console.log(name1 === name2); // true
```

通过这种方法就可以通过参数值获取到全局的 `symbol` 对象了，反之，能不能通过 `symbol` 对象获取到参数值呢？是可以的 ，通过 `Symbol.keyFor()`

```js
let name1 = Symbol.for('name');
let name2 = Symbol.for('name');
console.log(Symbol.keyFor(name1));  // 'name'
console.log(Symbol.keyFor(name2)); // 'name'
```

最后，提醒大家一点，在创建symbol类型数据 时的参数只是作为标识使用，所以 Symbol() 也是可以的。

#### 3、BigInt

* **它是什么**

`BigInt` 数据类型提供了一种方法来表示大于 `2^53-1` 的整数。`BigInt` 可以表示**任意大的整数**。

* **解决了什么问题**

`Number` 类型只能安全的支持 `-9007199254740991(-(2^53-1))` 和 `9007199254740991(2^53-1)` 之间的整数，任何超过这个范围的数值都会失去精度；而BigInt可以解决这个问题

```js
console.log(9007199254740999) //9007199254741000
console.log(9007199254740993===9007199254740992) //true
```

如上，当数值超过 `Number` 数据类型支持的安全范围值时，将会被四舍五入，从而导致精度缺失的问题

* **如何使用BigInt**

方式一：在整数的末尾追加**n**

```js
console.log(9007199254740999n); //9007199254740999
```

方式二：调用 `BigInt()` 构造函数

```js
let bigInt = BigInt("9007199254740999"); //传递给BigInt()的参数将自动转换为BigInt
console.log(bigInt); //9007199254740999n   
```

* **注意事项**

1）、`BigInt` 除了不能使用一元加号运算符外，其他的运算符都可以使用

```js
console.log(+1n); // Uncaught TypeError: Cannot convert a BigInt value to a number
console.log(-1n); //ok
```

2）、`BigInt` 和 `Number` 之间不能进行混合操作

```js
console.log(1n+5)
```

如果希望使用 `BigInt` 和 `Number` 执行算术计算，首先需要确定应该在哪个类型中执行该操作。为此，只需通过调用 `Number()` 或 `BigInt()` 来转换操作数：

```js
BigInt(10) + 10n;    // → 20n
// 或者（在同一环境中操作）
10 + Number(10n);    // → 20
```

* **总结：**

1）、`BigInt` 数据类型提供了一种方法来表示大于 `2^53-1` 或者小于`-2^53-1` 的整数，`BigInt` 可以表示任意大的整数；

2）、不能使用 `Number` 和 `BigInt` 操作数的混合执行算术运算，需要通过显式转换其中的一种类型，使得两者在同一环境中操作；

3）、此外，出于兼容性原因，不允许在 `BigInt` 上使用一元加号`（+）`运算符。

#### 4 Object(万物皆对象)

Js中常用的引用类型有：`Object`，`Array` ，`Function`， `Date`， `RegExp`等

* **Object类型**

带有属性和方法的特殊数据类型；

创建 `Object` 实例的方式有两种。第一种是使用 `new` 操作符后跟 `Object` 构造函数，例如;

```js
let person = new Object();
person.name = "Nicholas";
person.age = 29;
console.log(person instanceof Object); // true
```

另一种方式是使用对象字面量表示法。例如：

```js
let person = {
  name : "Nicholas",
  age ； 29
}
console.log(person instanceof Object); // true
```

::: warning
注意：在通过对象字面量定义对象时，实际上不会调用Object构造函数。
:::

* **Array类型**

是使用单独的变量名来存储一系列的值；
创建数组的基本方式有两种。第一种是使用 `Array` 构造函数，例如：

```js
let colors = new Array();
console.log(colors instanceof Array);  // true
```

第二种基本方式是使用数组字面量表示法。数组字面量由一对包含数组项的方括号表示，多个数组项之间以逗号隔开，例如：

```js
let colors = ["red","blue","green"];
console.log(colors instanceof Array);  // true
```

* **Function类型**

函数类型在JavaScript中也是对象

函数实际上是对象，函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。每个函数都是Function类型的实例，而且都与其他引用类型一样具有属性和方法。函数通常是使用函数声明语法定义的：（函数声明提升）

```js
function sum (sum1,sum2) {
  return sum1 + sum2;
}
console.log(sum instanceof Function); // true
```

还有一种方式，使用函数表达式定义函数：

```js
let sum = function(sum1,sum2) {
  return sum1 +sum2 ;
};
console.log(sum instanceof Function); // true
```

* **其他**

juejin.cn/post/691441

## 数据类型的4种判断方法

### typeof

  ::: tip
`typeof`能准确判断除`null`以外的原始类型的值，对于对象类型，除了函数会判断成`function`，其他对象类型一律返回`object`
:::

```js
typeof 1                        // number
typeof '1'                      // string
typeof true                     // boolean
typeof null                     // object---有点儿特殊，见下
typeof undefined                // undefined
typeof Symbol()                 // symbol
typeof 9007199254740999n        // bigint
typeof BigInt(9007199254740999) // bigint

typeof []                       // object
typeof {}                       // object
typeof console.log              // function
```

关于基础类型 `null`，使用 `typeof` 返回的是 `object` 的说明见：上文<a href="#nullInstruction"> null </a>

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

// 基本类型
console.log('1' instanceof String) // false
console.log(1 instanceof Number)  // false
console.log(true instanceof Boolean)  // false

// console.log(undefined instanceof undefined)
      // Uncaught TypeError: Right-hand side of 'instanceof' is not an object
// console.log(null instanceof null)
      // Uncaught TypeError: Right-hand side of 'instanceof' is not an object

console.log(typeof Symbol('id') instanceof Symbol)  // false
console.log(typeof 9007199254740999n instanceof BigInt)  // false
console.log(typeof BigInt(9007199254740999) instanceof BigInt)  // false

// 引用类型
console.log([] instanceof Array) 
console.log(function () {} instanceof Function) 
console.log({} instanceof Object) 
```

小结

不难看出，`instanceof` 可以用于引用类型的检测，但对于基本类型是不生效的;

另外，**不能**用于检测 `null` 和 `undefined`， 会抛错。

### constructor

```js
// 基本类型
console.log('1'.constructor === String) // true
console.log((1).constructor === Number) // true
console.log(true.constructor === Boolean) // true
// console.log(undefined.constructor === Boolean)
      // Uncaught TypeError: Cannot read properties of undefined (reading                 'constructor')
// console.log(null.constructor === Boolean)
      // Uncaught TypeError: Cannot read properties of undefined (reading                 'constructor')
console.log(Symbol('id').constructor === Boolean) // false
console.log(9007199254740999n.constructor === Boolean) // false
console.log(BigInt(9007199254740999).constructor === Boolean) // false

// 引用类型
console.log([].constructor === Array) // true
console.log(function () {}.constructor === Function) // true
console.log({}.constructor === Object) // true
```

撇去 `null`、`undefined`、`Symbol`、`BigInt`，似乎说 `constructor` 能用于检测js的基本类型和引用类型

但当涉及到原型和继承的时候，便出现了问题，如下：

```js
function fun() {};

fun.prototype = new Array();

let f = new fun();

console.log(f.constructor===fun); // false
console.log(f.constructor===Array); // true
```

在这里，我们先是定义了一个函数 `fun` ，并将该函数的原型指向了数组，同时，声明了一个f为 `fun` 的类型，然后利用 `constructor` 进行检测时，会发现并不符合预期

#### 小结

撇去 `null`、`undefined`、`Symbol`、`BigInt`，似乎说 `constructor` 能用于检测js的基本类型和引用类型，但当对象的原型更改之后，constructor便失效了。

### Object.prototype.toString.call()

```js
let test = Object.prototype.toString

// 基本类型
console.log(Object.prototype.toString.call("Picker"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]

console.log(Object.prototype.toString.call(Symbol('Picker')));//[object Symbol]
console.log(Object.prototype.toString.call(9007199254740999n));//[object BigInt]
console.log(Object.prototype.toString.call(BigInt(9007199254740999)));//[object BigInt]

console.log(Object.prototype.toString.call({name: "Picker"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]

function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]
```

得到结果之后, 你可以通过：`xxx.slice(8, -1).toLowerCase()`，就可拿来正常使用咯；

我们看下继承之后是否能检测出来:

```js
function fun() {};

fun.prototype = new Array();

let f = new fun();

console.log(Object.prototype.toString.call(fun)) // [object Function]
console.log(Object.prototype.toString.call(f))   // [object Object]
```

可以看出，Object.prototype.toString.call()可用于检测js所有的数据类型，完美~

::: warning
无法区分自定义对象类型，自定义类型可以采用 `instanceof` 区分
:::

关于 toString 可以参考： [toString 详解](/base/toString.md)

#### Summary

![数据类型 & 精准检测](/blog/images/base/6.webp)

![建议使用说明](/blog/images/base/7.webp)
