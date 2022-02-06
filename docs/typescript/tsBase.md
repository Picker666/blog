# `TypeScript` 基础

## JS 的八种内置类型

```js
let str: string = 'Hello, Picker';
let num: number = 521;
let bool: boolean = true;
let big: bigint = 100n;
let und: undefined = undefined;
let nul: null = null;
let obj: object = { name: picker, age: 18 };
let sym: sym = Symbol('picker');
```

::: tip
在JS中，除了原始类型，其它的都是**对象类型**了，对象类型和原始类型不同，原始类型存储的是**值**，对象类型存储的是**地址（指针）**。

当你创建了一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址（指针）。

所以，对象和数组都是对象类型。
:::

另外，在`ts`环境中，`let`和`const`声明的变量是不一样的。

```ts
const str = 'hdfasdf'; // const str: "hdfasdf"
let str1 = 'fasd'; // let str1: string

const arr = [1, 2] as const // const arr: readonly [1, 2]
let arr1 = [1, 'ooo']; // let arr1: (string | number)[]
```

::: tip
`bigint`支持的`JavaScript`版本不能低于`ES2020`。
:::

### `number`和`bigint`

```ts
let big: bigint = 100n;
let num: number = 6;
big = num //Type 'number' is not assignable to type 'bigint'.(2322)
num = big //Type 'bigint' is not assignable to type 'number'.(2322)
```

### `null`和`undefined`

::: warning 前置条件
在`tsconfig.json`指定`"strictNullChecks": false`
:::

`strictNullChecks`为`false`的情况下，`null`和`undefined`是所有类型的子类型。也就是说你也可以把`null`和`undefined`赋值给任意类型。

```ts
// null和undefined赋值给string
let str: string = 'hi'
str = null
str = undefined

// null和undefined赋值给number
let num:number = 520;
num = null
num= undefined

// null和undefined赋值给object
let obj:object ={};
obj = null
obj= undefined

// null和undefined赋值给Symbol
let sym: symbol = Symbol("me"); 
sym = null
sym= undefined

// null和undefined赋值给boolean
let isDone: boolean = false;
isDone = null
isDone= undefined

// null和undefined赋值给bigint
let big: bigint =  100n;
big = null
big= undefined
```

如果你在`tsconfig.json`指定`"strictNullChecks": true`:

* `null`只能赋值给`any`和`null`
* `undefined`能赋值给`any`、`void`和`undefined`

```ts
let val1: void;
let val2: null = null;
let val3: undefined = undefined;
let val4: void;
let val5: any = null
let val6: any = undefined

val1 = val2; //Type 'null' is not assignable to type 'void'.(2322)
val1 = val3;
val1 = val4;
```

## void

void表示没有任何类型，和其他类型是平等关系，不能直接赋值：

```ts
let a: void; 
let b: number = a; //Type 'void' is not assignable to type 'number'.(2322)
```

在`tsconfig.json`指定`"strictNullChecks": false`，只能将`null`和`undefined`赋值给`void`类型的变量。

```ts
let void1: void;
let null1: null = null;
let undefined1: undefined = undefined;

void1 = null1;
void1 = undefined1;
```

::: tip
方法没有返回值将得到`undefined`， 但是我们需要定义成void类型，而不是`undefined`类型。
:::

```ts
// A function whose declared type is neither 'void' nor 'any' must return a value.
function add(): undefined {
    console.log('hello')
}
```

## any

在 `TypeScript` 中，任何类型都可以被归为 `any` 类型。这让 `any` 类型成为了类型系统的顶级类型.

如果是一个 `number` 类型，在赋值过程中改变类型是不被允许的：

```ts
let tsNumber: number = 123
tsNumber = '123'
```

但如果是 `any` 类型，则允许被赋值为任意类型。

```ts
let a: any = 666;
a = "Semlinker";
a = false;
a = 66
a = undefined
a = null
a = []
a = {}
```

如果我们定义了一个变量，没有指定其类型，也没有初始化，那么它默认为`any`类型：

```ts
// 以下代码是正确的，编译成功
let value
value = 520
value = '520'
```

## never

### `never` 类型表示的是那些永不存在的值的类型

值会永不存在的两种情况：

* 如果一个函数执行时抛出了异常，那么这个函数永远不存在返回值（因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即，具有不可达的终点，也就永不存在返回了）；
* 函数中执行无限循环的代码（死循环），使得程序永远无法运行到函数返回值那一步，永不存在返回。

```ts
function err(msg: string): never { // OK
  throw new Error(msg); 
  let run = '永远执行不到'
}

// 死循环
function loopForever(): never { // OK
  while (true) {
  };
  let run = '永远执行不到'
} 
```

### `never` 类型不是任何类型的子类型，也不能赋值给任何类型

在 `TypeScript` 中，可以利用 `never` 类型的特性来实现全面性检查，具体示例如下：

```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

::: tip
注意在 `else` 分支里面，我们把收窄为 `never` 的 `foo` 赋值给一个显示声明的 `never` 变量。如果一切逻辑正确，那么这里应该能够编译通过。
:::

但是假如后来有一天修改了 `Foo` 的类型：

```ts
type Foo = string | number | boolean;
```

然而忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 `else` 分支的 `foo` 类型会被收窄为 `boolean` 类型，导致无法赋值给 `never` 类型，这时就会产生一个编译错误。

::: tip 我们可以得出一个结论：
使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。
:::

::: warning 注意
如果一个联合类型中存在`never`，那么实际的联合类型并不会包含`never`。
:::

```ts
// 'name' | 'age'
type test = 'name' | 'age' | never
```

## unknown

就像所有类型都可以被归为 `any`，所有类型也都可以被归为 `unknown`。这使得 `unknown` 成为 `TypeScript` 类型系统的另一种顶级类型（另一种是 `any`）。

::: tip unknown与any的最大区别是：
任何类型的值可以赋值给`any`，同时`any`类型的值也可以赋值给任何类型。

任何类型的值都可以赋值给`unknown` ，但`unknown` 只能赋值给`unknown`和`any`。
:::

```ts
let notSure: unknown = 4
let unk: unknown = true
let sure: any = 'hh'
sure = notSure
notSure = sure
notSure = unk
notSure = 'heel'
notSure = Symbol()
notSure = {}
notSure = []
let num: void
num = notSure //Type 'unknown' is not assignable to type 'void'.(2322)
```

如果不缩小类型，就无法对`unknown`类型执行任何操作：

```ts
function getDog() {
 return '123'
}
 
const dog: unknown = {hello: getDog};
dog.hello(); // Object is of type 'unknown'.(2571)
```

这是 `unknown` 类型的主要价值主张：`TypeScript` 不允许我们对类型为 `unknown` 的值执行任意操作。相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。

这种机制起到了很强的预防性，更安全，这就要求我们必须缩小类型，我们可以使用`typeof`、`instanceof`、类型断言等方式来缩小未知范围：

```ts
function getDogName() {
 let x: unknown;
 return x;
};
const dogName = getDogName();
// 直接使用
const upName = dogName.toLowerCase(); // Error
// typeof
if (typeof dogName === 'string') {
  const upName = dogName.toLowerCase(); // OK
}
// 类型断言 
const upName = (dogName as string).toLowerCase(); // OK
```

## Array

对数组的定义有两种：

* 类型＋[]

```ts
let arr:string[] = ['hello', 'world']
```

* 泛型

```ts
let arr2: Array<string> = ['hello','world']
```

---

定义联合类型的数组

```ts
let arr: (number | string)[];
arr = [0,'hi', 1, 'world']
```
在数组中不仅可以存储基础数据类型，还可以存储对象类型，如果需要存储对象类型，可以用如下方式进行定义：

```ts
// 只允许存储对象仅有name和age，且name为string类型，age为number类型的对象
let objArray: ({ name: string, age: number })[] = [
  { name: 'AAA', age: 23 }
]
```

对象类型可以使用`interface`定义

```ts
interface ObjArray {
  name: string;
  age: number
}

// 对象+[]的写法
let objArray: ObjArray[] = [
  { name: 'AAA', age: 23 }
]
// 泛型的写法
let objArray: Array<ObjArray> = [
  { name: 'AAA', age: 23 }
]
```

为了更加方便的撰写代码，我们可以使用类型别名的方式来管理以上类型：

```ts
type ObjArray = {
  name: string;
  age: number
}

// 对象+[]的写法
let objArray: ObjArray[] = [
  { name: 'AAA', age: 23 }
]
// 泛型的写法
let objArray: Array<ObjArray> = [
  { name: 'AAA', age: 23 }
]
```

## Tuple(元组)

众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用**元组**。在 JavaScript 中是没有元组的，元组是 `TypeScript` 中特有的类型，其工作方式类似于数组。

元组最重要的特性是可以限制 数组元素的个数和类型 ，它特别适合用来实现多值返回。

元组用于保存**定长定数据类型**的数据

```ts
let x: [string, number]; 
// 类型必须匹配且个数必须为2

x = ['hello', 10]; // OK 
x = ['hello', 10,10]; // Error 
x = [10, 'hello']; // Error
```

::: warning
元组类型只能表示一个已知元素数量和类型的数组，长度已指定，越界访问会提示错误。如果一个数组中可能有多种类型，数量和类型都不确定，那就直接`any[]`。
:::

### 元组类型的解构赋值

我们可以通过下标的方式来访问元组中的元素，当元组中的元素较多时，这种方式并不是那么便捷。其实元组也是支持解构赋值的：

```ts
let tupleArr: [number, string] = [666, "Picker"];
let [id, username] = tupleArr;
console.log(id); //666
console.log(username); //Picker

let tupleArr: [number, string] = [666, "Picker"];
let [id, username, age] = tupleArr; //Error
```

::: warning
在解构赋值时，如果解构数组元素的个数超过元组中元素的个数，会报错。
:::

### 元组类型的可选元素

```ts
let tupleArr: [string, boolean?];
tupleArr = ['hi', true]
tupleArr = ['hi']
```

## 函数

在JavaScript中，定义函数有三种表现形式：

* 函数声明
* 函数表达式
* 箭头函数

```js
// 函数声明
function func1 () {
  console.log('Hello, Picker')
}
// 函数表达式
const func2 = function () {
  console.log('Hello, Picker')
}
// 箭头函数
const func3 = () => {
  console.log('Hello, Picker')
}
```

如果函数有参数，则必须在 `TypeScript` 中为其定义具体的类型：

```ts
function sum(a: number, b:number): number {
  return a + b
}
console.log(sum(1, 2))    // 输出3
console.log(sum(1, '2'))  // 报错
```ts

### 用接口定义函数类型

```ts
interface SumType {
  (x: number, y: number): number
}
const sum: SumType = function (x: number, y: number): number {
  return x + y
}
console.log(sum(1, 2))    // 输出3
```ts

采用函数表达式接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数的个数、参数类型、返回值类型不变。

```ts
sum = function (a: number, b: number): number {
  return a + b
}
```

### 可选参数

```ts
function familyName(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName;
  }
}

console.log(familyName('Picker', 'R')) //Picker R
console.log(familyName('Picker')) //Picker
```

::: tip
可选参数必须放在最后一个位置，否则会报错。
:::

```ts
// 编辑报错 
function buildName(firstName: string, lastName?: string, _abc: number) {
  if (lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName;
  }
}
```

在 `JavaScript` 中，函数允许我们给参数设置默认值，因此另外一种处理可选参数的方式是: 为参数提供一个默认值，此时 `TypeScript` 将会把该参数识别为可选参数：

```ts
function getArea (a: number, b: number = 1): number {
  return  a * b
}
console.log(getArea(4))     // 4
console.log(getArea(4, 5))  // 20
```

::: tip
给一个参数设置了默认值后，就不再受 `TypeScript` 可选参数必须在最后一个位置的限制了。
:::

```ts
function getArea (b: number = 1, a: number): number {
  return  a * b
}
// 此时必须显示的传递一个undefined进行占位
console.log(getArea(undefined,4)) // 4
console.log(getArea(4, 5))        // 20
```

### 剩余参数

```ts
function push(array: Array<number>, ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let arr = [0];
push(arr, 1, 2, 3);
console.log(arr) //[0, 1, 2, 3] 
```

## 函数重载

函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

由于 `JavaScript` 是一个动态语言，我们通常会使用不同类型的参数来调用同一个函数，该函数会根据不同的参数而返回不同的类型的调用结果：

```ts
function add(x, y) {
 return x + y;
}
add(1, 2); // 3
add("1", "2"); //"12"
```

由于 `TypeScript` 是 `JavaScript` 的超集，因此以上的代码可以直接在 `TypeScript` 中使用，但当 `tsconfig.json` 中指定 `"noImplicitAny": true` 的配时，以上代码会提示以下错误信息：

```ts
Parameter 'x' implicitly has an 'any' type.
Parameter 'y' implicitly has an 'any' type.
```

该信息告诉我们参数 `x` 和参数 `y` 隐式具有 `any` 类型。为了解决这个问题，我们可以为参数设置一个类型。因为我们希望 `add` 函数同时支持 `string` 和 `number` 类型，因此我们可以定义一个 `string` | `number` 联合类型，同时我们为该联合类型取个别名：

```ts
type Combinable = string | number;
```

在定义完 `Combinable` 联合类型后，我们来更新一下 `add` 函数：

```ts
type Combinable = string | number;
function add(x:Combinable, y: Combinable): Combinable {
  if(typeof x === 'number' && typeof y === "number") {
    return x + y;
  }
  return String(x) + String(y)

}
console.log(add(1, 2)) // 3
console.log(add("1", "2")) //"12"
```

为 `add` 函数的参数显式设置类型之后，之前错误的提示消息就消失了。那么此时的 `add` 函数就完美了么，我们来实际测试一下：

```ts
const result = add('Semlinker', ' Kakuqo');
result.split(' ');
```

在上面代码中，我们分别使用 `Semlinker` 和 `Kakuqo` 这两个字符串作为参数调用 `add` 函数，并把调用结果保存到一个名为 `result` 的变量上，这时候我们想当然的认为此时 `result` 的变量的类型为 `string`，所以我们就可以正常调用字符串对象上的 `split` 方法。但这时 `TypeScript` 编译器又出现以下错误信息了：

```ts
Property 'split' does not exist on type 'number'.
```

很明显 `number` 类型的对象上并不存在 `split` 属性。问题又来了，那如何解决呢？这时我们就可以利用 `TypeScript` 提供的函数重载特性。

```ts
type Combinable = string | number;
// 函数声明
function add(a: number,b: number):number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;

//函数实现
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
const result = add('Semlinker', ' Kakuqo');
console.log(result.split(' ')) //["Semlinker", "Kakuqo"] 
```

::: tip
在有函数重载时，会优先从第一个进行逐一匹配，因此如果重载函数有包含关系，应该将最精准的函数定义写在最前面。
:::
