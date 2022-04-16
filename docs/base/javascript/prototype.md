# 原型、原型链和原型继承

![原型、原型链](/blog/images/base/prototype1.png)

## 原型 prototype 和 __proto__

* 每个对象都有一个__proto__属性，并且指向它的prototype原型对象
* 每个构造函数都有一个prototype原型对象
  * prototype原型对象里的constructor指向构造函数本身

![prototype 和 __proto__ 关系示意图](/blog/images/base/prototype2.png)

### prototype 和 __proto__有什么用呢

实例对象的__proto__指向构造函数的prototype，从而实现继承。

prototype对象相当于特定类型所有实例对象都可以访问的公共容器

![prototype 和 __proto__ 关系示意图](/blog/images/base/prototype3.jpg)

```js
function Person(nick, age){
    this.nick = nick;
    this.age = age;
}
Person.prototype.sayName = function(){
    console.log(this.nick);
}

var p1 = new Person('Byron', 20);

var p2 = new Person('Casper', 25);

p1.sayName()  // Byron

p2.sayName()  // Casper

p1.__proto__ === Person.prototype       //true

p2.__proto__ === Person.prototype   //true

p1.__proto__ === p2.__proto__           //true

Person.prototype.constructor === Person  //true
```

::: warning 注意

* 1. 当`Object.prototype.__proto__` 已被大多数浏览器厂商所支持的今天，其存在和确切行为仅在ECMAScript 2015规范中被标准化为传统功能，以确保Web浏览器的兼容性。为了更好的支持，建议只使用 `Object.getPrototypeOf()`。
* 2. Object.create(null) 新建的对象是没有__proto__属性的

:::

## 原型链

```js
var arr = [1,2,3]

arr.valueOf()  //  [1, 2, 3]
```

我们再来看一张图:

![arr 中找到valueOf](/blog/images/base/prototype4.png)
![arr 中找到valueOf](/blog/images/base/prototype5.png)

按照之前的理论，如果自身没有该方法，我们应该去Array.prototype对象里去找，但是你会发现arr.prototype上压根就没有valueOf方法，那它是从哪里来的呢？

很奇怪我们在arr.prototype(Array).prototype(Object)里找到了valueOf方法，为什么呢？

### 查找valueOf方法的过程

当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

查找valueOf大致流程

* 当前实例对象obj，查找obj的属性或方法，找到后返回
* 没有找到，通过obj. __proto__，找到obj构造函数的prototype并且查找上面的属性和方法，找到后返回
* 没有找到，把Array.prototype当做obj，重复以上步骤。

当然不会一直找下去，原型链是有终点的，最后查找到Object.prototype时
Object.prototype.__proto__ === null，意味着查找结束

![arr 中找到valueOf](/blog/images/base/prototype6.png)

我们来看看上图的关系

```js
arr.__proto__ === Array.prototype
true
Array.prototype.__proto__ === Object.prototype
true
arr.__proto__.__proto__ === Object.prototype
true

// 原型链的终点
Object.prototype.__proto__ === null
true
```

### 原型链如下:

```js
arr ---> Array.prototype ---> Object.prototype ---> null
```

这就是传说中的原型链，层层向上查找，最后还没有就返回undefined

## JavaScript 中的继承

### 什么是继承

::: tip
继承是指一个对象直接使用另外一个对象的属性和方法
:::

由此可见只要实现属性和方法的继承，就达到继承的效果

* 得到一个对象的属性
* 得到一个对象的方法

### 属性如何继承

```js
function Person (name, age) {
    this.name = name
    this.age = age
}

// 方法定义在构造函数的原型上
Person.prototype.getName = function () { console.log(this.name)}
```

此时我想创建一个Teacher类，我希望它可以继承Person所有的属性，并且额外添加属于自己特定的属性；

* 一个新的属性，subject——这个属性包含了教师教授的学科。

定义Teacher的构造函数

```js
function Teacher (name, age, subject) {
    Person.call(this, name, age)
    this.subject = subject
}
```

* 属性的继承是通过在一个类内执行另外一个类的构造函数，通过call指定this为当前执行环境，这样就可以得到另外一个类的所有属性。

```js
Person.call(this, name, age)
```

我们实例化一下看看

```js
var teacher = new Teacher('jack', 25, Math)

teacher.age
25
teacher.name
"jack"
```

很明显Teacher成功继承了Person的属性。

### 方法如何继承

我们需要让Teacher从Person的原型对象里继承方法。我们要怎么做呢？

我们都知道类的方法都定义在prototype里，那其实我们只需要把Person.prototype的备份赋值给Teacher.prototype即可

```js
Teacher.prototype = Object.create(Person.prototype)
```

Object.create简单说就是新建一个对象，使用现有的对象赋值给新建对象的__proto__

为什么这么操作？

* 因为如果直接赋值，那会是引用关系，意味着修改Teacher. prototype，也会同时修改Person.prototype，这是不合理的。
* 另外注意一点就是，在给Teacher类添加方法时，应该在修改prototype以后，否则会被覆盖掉，原因是赋值前后的属性值是不同的对象。

最后还有一个问题，我们都知道prototype里有个属性constructor指向构造函数本身，但是因为我们是复制其他类的prototype，所以这个指向是不对的，需要更正一下。
如果不修改，会导致我们类型判断出错

```js
Teacher.prototype.constructor = Teacher
```

### 完整方案

```js
Teacher.prototype = Object.create(Person.prototype)

Teacher.prototype.constructor
ƒ Person(name, age) {
    this.name = name
    this.age = age
}

---

Teacher.prototype.constructor = Teacher
ƒ Teacher(name, age, subject) {
    Person.call(this, name, age)
    this.subject = subject
}
```

继承方法的最终方案：

```js
Teacher.prototype = Object.create(Person.prototype)
Teacher.prototype.constructor = Teacher
```

### hasOwnProperty

在原型链上查询属性比较耗时，对性能有影响，试图访问不存在的属性时会遍历整个原型链。

遍历对象属性时，每个可枚举的属性都会被枚举出来。 要检查是否具有自己定义的属性，而不是原型链上的属性，必须使用hasOwnProperty方法。

::: tip
hasOwnProperty 是 JavaScript 中唯一处理属性并且不会遍历原型链的方法。
:::

## 总结

### prototype 和 __proto__

* 每个对象都有一个__proto__属性，并且指向它的prototype原型对象
* 每个构造函数都有一个prototype原型对象
  * prototype原型对象里的constructor指向构造函数本身

### 原型链总结

每个对象都有一个__proto__，它指向它的prototype原型对象，而prototype原型对象又具有一个自己的prototype原型对象，就这样层层往上直到一个对象的原型prototype为null

这个查询的路径就是原型链

### JavaScript中的继承

* 属性继承

```js
function Person (name, age) {
    this.name = name
    this.age = age
}

// 方法定义在构造函数的原型上
Person.prototype.getName = function () { console.log(this.name)}

function Teacher (name, age, subject) {
    Person.call(this, name, age)
    this.subject = subject
}
```

* 方法继承

```js
Teacher.prototype = Object.create(Person.prototype)
Teacher.prototype.constructor = Teacher
```
