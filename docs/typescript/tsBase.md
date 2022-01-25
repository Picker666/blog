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
