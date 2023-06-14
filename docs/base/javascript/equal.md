# == 和 ===

如何你对上面的例子还一知半解，那么我们来详细介绍一下`==`和`===`的规则以及区别。

## ===严格相等

::: tip
`===`叫做严格相等，是指：左右两边不仅值要相等，类型也要相等，例如`'1'===1`的结果是`false`，因为一边是`string`，另一边是`number`。
:::
```js
console.log('1'===1); // 输出false
```

## ==不严格相等

::: tip
`==`不像`===`那样严格，对于一般情况，只要值相等，就返回`true`，但`==`还涉及一些类型转换，它的转换规则如下：
* 两边的类型是否相同，相同的话就比较值的大小，例如`1==2`，返回`false`
* 类型不相同会进行类型转换
* 判断的是否是`null`和`undefined`，是的话就返回`true`
* 判断的类型是否是`String`和`Number`，是的话，把`String`类型转换成`Number`，再进行比较
* 判断其中一方是否是`Boolean`，是的话就把`Boolean`转换成`Number`，再进行比较
* 如果其中一方为`Object`，且另一方为`String`、`Number`或者`Symbol`，会将`Object`转换成原始类型后，再进行比较
:::

```js
1 == {id: 1, name: 'AAA'}
        ↓
1 == '[object Object]'
```

## 转boolean

除了`undefined`、`null`、`false`、`0`、`-0`、`NaN`和空字符串转换成`false`以外，其他所有值都转换成`true`，包括所有对象。

## 对象转原始类型

对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：
1. 是否已经是原始类型，是则直接返回
2. 调用`valueOf()`，如果转换为原始类型，则返回
3. 调用`toString()`，如果转换为原始类型，则返回
4. 也可以重写`Symbol.toPrimitive()`方法，优先级别最高
5. 如果都没有返回原始类型，会报错

```js
var obj = {
  value: 0,
  valueOf() {
    return 1;
  },
  toString() {
    return '2'
  },
  [Symbol.toPrimitive]() {
    return 3
  }
}
console.log(obj + 1); // 输出4
```

## 对象转原始类型应用

```js
// 问：如何使if(a==1&&a==2&&a==3) {console.log('true')};正确打印'true'
var a = {
  value: 0,
  valueOf() {
    this.value++;
    return this.value;
  }
}
if(a==1 && a==2 && a==3) {
  console.log('true'); // 输出true
}

// 利用数组的特性：可以看到数组 toString 会调用本身的 join 方法，这里把自己的join方法该写为shift,每次返回第一个元素，而且原数组删除第一个值，正好可以使判断成立。
var a = [1,2,3];
// a.join = a.shift;
a.toString = a.shift;
console.log(a == 1 && a == 2 && a == 3); // true
```

**代码分析**：

1. 重写对象`a`的`valueOf()`方法，使`value`属性每次调用时自增
2. 当判断`a==1`时，第一次调用`valueOf()`方法，此时`value`等于1，判断`1==1`，继续向下走
3. 判断`a==2`时，第二次调用`valueOf()`方法，此时`value`等于2，判断`2==2`，继续向下走
4. 判断`a==3`时，第三次调用`valueOf()`方法，此时`value`等于3，判断`3==3`，`if`判断结束
5. `if`条件判断为`true && true && true`，执行`console.log('true')`，打印`true`

## 拓展

```js
// a === 1 && a === 2 && a === 3

var val = 0;
Object.defineProperty(window, 'a', {
  get: function() {
    return ++val;
  }
});

console.log(a === 1 && a === 2 && a === 3); // true
```
