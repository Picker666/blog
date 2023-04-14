# JavaScript几种继承方式

[demo 代码](https://github.com/Picker666/blog-example) `src/base/inherit`

## 1、原型链继承

在原型链继承里涉及到`构造函数`、`原型`和`实例`；

**子类继承父类的实例；**

构造函数都有一个原型对象，而原型对象又包含了一个指向构造函数的指针。

```js
function Parent() {
  this.name = 'Picker';
  this.property = 'Parent';
}

Parent.prototype.getParentValue = function () {
  return this.property;
};

function Child() {
  this.name = 'sub - Picker';
  this.subproperty = 'Child';
}

// 继承Parent
Child.prototype = new Parent();

Child.prototype.getChildValue = function () {
  return this.subproperty;
};

const instance = new Child();
const instance1 = new Parent();
instance1.name = 'Picker 666';
console.log(instance.getParentValue()); // Parent
console.log(instance.getChildValue()); // Child

console.log(instance.name); // sub - Picker
console.log(instance1.name); // Picker 666
```

特点：

* 1、非常纯粹的继承关系，实例是子类的实例，也是父类的实例
* 2、父类新增原型方法/原型属性，子类都能访问到
* 3、简单，易于实现

缺点：

* 1、要想为子类新增属性和方法，必须要在new Child()这样的语句之后执行，不能放到构造器中
* 2、无法实现多继承
* 3、来自原型对象的**所有属性**被所有实例共享（不只是引用属性）（详细请看附录代码： 示例1）
* 4、创建子类实例时，无法向父类构造函数传参。

## 2、构造函数继承（借助call）

```js
function Parent1() {
  this.name = 'Picker';
}

Parent1.prototype.getName = function () {
  return this.name;
};

function Child1() {
  Parent1.call(this);
  this.type = 'child';
}

const child1 = new Child1();
console.log(child1); //  { name: 'Picker', type: 'child' }
console.log(child1.getName()); //  child1.getName is not a function
```

特点：

* 1、解决了1中，子类实例共享父类引用属性的问题
* 2、创建子类实例时，可以向父类传递参数
* 3、可以实现多继承（call多个父类对象）

缺点：

* 1、实例并不是父类的实例，只是子类的实例
* 2、只能继承父类的实例属性和方法，不能继承原型属性/方法
* 3、无法实现函数复用，每个子类都有父类实例函数的副本，影响性能

## 3、实例继承

```js
function Cat(name){
  var instance = new Animal();
  instance.name = name || 'Tom';
  return instance;
}

// Test Code
var cat = new Cat();
console.log(cat.name);
console.log(cat.sleep());
console.log(cat instanceof Animal); // true
console.log(cat instanceof Cat); // false
```

特点：

* 1、不限制调用方式，不管是new 子类()还是子类(),返回的对象具有相同的效果

缺点：

* 1、实例是父类的实例，不是子类的实例
* 2、不支持多继承

## 4、拷贝继承

```js
function Cat(name){
  var animal = new Animal();
  for(var p in animal){
    Cat.prototype[p] = animal[p];
  }

  this.name = name || 'Tom';
}

// Test Code
var cat = new Cat();
console.log(cat.name);
console.log(cat.sleep());
console.log(cat instanceof Animal); // false
console.log(cat instanceof Cat); // true
```

特点：

* 1、支持多继承

缺点：

* 1、效率较低，内存占用高（因为要拷贝父类的属性）
* 2、无法获取父类不可枚举的方法（不可枚举方法，不能使用for in 访问到）

## 5、组合继承

通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用。

```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
Cat.prototype = new Animal();

Cat.prototype.constructor = Cat;

// Test Code
var cat = new Cat();
console.log(cat.name);
console.log(cat.sleep());
console.log(cat instanceof Animal); // true
console.log(cat instanceof Cat); // true
```

特点：

* 1、弥补了方式2的缺陷，可以继承实例属性/方法，也可以继承原型属性/方法
* 2、既是子类的实例，也是父类的实例
* 3、不存在引用属性共享问题
* 4、可传参
* 5、函数可复用

缺点：

* 1、调用了两次父类构造函数，生成了两份实例（子类实例将子类原型上的那份屏蔽了）。

## 6、寄生组合继承

```js
function Cat(name){
  Animal.call(this);
  this.name = name || 'Tom';
}
(function(){
  // 创建一个没有实例方法的类
  var Super = function(){};
  Super.prototype = Animal.prototype;
  //将实例作为子类的原型
  Cat.prototype = new Super();
})();

// Test Code
var cat = new Cat();
console.log(cat.name);
console.log(cat.sleep());
console.log(cat instanceof Animal); // true
console.log(cat instanceof Cat); //true

Cat.prototype.constructor = Cat; // 需要修复下构造函数
```

特点：

* 1、堪称完美

缺点：

* 2、实现较为复杂
