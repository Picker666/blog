# undefined 和 void 0

## undefined

与众不同的 `undefined`;

`undefined` 是关键字吗？

```js
var null; // Uncaught SyntaxError: Unexpected token 'null'

var false; // Uncaught SyntaxError: Unexpected token 'false'

var undefined; // undefined
```

从本质上来说，`undefined` **不是一个关键字**。

### 1、在全局环境 `undefined` 是一个 window下的一个只读属性

```js
// 全局
var undefined = 10;
console.log(undefined); // undefined
console.log(undefined in window); // true;
```

* 2、在局部作用域中 `undefined` 可以作为变量

```js
function func () {
  let undefined = 10;
  console.log(undefined);
}

func(); // 10;
```

## void 0

```js
console.log(void 0); // undefined
console.log(void 1234); // undefined
```

void 是一个关键字，void后面可以跟一个表达式，不管void后面的表达式运算结果是多少（任意的一个表达式），最终整个表达式返回一个 `undefined` 的结果，所以void 后面写 0, 1, 2等等都可以,为了统一编程习惯，所以一般后面写0。
