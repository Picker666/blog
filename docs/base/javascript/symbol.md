# Symbol

:::tip Symbol 是一种类似于字符串的数据类型
let s = new Symbol() 错误，不能使用new

Symbol不是对象，不能添加属性。
:::

## 1、保存独一无二的值

```js
let s1 = Symbol();
console.log(s1);  //Symbol()
let s2 = Symbol();
console.log(s1 === s2);  //false
```

## 2、自动调用toString()函数

```js
const obj = {name: 'Picker'};
let s = Symbol(obj);
console.log(s);  //Symbol([object Object])

obj.toString = function(){
    return this.name
}
s = Symbol(obj);
console.log(s); // Symbol(Picker)
```

## 3、Symbol.for()

在全局中注册的

不会每次调用都返回一个新的 Symbol 类型的值，而是先检查给定的key是否已经存在，不存在才新建；

```js
let s1 = Symbol.for('Picker');
let s2 = Symbol.for('Picker');
console.log(s1 === s2);//true
```

## 4、Symbol.keyFor()

返回一个已经登记的Symbol类型值的key

```js
const s1 = Symbol('Picker')
console.log(Symbol.keyFor(s1)) // undefined

const s2 = Symbol.for('Picker')
console.log(Symbol.keyFor(s2)) // Picker
```

## 5、属性遍历

Symbol 类型的数据作为属性时候，**不可枚举属性**，因此：

* `for in` - 遍历所有属性（包含原型上的属性），但是**不能**遍历 Symbol 类型的属性；
* `for of` - 遍历对象本身属性的值（不包含原型），但是**不能**遍历 Symbol 类型的属性的值；
* `Object.getOwnPropertySymbols(obj)` - 只能获取到对象上的 Symbol 类型的属性；
* `Reflect.ownKeys(obj)` - 可以获取到对象上的所有属性（ Symbol 属性、不可枚举属性，但是不包含原型链上的属性）。

## 6. 代替字符串

```js
function getArea(shape) {
    let area = 0
    switch (shape) {
        case 'Triangle'://魔术字符串
            area = 1
            break
        case 'Circle':
            area = 2
            break
    }
    return area
}
console.log(getArea('Triangle'))

// ===================
const shapeType = {
    triangle: Symbol(),//使用symbol赋一个独一无二的值
    circle: Symbol()
}

function getArea(shape) {
    let area = 0
    switch (shape) {
        case shapeType.triangle:
            area = 1
            break
        case shapeType.circle:
            area = 2
            break
    }
    return area
}
console.log(getArea(shapeType.triangle))
```
