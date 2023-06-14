# 正则

## 1、非捕获分组

```js
(?:表达式)
```

```js
let a = '01-75855';
let reg = /(\d{1,}-)(\d{5})/;
let result = a.match(reg);
console.log('result: ', result.toString()); // [01-75855,01-,75855]

reg = /(?:\d{1,}-)(\d{5})/;
result = a.match(reg);
console.log('result: ', result.toString()); // [01-75855, 75855]
```

使用了**非捕获分组**，匹配的结果排除了该分组。

## 2、回溯

可以发现 \1 表示的就是第一个分组；

例子： 
```js
let a = 'otto';
let reg = /(\w)(\w)\2\1/;
let result = a.match(reg);
console.log('result: ', result); // ["otto","o","t"]

a = 'warrandice';
result = a.match(reg);
console.log('result: ', result); // ['arra', 'a', 'r']
```

## 3、正向先行断言

`(?=表达式)`

指在某个位置向右看，表示所在位置右侧必须能匹配表达式

```js
let a = 'Admin123456';
let reg = /(?=\w*[a-z])(?=\w*[A-Z])(?=\w*\d)\w{8,}/;
let result = a.match(reg);
console.log('result: ', result, reg.test(a)); // ["Admin123456"] true

a = 'admin123456';
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // null false

a = 'Admin12';
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // null false
```

## 4、反向先行断言

反向先行断言`(?!表达式)`的作用是保证右边不能出现某字符。

```js
let a = 'abc@sina.com';
let reg = /\w{1,}@(?!qq)\w{3,}\.com/;
let result = a.match(reg);
console.log('result: ', result, reg.test(a)); // ["abc@sina.com"] true

a = 'test@qq.com';
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // null true
```

## 5、正向后行断言

正向后行断言：`(?<=表达式)`，指在某个位置向左看，表示所在位置左侧必须能匹配表达式

```js
let a = 'Admin123456';
let reg = /\w{8,}(?<=[a-z]\w*)(?<=[A-Z]\w*)(?<=\d\w*)/;
let result = a.match(reg);
console.log('result: ', result, reg.test(a));

a = 'admin123456';
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // null false

a = 'Admin12';
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // null false
```

## 反向后行断言

反向后行断言：(?<!表达式)，指在某个位置向左看，表示所在位置左侧不能匹配表达式

```js
let a = '3.1Windows';
let reg = /(?<!95|98|NT|2000)Windows/;
let result = a.match(reg);
console.log('result: ', result, reg.test(a)); // ["Windows"] true

reg = /.*(?<!95|98|NT|2000)Windows/;
result = a.match(reg);
console.log('result: ', result, reg.test(a)); // ["3.1Windows"] true
```

