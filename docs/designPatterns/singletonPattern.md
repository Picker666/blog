# 创建型模式 - 单例模式

单例模式（Singleton Pattern）是 Java 中最简单的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建。这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象。

::: warning 注意

* 1、单例类只能有一个实例。
* 2、单例类必须自己创建自己的唯一实例。
* 3、单例类必须给所有其他对象提供这一实例。

:::

::: tip
单例模式 实例 -- [loading](blog/docs/../../../newFunction/loading)
:::

## 介绍

### 意图

保证一个类仅有一个实例，并提供一个访问它的**全局**访问点。

### 主要解决

一个全局使用的类频繁地创建与销毁。

### 何时使用

当您想控制实例数目，节省系统资源的时候。

### 如何解决

判断系统是否已经有这个单例，**如果有则返回，如果没有则创建**。或者说，用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象。

### 关键代码

构造函数是私有的。

## 实现

假设要设置一个管理员，多次调用也仅设置一次，我们可以使用闭包缓存一个内部变量来实现这个单例

```js
function SetManager(name) {
    this.manager = name;
}

SetManager.prototype.getName = function() {
    console.log(this.manager);
};

var SingletonSetManager = (function() {
    var manager = null;

    return function(name) {
        if (!manager) {
            manager = new SetManager(name);
        }

        return manager;
    } 
})();

SingletonSetManager('a').getName(); // a
SingletonSetManager('b').getName(); // a
SingletonSetManager('c').getName(); // a
```

这是比较简单的做法，但是假如我们还要设置一个HR呢？就得复制一遍代码了

所以，可以改写单例内部，实现地更通用一些

```js
// 提取出通用的单例
function getSingleton(fn) {
    var instance = null;

    return function() {
        if (!instance) {
            instance = fn.apply(this, arguments);
        }

        return instance;
    }
}
```

再进行调用，结果还是一样

```js
// 获取单例
var managerSingleton = getSingleton(function(name) {
    var manager = new SetManager(name);
    return manager;
});

managerSingleton('a').getName(); // a
managerSingleton('b').getName(); // a
managerSingleton('c').getName(); // a
```

这时，我们添加HR时，就不需要更改获取单例内部的实现了，仅需要实现添加HR所需要做的，再调用即可

```js
function SetHr(name) {
    this.hr = name;
}

SetHr.prototype.getName = function() {
    console.log(this.hr);
};

var hrSingleton = getSingleton(function(name) {
    var hr = new SetHr(name);
    return hr;
});

hrSingleton('aa').getName(); // aa
hrSingleton('bb').getName(); // aa
hrSingleton('cc').getName(); // aa
```
