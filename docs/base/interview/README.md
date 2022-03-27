---
sidebarDepth: 3
---
# 知识点总结

## 箭头函数和普通函数区别

* 1、箭头函数没有this，它会从自己的作用域链的上层继承this（因此无法使用apply/call/bind来帮定this）；
* 2、箭头函数不可以使用arguments对象，该对象在函数体内不存在，如果需要，可以使用rest参数提代。
* 3、箭头函数不可以使用 yield 命令，因此箭头函数不能用作generator函数；
* 4、箭头函数不可以使用new命令，因为：
  * 没有自己的this，无法调用 call，apply。
  * 没有prototype 属性，而 new命令在执行时候需要将构造函数的prototype赋值给新对象的prototype.
  
[构造函数 new的过程](/blog/base/javascript/newConstructor.html)
