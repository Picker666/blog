# call, apply and bind

## call()

首先看一个栗子。

```js
function sayHelloWord(time) {
  var talk = [this.name, 'say', this.word].join(' ');
  console.log(`${talk}, ${time}!`);
}

var bottle = {
  name: 'Picker666',
  word: 'hello'
};

// 使用 call 将 bottle 传递为 sayHelloWord 的 this
sayHelloWord.call(bottle, 'now');
// Picker666 say hello, now!
```

通常我们调用 `call()` 方法时候，传入的参数个数是该方法的参数个数+1，第一个参数是作为该方法的 `this` 的存在；
如上面的例子， `bottle` 会作为 `sayHelloWord` 的 `this` 来使用，后边的参数会依次作为 `sayHelloWord` 的形参填充。

所以， `call()` 主要实现了以下两个功能：

* call 改变了 this 的指向
* bottle 执行了 sayHelloWord 函数;

---

模拟实现 `call` 有三步：

* 将函数设置为对象的属性
* 执行函数
* 删除对象的这个属性

```js
Function.prototype.newCall = function (_this) {
  // 调用 newCall 的不是函数，需要抛出异常
  if (typeof this !== "function") {
    throw new Error("Function.prototype.newCall - what is trying to be bound is not callable");
  }
  /**
   * 1、将函数设为对象的属性
   * 2、注意：非严格模式下
   *    指定为 null 和 undefined 的 this 值会自动指向全局对象(浏览器中就是 window 对象)
   *    值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象(用 Object() 转换）
  */
  let context = _this ? Object(_this) : window;

  // 注意：此刻的 this 指向调用 newCall() 的方法；
  context.fn = this;

  // 获取方法的参数，并执行
  const args = [...arguments].slice(1);
  let result = context.fn(...args);

  // 删除该函数
  delete context.fn;

  // 注意：函数是可以有返回值的
  return result;
}
```

## apply()

首先看个例子：

```js
const function func (a, b, c) {
  const sum = a + b + c;
  return `${this.name}'s result is: ${sum}.`
}

const context = {name: 'picker666'};

func(1, 2, 3);
func.apply(context, [1, 2, 3])
```

`apply()` 方法调用一个具有给定 `this` 值的函数，以及作为一个数组（或[类似数组对象）提供的参数。

---

::: tip
`call` 和 `apply` 之间唯一的语法区别是 `call` 接受一个参数列表，而 `apply` 则接受带有一个类数组对象。
:::

---

`apply` 实现方式和 `call` 类似

```js
Function.prototype.newApply = function (context, arr) {
  // 调用 newApply 的不是函数，需要抛出异常
  if (typeof this !== "function") {
    throw new Error("Function.prototype.newApply - what is trying to be bound is not callable");
  }

  context = context ? Object(context) : window; 
  context.fn = this;

  let result;
  if (!arr) {
      result = context.fn();
  } else {
      result = context.fn(...arr);
  }

  delete context.fn
  return result;
}
```

## bind()

::: tip
`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。  — MDN
:::

::: warning
`bind` 方法与 `call` / `apply` 最大的不同就是前者返回一个绑定上下文的函数，而后两者是直接执行了函数。<br />
另外，`bind` 在第一次调用的时候是支持传入除上下文之外的参数，并且再返回的方法中，不需要再次传入该参数。
:::

```js
const value = 2;
const foo = { value: 1 };

function bar(name, age) {
    return {
  value: this.value,
  name: name,
  age: age
    }
};

bar.call(foo, "Jack", 20); // 直接执行了函数
// {value: 1, name: "Jack", age: 20}

let bindFoo1 = bar.bind(foo, "Jack", 20); // 返回一个函数
bindFoo1();
// {value: 1, name: "Jack", age: 20}

let bindFoo2 = bar.bind(foo, "Jack"); // 返回一个函数
bindFoo2(20);
// {value: 1, name: "Jack", age: 20}
```

通过上述代码可以看出 bind 有如下特性：

* 指定 this
* 传入参数
* 返回一个函数
* 柯里化

`bind` 的实现

```js
Function.prototype.newBind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.newBind - what is trying to be bound is not callable");
    }

    // this 指向调用者
    var self = this;
    // 实现第2点，因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1); 

    // 实现第3点,返回一个函数
    return function () {
        // 实现第4点，这时的arguments是指bind返回的函数传入的参数
        // 即 return function 的参数
        var bindArgs = Array.prototype.slice.call(arguments);

        // 实现第1点
        const params = args.concat(bindArgs); //参数拼接
        return self.apply( context, params );
    }
}
```
