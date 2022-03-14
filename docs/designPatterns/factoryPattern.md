# 工厂模式

工厂模式（Factory Pattern）是 Java 中最常用的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象。

## 介绍

### 意图

**定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。**

### 主要解决

主要解决接口选择的问题。

### 何时使用

我们明确地计划不同条件下创建不同实例时。

* 如果你不想让某个子系统与较大的那个对象之间形成强耦合，而是想运行时从许多子系统中进行挑选的话，那么工厂模式是一个理想的选择
* 将 [new](blog/docs/../../../base/javascript/newConstructor) 操作简单封装，遇到new的时候就应该考虑是否用工厂模式；
* 需要依赖具体环境创建不同实例，这些实例都有相同的行为,这时候我们可以使用工厂模式，简化实现的过程，同时也可以减少每种对象所需的代码量，有* 利于消除对象间的耦合，提供更大的灵活性

### 什么时候不用

当被应用到错误的问题类型上时,这一模式会给应用程序引入大量不必要的复杂性.除非为创建对象提供一个接口是我们编写的库或者框架的一个设计上目标,否则我会建议使用明确的构造器,以避免不必要的开销。

由于对象的创建过程被高效的抽象在一个接口后面的事实,这也会给依赖于这个过程可能会有多复杂的单元测试带来问题。

### 如何解决

让其子类实现工厂接口，返回的也是一个抽象的产品。

### 关键代码

创建过程在其子类执行。

### 应用实例

* 1、您需要一辆汽车，可以直接从工厂里面提货，而不用去管这辆汽车是怎么做出来的，以及这个汽车里面的具体实现。
* 2、Hibernate 换数据库只需换方言和驱动就可以。

### 优点

* 1、一个调用者想创建一个对象，只要知道其名称就可以了。
* 2、扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。
* 3、屏蔽产品的具体实现，调用者只关心产品的接口。
* 4、构造函数和创建者分离, 符合“开闭原则”。

### 缺点

* 每次增加一个产品时，都需要增加一个具体类和对象实现工厂，使得系统中类的个数成倍增加，在一定程度上增加了系统的复杂度，同时也增加了系统具体类的依赖。这并不是什么好事。
* 考虑到系统的可扩展性，需要引入抽象层，在客户端代码中均使用抽象层进行定义，增加了系统的抽象性和理解难度。

## 实现

###  简单工厂模式
  
在我们的生活中很多时候就有这样的场景，像在网站中有的页面是需要根据账号等级来决定是否有浏览权限的；账号等级越高可浏览的就越多，反之就越少；

```ts
// JS设计模式之简单工厂改良版
    function factory(role){
        function user(opt){
            this.name = opt.name;
            this.viewPage = opt.viewPage;
        }

        switch(role){
            case "superAdmin":
                return new user({name:"superAdmin",viewPage:["首页","发现页","通讯录","应用数据","权限管理"]});
                break;

            case "admin":
                return new user({name:"admin",viewPage:["首页","发现页","通讯录","应用数据"]});
                break;

            case "normal":
                return new user({name:"normal",viewPage:["首页","发现页","通讯录"]});
        }
    }

    let superAdmin = factory("superAdmin");
    console.log(superAdmin);
    let admin = factory("admin");
    console.log(admin);
    let normal = factory("normal");
    console.log(normal);
```

### 工厂方法模式

工厂方法模式是将创建对象的工作推到子类中进行；也就是相当于工厂总部不生产产品了，交给下辖分工厂进行生产；但是进入工厂之前，需要有个判断来验证你要生产的东西是否是属于我们工厂所生产范围，如果是，就丢给下辖工厂来进行生产，如果不行，那么要么新建工厂生产要么就生产不了；

```js
// JS设计模式之工厂方法模式
    function factory(role){
        if(this instanceof factory){
            var a = new this[role]();
            return a;
        }else{
            return new factory(role);
        }
    }

    factory.prototype={
        "superAdmin":function(){
            this.name="超级管理员";
            this.viewPage=["首页","发现页","通讯录","应用数据","权限管理"];
        },
        "admin":function(){
            this.name="管理员";
            this.viewPage=["首页","发现页","通讯录","应用数据"];
        },
        "user":function(){
            this.name="普通用户";
            this.viewPage=["首页","发现页","通讯录"];
        }
    }

    let superAdmin = factory("superAdmin");
    console.log(superAdmin);
    let admin = factory("admin");
    console.log(admin);
    let user = factory("user");
    console.log(user);
```

工厂方法模式关键核心代码就是工厂里面的判断this是否属于工厂，也就是做了分支判断，这个工厂只做我能生产的产品，如果你的产品我目前做不了，请找其他工厂代加工；

### 抽象工厂模式：

如果说上面的简单工厂和工厂方法模式的工作是生产产品，那么抽象工厂模式的工作就是生产工厂的；

举个例子：代理商找工厂进行合作，但是工厂没有实际加工能力来进行代加工某产品；无奈又签署了合同，这时，工厂上面的集团公司就出面了，集团公司承认该工厂是该集团下属公司，所以集团公司就重新建造一个工厂来进行代加工某商品以达到履行合约；

```js

//JS设计模式之抽象工厂模式
        let agency = function(subType, superType) {
      //判断抽象工厂中是否有该抽象类
      if(typeof agency[superType] === 'function') {
        function F() {};
        //继承父类属性和方法
        F.prototype = new agency[superType] ();
        console.log(F.prototype);
        //将子类的constructor指向子类
        subType.constructor = subType;
        //子类原型继承父类
        subType.prototype =  new F();
    
      } else {
        throw new Error('抽象类不存在!')
      }
    }
    
    //鼠标抽象类
    agency.mouseShop = function() {
      this.type = '鼠标';
    }
    agency.mouseShop.prototype = {
      getName: function(name) {
        // return new Error('抽象方法不能调用');
        return this.name;    
      }
    }
    
    //键盘抽象类
    agency.KeyboardShop = function() {
      this.type = '键盘';
    }
    agency.KeyboardShop.prototype = {
      getName: function(name) {
        // return new Error('抽象方法不能调用');
        return this.name;
      }
    }
    
    
    
    //普通鼠标子类
    function mouse(name) {
      this.name = name;
      this.item = "买我，我线长,玩游戏贼溜"
    }
    //抽象工厂实现鼠标类的继承
    agency(mouse, 'mouseShop');
    //子类中重写抽象方法
    // mouse.prototype.getName = function() {
    //   return this.name;
    // }
    
    //普通键盘子类
    function Keyboard(name) {
      this.name = name;
      this.item = "行，你买它吧,没键盘看你咋玩";
    }
    //抽象工厂实现键盘类的继承
    agency(Keyboard, 'KeyboardShop');
    //子类中重写抽象方法
    // Keyboard.prototype.getName = function() {
    //   return this.name;
    // }
    
    
    
    //实例化鼠标
    let mouseA = new mouse('联想');
    console.log(mouseA.getName(), mouseA.type,mouseA.item); //联想 鼠标
    
    //实例化键盘
    let KeyboardA = new Keyboard('联想');
    console.log(KeyboardA.getName(), KeyboardA.type,KeyboardA.item); //联想 键盘
```

抽象工厂模式一般用于严格要求以面向对象思想进行开发的超大型项目中，我们一般常规的开发的话一般就是简单工厂和工厂方法模式会用的比较多一些；

### 总结

大白话解释：简单工厂模式就是你给工厂什么，工厂就给你生产什么；

工厂方法模式就是你找工厂生产产品，工厂是外包给下级分工厂来代加工，需要先评估一下能不能代加工；能做就接，不能做就找其他工厂；

抽象工厂模式就是工厂接了某项产品订单但是做不了，上级集团公司新建一个工厂来专门代加工某项产品；

## 例子

### JQuery的$()

曾经我们熟悉的JQuery的$()就是一个工厂函数，它根据传入参数的不同创建元素或者去寻找上下文中的元素，创建成相应的jQuery对象

```js
class jQuery {
    constructor(selector) {
        super(selector)
    }
    add() {
        
    }
  // 此处省略若干API
}

window.$ = function(selector) {
    return new jQuery(selector)
}
```

### vue 的异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。例如：

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```
