# 实现一个深拷贝

## 一、简单实现

深拷贝可以拆分成 2 步，浅拷贝 + 递归，浅拷贝时判断属性值是否是对象，如果是对象就进行递归操作，两个一结合就实现了深拷贝。

我们可以写出简单浅拷贝代码如下：

```js
unction cloneShallow(source) {
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
    return target;
}

// 测试用例
var a = {
    name: "muyiy",
    book: {
        title: "You Don't Know JS",
        price: "45"
    },
    a1: undefined,
    a2: null,
    a3: 123
}
var b = cloneShallow(a);

a.name = "高级前端进阶";
a.book.price = "55";

console.log(b);
// { 
//   name: 'muyiy', 
//   book: { title: 'You Don\'t Know JS', price: '55' },
//   a1: undefined,
//   a2: null,
//   a3: 123
// }

```

上面代码是浅拷贝实现，只要稍微改动下，加上是否是对象的判断并在相应的位置使用递归就可以实现简单深拷贝。

```js
function cloneDeep1(source) {
    var target = {};
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object') {
                target[key] = cloneDeep1(source[key]); // 注意这里
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 使用上面测试用例测试一下
var b = cloneDeep1(a);
console.log(b);
// { 
//   name: 'muyiy', 
//   book: { title: 'You Don\'t Know JS', price: '45' }, 
//   a1: undefined,
//   a2: {},
//   a3: 123
// }
```

一个简单的深拷贝就完成了，但是这个实现还存在很多问题。

* 没有对传入参数进行校验，传入 null 时应该返回 null 而不是 {}
* 对于对象的判断逻辑不严谨，因为 typeof null === 'object'
* 没有考虑数组的兼容

## 二、 拷贝数组

我们来看下对于对象的判断：

```js
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
```

但是用在这里并不合适，因为我们要保留数组这种情况，所以这里使用 typeof 来处理。

```js
typeof null //"object"
typeof {} //"object"
typeof [] //"object"
typeof function foo(){} //"function" (特殊情况)
```

改动过后的 isObject 判断逻辑如下:

```js
function isObject(obj) {
    return typeof obj === 'object' && obj != null;
}
```

```js
function cloneDeep2(source) {

    if (!isObject(source)) return source; // 非对象返回自身

    var target = Array.isArray(source) ? [] : {};
    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep2(source[key]); // 注意这里
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 使用上面测试用例测试一下
var b = cloneDeep2(a);
console.log(b);
// { 
//   name: 'muyiy', 
//   book: { title: 'You Don\'t Know JS', price: '45' },
//   a1: undefined,
//   a2: null,
//   a3: 123
// }
```

## 三、循环引用

我们知道 JSON 无法深拷贝循环引用，遇到这种情况会抛出异常。

```js
// 此处 a 是文章开始的测试用例
a.circleRef = a;

JSON.parse(JSON.stringify(a));
// TypeError: Converting circular structure to JSON
```

### 1、使用哈希表

解决方案很简单，其实就是循环检测，我们设置一个数组或者哈希表存储已拷贝过的对象，当检测到当前对象已存在于哈希表中时，取出该值并返回即可。

```js
function cloneDeep3(source, hash = new WeakMap()) {

    if (!isObject(source)) return source; 
    if (hash.has(source)) return hash.get(source); // 新增代码，查哈希表

    var target = Array.isArray(source) ? [] : {};
    hash.set(source, target); // 新增代码，哈希表设值

    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep3(source[key], hash); // 新增代码，传入哈希表
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 此处 a 是文章开始的测试用例
a.circleRef = a;

var b = cloneDeep3(a);
console.log(b);
// {
//     name: "muyiy",
//     a1: undefined,
//    a2: null,
//     a3: 123,
//     book: {title: "You Don't Know JS", price: "45"},
//     circleRef: {name: "muyiy", book: {…}, a1: undefined, a2: null, a3: 123, …}
// }
```
### 2、使用数组

这里使用了 `ES6` 中的 `WeakMap` 来处理，那在 `ES5` 下应该如何处理呢？

也很简单，使用数组来处理就好啦，代码如下。

```js
function cloneDeep3(source, uniqueList) {

    if (!isObject(source)) return source; 
    if (!uniqueList) uniqueList = []; // 新增代码，初始化数组

    var target = Array.isArray(source) ? [] : {};

    // ============= 新增代码
    // 数据已经存在，返回保存的数据
    var uniqueData = find(uniqueList, source);
    if (uniqueData) {
        return uniqueData.target;
    };

    // 数据不存在，保存源数据，以及对应的引用
    uniqueList.push({
        source: source,
        target: target
    });
    // =============

    for(var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep3(source[key], uniqueList); // 新增代码，传入数组
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 新增方法，用于查找
function find(arr, item) {
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].source === item) {
            return arr[i];
        }
    }
    return null;
}

// 用上面测试用例已测试通过
```

现在已经很完美的解决了循环引用这种情况，那其实还是一种情况是引用丢失的情况。

```js
var obj1 = {};
var obj2 = {a: obj1, b: obj1};

obj2.a === obj2.b; 
// true

var obj3 = cloneDeep2(obj2);
obj3.a === obj3.b; 
// false
```
引用丢失在某些情况下是有问题的，比如上面的对象 obj2，obj2 的键值 a 和 b 同时引用了同一个对象 obj1，使用 cloneDeep2 进行深拷贝后就丢失了引用关系变成了两个不同的对象，那如何处理呢。

其实你有没有发现，我们的 cloneDeep3 已经解决了这个问题，因为只要存储已拷贝过的对象就可以了

```js
var obj3 = cloneDeep3(obj2);
obj3.a === obj3.b; 
```

## 四、拷贝 Symbol

这个时候可能要搞事情了，那我们能不能拷贝 `Symol` 类型呢？

当然可以，不过 `Symbol` 在 `ES6` 下才有，我们需要一些方法来检测出 Symble 类型。

方法一：`Object.getOwnPropertySymbols(...)`

方法二：`Reflect.ownKeys(...)`

对于方法一可以查找一个给定对象的符号属性时返回一个 ?`symbol` 类型的数组。注意，每个初始化的对象都是没有自己的 `symbol` 属性的，因此这个数组可能为空，除非你已经在对象上设置了 `symbol` 属性。（来自MDN）

```js
var obj = {};
var a = Symbol("a"); // 创建新的symbol类型
var b = Symbol.for("b"); // 从全局的symbol注册?表设置和取得symbol

obj[a] = "localSymbol";
obj[b] = "globalSymbol";

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols.length); // 2
console.log(objectSymbols)         // [Symbol(a), Symbol(b)]
console.log(objectSymbols[0])      // Symbol(a)
```

对于方法二返回一个由目标对象自身的属性键组成的数组。它的返回值等同于`Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))`。(来自MDN)

```js
Reflect.ownKeys({z: 3, y: 2, x: 1}); // [ "z", "y", "x" ]
Reflect.ownKeys([]); // ["length"]

var sym = Symbol.for("comet");
var sym2 = Symbol.for("meteor");
var obj = {[sym]: 0, "str": 0, "773": 0, "0": 0,
           [sym2]: 0, "-1": 0, "8": 0, "second str": 0};
Reflect.ownKeys(obj);
// [ "0", "8", "773", "str", "-1", "second str", Symbol(comet), Symbol(meteor) ]
// 注意顺序
// Indexes in numeric order, 
// strings in insertion order, 
// symbols in insertion order
```

### 方法一
思路就是先查找有没有 `Symbol` 属性，如果查找到则先遍历处理 `Symbol` 情况，然后再处理正常情况，多出来的逻辑就是下面的新增代码。

```js
unction cloneDeep4(source, hash = new WeakMap()) {

    if (!isObject(source)) return source; 
    if (hash.has(source)) return hash.get(source); 

    let target = Array.isArray(source) ? [] : {};
    hash.set(source, target);

    // ============= 新增代码
    let symKeys = Object.getOwnPropertySymbols(source); // 查找
    if (symKeys.length) { // 查找成功    
        symKeys.forEach(symKey => {
            if (isObject(source[symKey])) {
                target[symKey] = cloneDeep4(source[symKey], hash); 
            } else {
                target[symKey] = source[symKey];
            }    
        });
    }
    // =============

    for(let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (isObject(source[key])) {
                target[key] = cloneDeep4(source[key], hash); 
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// 此处 a 是文章开始的测试用例
var sym1 = Symbol("a"); // 创建新的symbol类型
var sym2 = Symbol.for("b"); // 从全局的symbol注册?表设置和取得symbol

a[sym1] = "localSymbol";
a[sym2] = "globalSymbol";

var b = cloneDeep4(a);
console.log(b);
// {
//     name: "muyiy",
//     a1: undefined,
//    a2: null,
//     a3: 123,
//     book: {title: "You Don't Know JS", price: "45"},
//     circleRef: {name: "muyiy", book: {…}, a1: undefined, a2: null, a3: 123, …},
//  [Symbol(a)]: 'localSymbol',
//  [Symbol(b)]: 'globalSymbol'
// }
```

### 方法二

```js
function cloneDeep4(source, hash = new WeakMap()) {

    if (!isObject(source)) return source; 
    if (hash.has(source)) return hash.get(source); 

    let target = Array.isArray(source) ? [...source] : { ...source }; // 改动 1
    hash.set(source, target);

      Reflect.ownKeys(target).forEach(key => { // 改动 2
        if (isObject(source[key])) {
            target[key] = cloneDeep4(source[key], hash); 
        } else {
            target[key] = source[key];
        }  
      });
    return target;
}
```