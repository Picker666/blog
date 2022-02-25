# TypeScript 进阶

## 类型拓宽（Type Widening）

::: tip
所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性

如果满足指定了**初始值且未显式添加类型**注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型

这就是**字面量类型拓宽**
:::

### 字面量类型扩宽

```ts
// 1、变量未显式声明类型注解，
// "strictNullChecks": true, 类型为 string,
// "strictNullChecks": false, 类型为 string | undefined | null
let str = 'picker666'; // 类型是 string， 

// 2、形参未显式声明类型注解，
// "strictNullChecks": true, 类型为 string | undefined,
// "strictNullChecks": false, 类型为 string | undefined | null
let strFun = (name = 'picker666') => name; // 类型是 (str?: string) => string;

// 3、常量不可变更，类型没有拓宽, specifiedStr 的类型是 'this is string' 字面量类型
const specifiedStr = 'hello Picker' // 'hello Picker'

// 4、因为赋予的值 specifiedStr 的类型是字面量类型，且没有显式类型注解，所以变量、形参的类型也被拓宽了
const name = 'picker';
let anotherName = name; // string
let strFun2 = (str = anotherName) => str; // 类型是 (str?: string) => string;
```

基于字面量类型拓宽的条件，我们可以通过如下所示代码添加显示类型注解控制类型拓宽行为。

```ts
// 5、const 显示声明 的常量 赋值给let 变量，该变量将是字面量类型，并不存在类型扩宽
const name: 'picker' = 'picker'; // 类型是 'picker'
let anotherName = name; // 类型是 'picker'
anotherName = 'picker666'; // 不能将类型“"picker666"”分配给类型“"picker"”。

let names: 'picker666' = 'picker666'; // 6，类型是picker666
```

#### 总结（字面量类型）

* 未显式声明类型注解
  * let，var 定义的变量 **存在类型扩宽**（1，2）
  * const 定义的变量 **没有类型扩宽**（3）
  * `const 定义的常量 赋值给let 变量，该变量`**存在类型扩宽**（4）
* 显示声明类型注解
  * const 显示声明的常量赋值给let 变量，该变量将是字面量类型，**不存在类型扩宽**（5）
  * let，var可显式声明变量，**不存在类型扩宽**（6）

### null 和 undefined 的类型进行拓宽

通过 let、var 定义的变量如果满足未显式声明类型注解且被赋予了 null 或 undefined 值，则推断出这些变量的类型是 any：

```ts
// 7、未显式声明，类型扩宽为any
let x = null; // 类型拓宽成 any
let y = undefined; // 类型拓宽成 any

// 8、未显式声明，类型为 null/undefined
const z = null; // 类型是 null
const w = undefined; // 类型是 undefined

// 9、未显式声明的let变量，被赋值未显式声明的const 变量，类型未扩宽
let anyFun = (param = null) => param; // 形参类型是 null // let anyFun: (param?: null) => null
let z2 = z; // 类型是 null

// 10、未显式声明的let变量，被赋值未显式声明的 let 变量，类型未扩宽
let x2 = x; // 类型是 null
let y2 = y; // 类型是 undefined

// 11、未显式声明的let变量，被赋值显式声明的 const/let 变量，类型未扩宽
const nul: null = null; // null
let nul2 = nul; // null
let nul1: null = null;
let nul11 = nul1; //null
```

#### 总结（null 和 undefined）

* 未显式声明类型的 let，var 变量， 类型被**扩宽为 any**(7)
* 未显式声明类型的 const 变量，类型为 null/undefined，**类型未扩宽**(8)
* `未显式声明类型的 let 变量，被赋值未显式声明的 let 变量，`**类型未扩宽**(9)
* 未显式声明的 let 变量，被赋值显式声明的 const/let 变量，**类型未扩宽**(10,11)

::: warning 注意
在严格模式下，一些比较老的版本中（2.0）null 和 undefined 并不会被拓宽成“any”
:::

我们举个例子,更加深入的分析一下:

* 类型扩宽带来的问题

```ts
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

function getComponent(vector: Vector3, axis: "x" | "y" | "z") {
  return vector[axis];
}

let x = "x";
let vec = { x: 10, y: 20, z: 30 };
// 类型“string”的参数不能赋给类型“"x" | "y" | "z"”的参数。
getComponent(vec, x); // Error
```

为什么会出现上述错误呢？通过 TypeScript 的错误提示消息，我们知道是因为变量 x 的类型被推断为 string 类型，而 getComponent 函数期望它的第二个参数有一个更具体的类型。这在实际场合中被拓宽了，所以导致了一个错误。

这个过程是复杂的，因为对于任何给定的值都有许多可能的类型。例如：

```ts
const arr = ['x', 1];
```

* ('x' | 1)[]
* ['x', 1]
* [string, number]
* readonly [string, number]
* (string | number)[]
* readonly (string|number)[]
* [any, any]
* any[]

没有更多的上下文，TypeScript 无法知道哪种类型是 “正确的”，它必须猜测你的意图。尽管 TypeScript 很聪明，但它无法读懂你的心思。它不能保证 100% 正确，正如我们刚才看到的那样的疏忽性错误。

* 在下面的例子中，变量 x 的类型被推断为字符串，因为 TypeScript 允许这样的代码：

```ts
let x = 'picker';
x = 'picker6';
x = 'picker666';
```

对于 JavaScript 来说，以下代码也是合法的：

```js
let x = 'x';
x = /x|y|z/;
x = ['x', 'y', 'z'];
```

在推断 x 的类型为字符串时，TypeScript 试图在特殊性和灵活性之间取得平衡。一般规则是，变量的类型在声明之后不应该改变，*因此 string 比 string|RegExp 或 string|string[] 或任何字符串更有意义*

* TypeScript 提供了一些控制拓宽过程的方法。其中一种方法是使用 `const`。如果用 const 而不是 let 声明一个变量，那么它的类型会更窄。事实上，使用 const 可以帮助我们修复前面例子中的错误：

```ts
const x = "x"; // type is "x" 
let vec = { x: 10, y: 20, z: 30 };
getComponent(vec, x); // OK
```

因为 x 不能重新赋值，所以 TypeScript 可以推断更窄的类型，就不会在后续赋值中出现错误。因为字符串字面量型 “x” 可以赋值给  "x"|"y"|"z"，所以代码会通过类型检查器的检查。

* const 也存在弊端，对于对象和数组，仍然会存在问题

在 JavaScript 中是没有问题的

```js
const obj = { 
  x: 1,
}; 

obj.x = 6; 
obj.x = '6';

obj.y = 8;
obj.name = 'picker';
```

而在 TypeScript 中，对于 obj 的类型来说，
  它可以是 {readonly x：1} 类型，

  或者是更通用的 {x：number} 类型。

  当然也可能是 {[key: string]: number}

  object 类型。

对于对象，TypeScript 的拓宽算法会将其内部属性视为将其赋值给 let 关键字声明的变量，进而来推断其属性的类型。因此 obj 的类型为 {x：number} 。这使得你可以将 obj.x 赋值给其他 number 类型的变量，而不是 string 类型的变量，并且它还会阻止你添加其他属性。

最后三行的语句会出现错误：

```ts
const obj = { 
  x: 1,
};

obj.x = 6; // OK 


// Type '"6"' is not assignable to type 'number'.
obj.x = '6'; // Error

// Property 'y' does not exist on type '{ x: number; }'.
obj.y = 8; // Error

// Property 'name' does not exist on type '{ x: number; }'.
obj.name = 'picker'; // Error
```

TypeScript 试图在具体性和灵活性之间取得平衡。它需要推断一个足够具体的类型来捕获错误，但又不能推断出错误的类型。它通过属性的初始化值来推断属性的类型，当然有几种方法可以覆盖 TypeScript 的默认行为。一种是提供显式类型注释：

```ts
// Type is { x: 1 | 3 | 5; }
const obj: { x: 1 | 3 | 5 } = {
  x: 1 
};
```

另一种方法是使用 const 断言。不要将其与 let 和 const 混淆，后者在值空间中引入符号。这是一个纯粹的类型级构造。让我们来看看以下变量的不同推断类型：

```ts
// Type is { x: number; y: number; }
const obj1 = { 
  x: 1, 
  y: 2 
}; 

// Type is { x: 1; y: number; }
const obj2 = {
  x: 1 as const,
  y: 2,
}; 

// Type is { readonly x: 1; readonly y: 2; }
const obj3 = {
  x: 1, 
  y: 2 
} as const;
```

当你在一个值之后使用 const 断言时，TypeScript 将为它推断出最窄的类型，没有拓宽。对于真正的常量，这通常是你想要的。当然你也可以对数组使用 const 断言

```ts
// Type is number[]
const arr1 = [1, 2, 3]; 

// Type is readonly [1, 2, 3]
const arr2 = [1, 2, 3] as const;
```

## 类型缩小(Type Narrowing)

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

* 使用类型守卫（后面会讲到）将函数参数的类型从 any 缩小到明确的类型，具体示例如下：

```ts
let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else if (typeof anything === 'number') {
      return anything; // 类型是 number
    }
    return null;
  };
```

* 使用类型守卫将联合类型缩小到明确的子类型:

```ts
let func = (anything: string | number) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else {
      return anything; // 类型是 number
    }
  };
```

* 通过字面量类型等值判断（===）或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型，如下代码所示：

```ts
type Goods = 'pen' | 'pencil' |'ruler';
  const getPenCost = (item: 'pen') => 2;
  const getPencilCost = (item: 'pencil') => 4;
  const getRulerCost = (item: 'ruler') => 6;
  const getCost = (item: Goods) =>  {
    if (item === 'pen') {
      return getPenCost(item); // item => 'pen'
    } else if (item === 'pencil') {
      return getPencilCost(item); // item => 'pencil'
    } else {
      return getRulerCost(item); // item => 'ruler'
    }
  }
```

`getCost` 函数中，接受的参数类型是字面量类型的联合类型，函数内包含了 if 语句的 3 个流程分支，其中每个流程分支调用的函数的参数都是具体独立的字面量类型。

为什么类型由多个字面量组成的变量 item 可以传值给仅接收单一特定字面量类型的函数?

因为在每个流程分支中，编译器知道流程分支中的 item 类型是什么。比如 `item === 'pencil'` 的分支，item 的类型就被收缩为`“pencil”`。

事实上，如果我们将上面的示例去掉中间的流程分支，编译器也可以推断出收敛后的类型，如下代码所示：

```ts
const getCost = (item: Goods) =>  {
    if (item === 'pen') {
      item; // item => 'pen'
    } else {
      item; // => 'pencil' | 'ruler'
    }
  }
```

* 使用typeof来实现类型缩小

::: warning 注意
一般来说 `TypeScript` 非常擅长通过条件来判别类型，但在处理一些特殊值时要特别注意

它可能包含你不想要的东西！
:::

例如，以下从联合类型中排除 null 的方法是错误的：

```ts
const el = document.getElementById("foo"); // Type is HTMLElement | null
if (typeof el === "object") {
  el; // Type is HTMLElement | null
}
```

::: tip
在 JavaScript 中 typeof null 的结果是 "object"
:::

falsy 的原始值也会产生类似的问题：

```rs
function foo(x?: number | string | null) {
  if (!x) {
    x; // Type is string | number | null | undefined
  }
}
```

空字符串和 0 都属于 falsy 值，所以在分支中 x 的类型可能是 string 或 number 类型

* 在它们上放置一个明确的 “标签”

```ts
interface UploadEvent {
  type: "upload";
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: "download";
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case "download":
      e; // Type is DownloadEvent 
      break;
    case "upload":
      e; // Type is UploadEvent 
      break;
  }
}
```

这种模式也被称为 ”标签联合“ 或 ”可辨识联合“，它在 TypeScript 中的应用范围非常广。
