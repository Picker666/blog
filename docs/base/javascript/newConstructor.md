# 构造函数new的过程

## 构造函数和普通函数的区别

* 函数首字母大写，这个区别只是约定俗成的，便于区分。你实在要小写定义构造函数也完全没问题，所以这个区别可以忽略。
* 构造函数的调用需要用new操作符，而普通函数的调用又分很多种，但是都不会用到new操作符。所以，构造函数和普通函数的区别就在这个new操作符里。

现在让我们来好好研究一下这个new操作符。

## new 的过程

用new操作符创建对象时发生的事情：

* （1）创建一个新对象；
* （2）将构造函数的作用域赋给新对象（因此this就指向了这个新对象）；
* （3）执行构造函数中的代码（为这个新对象添加属性和方法）；
* （4）返回新对象。

::: tip
通过new关键字后跟构造函数的方式创建的对象（实例），有一个constructor（构造函数）属性，该属性指向 该实例的构造函数。
:::

通过new关键字创建的对象，是构造函数的实例，同时也是Object的实例；所有的对象皆继承自Object。构造函数是定义在Global对象中的，在浏览器中，即为window对象。

::: warning 注意
原本构造函数是window对象的方法，如果不用new关键字，而是直接调用，那么构造函数的执行对象就是window，此时的this指向window。

如果使用new关键字之后，this就指向新生成的对象。
:::

执行构造函数中的代码，看代码：

```js
function Person(){
　　this.name = "Picker";
　　var age = 22;
　　window.age = 22;
}
var p = new Person();
alert(p.name)//Picker;
alert(p.age)//undefined;
alert(window.age)//22;
```

* 当用new关键字创建对象是，先创建了一个对象实例，然后执行代码

```js
var p = new Object();
p.name = "Picker";
```

这是普通的创建对象，然后给对象添加属性的方法。如果每创建一个对象都是这么操作，那无疑是麻烦的，new关键字自动执行构造函数咯的代码，可以省掉这些繁琐的操作。

* 第二步已经说的，将构造函数的作用域赋给新对象（因此this就指向了这个新对象），再结合第一段，自动执行构造函数里的this.name = "Picker"，就相当于执行p.name = "Picker"；而构造函数的var age= 22; 会执行但是对新生成的对象没有影响，window.age = 22;语句，会执行，且会给window对象添加一个属性。alert为证。

或许到这里，你已经理解了new操作符的前三步了，重要的三步。但是这个函数是如何返回对象的呢？我们并没有看到有任何跟return相关的语句。这就是new操作符的最后一步：返回新生成的对象。

::: tip
如果被调用的函数没有显式的 return 表达式（仅限于返回对象），则隐式的会返回 this 对象 - 也就是新创建的对象。？？？undefined
:::

```js
function Person(){
      this.name = "Tiny Colder";
      return {};
}
var p = new Person();
alert(p.name)//undefined;
```

一个对象就这么被创建出来了。

实际上，

var p = new Person();

和

var p = new Object();
Person.apply(p);

是一样的效果。

## 构造函数也是函数

::: tip
任何函数，只要通过new操作符来调用，那么它就可以作为构造函数；任何函数，如果不通过new操作符来调用，那它与普通函数并无区别。
:::

* （1）当做构造函数调用

```js
var person = new Person("CC",23);
```

* （2）当做普通函数使用

```js
Person("CC",23);    //添加到window对象
console.log(window.name);    //"CC"
console.log(window.age);    //23
```

* （3）在另一个对象的作用域中调用

```js
var person = new Object();
Person.call(person,"CC",23);
console.log(person.name);    //"CC"
console.log(person.age);    //23
```

## 需要注意的

使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一次。

```js
var person1 = new Person("CC",23);
var person2 = new Person("VV",32);
```

两个实例都有sayName()方法，但是两个方法不是同一Function的实例，也就是说，两个实例上的同名函数是不相等的。

```js
console.log(person1.sayName == person2.sayName);    //false
```

## 手动实现new

[手动实现new](/newFunction/newClass.html)
