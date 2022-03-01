# TypeScript 进阶（二）

## 接口（Interfaces）

**接口**：在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

TypeScript 中的接口是一个非常灵活的概念，除了可用于 对类的一部分行为进行抽象 以外，也常用于对「对象的形状（Shape）」进行描述。

### 例子

```ts
interface Person {
    name: string;
    age: number;
}
let picker: Person = {
    name: 'Tom',
    age: 25
};
```

上面的例子中，我们定义了一个接口 Person，接着定义了一个变量 picker，它的类型是 Person。这样，我们就约束了 picker 的形状必须和接口 Person 一致。

::: tip
接口一般首字母大写。
:::

* 定义的变量比接口少了一些属性是不允许的：

```ts
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Picker'
};

// index.ts(6,5): error TS2322: Type '{ name: string; }' is not assignable to type 'Person'.
//   Property 'age' is missing in type '{ name: string; }'.
```

* 多一些属性也是不允许的：

```ts
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Picker',
    age: 25,
    gender: 'male'
};

// index.ts(9,5): error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

::: warning
赋值的时候，变量的形状必须和接口的形状保持一致
:::

### 可选 和 只读属性

```ts
interface Person {
  readonly name: string;
  age?: number;
}
```

只读属性用于限制只能在对象刚刚创建的时候修改其值。此外 `TypeScript` 还提供了 `ReadonlyArray<T>` 类型，它与 `Array<T>` 相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改。

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error! 类型“readonly number[]”中的索引签名仅允许读取。
ro.push(5); // error! 类型“readonly number[]”上不存在属性“push”。
ro.length = 100; // error! 无法分配到 "length" ，因为它是只读属性。ts(2540)
a = ro; // error! 类型 "readonly number[]" 为 "readonly"，不能分配给可变类型 "number[]"。ts(4104)

let a1: number[] = [1, 2, 3, 4];
let ro1: Array<number> = a1;
ro1[0] = 12;
ro1.push(5);
ro1.length = 100;
a1 = ro1;
```

### 任意属性

有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 `索引签名` 的形式来满足上述要求

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
```

::: warning 注意
一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。
:::

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string; // string | number | undefined
}

let tom: Person = {
    name: 'Picker',
    age: 25,
    gender: 'male'
};
// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number | undefined ; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

上例中，任意属性的值允许是 string，但是可选属性 age 的值却是 number，number 不是 string 的子属性，所以报错了。

另外，在报错信息中可以看出，此时 { name: 'Picker', age: 25, gender: 'male' } 的类型被推断成了 { [x: string]: string | number | undefined ; name: string; age: number; gender: string; }，这是联合类型和接口的结合

### 绕开额外属性检查的方式

#### 鸭式辨型法

```ts
interface LabeledValue {
  label: string;
}
function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj); // OK

printLabel({ size: 10, label: "Size 10 Object" }); // Error
```

在参数里写对象就相当于是直接给labeledObj赋值，这个对象有严格的类型定义，所以不能多参或少参。

而当你在外面将该对象用另一个变量myObj接收，myObj不会经过额外属性检查，但会根据类型推论为let myObj: { size: number; label: string } = { size: 10, label: "Size 10 Object" };，然后将这个myObj再赋值给labeledObj，此时根据类型的兼容性，两种类型对象，参照鸭式辨型法，因为都具有label属性，所以被认定为两个相同，故而可以用此法来绕开多余的类型检查。

#### 类型断言

类型断言的意义就等同于你在告诉程序，你很清楚自己在做什么，此时程序自然就不会再进行额外的属性检查了。

```ts
interface Props { 
  name: string; 
  age: number; 
  money?: number;
}

let p: Props = {
  name: "Picker",
  age: 25,
  money: -100000,
  girl: false
} as Props; // OK
```

#### 索引签名

```ts
interface Props { 
  name: string; 
  age: number; 
  money?: number;
  [key: string]: any;
}

let p: Props = {
  name: "picker",
  age: 25,
  money: -100000,
  girl: false
}; // OK
```

## 接口与类型别名的区别

实际上，在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。

* TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 而接口的作用就是为这些类型命名和为你的代码或第三方代码定义数据模型。
* type(类型别名)会给一个类型起个新名字。 type 有时和 interface 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型。起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型。给基本类型起别名通常没什么用，尽管可以做为文档的一种形式使用。

### Objects / Functions

两者都可以用来描述对象或函数的类型，但是语法不同。

```ts
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}

type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

### Other Types

与接口不同，类型别名还可以用于其他类型，如基本类型（原始值）、联合类型、元组。

```ts
// primitive
type Name = string;

// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement('div');
type B = typeof div;
```

### 接口可以定义多次,类型别名不可以

与类型别名不同，接口可以定义多次，会被自动合并为单个接口。

```ts
interface Point { x: number; }
interface Point { y: number; }
const point: Point = { x: 1, y: 2 };
```

### 扩展

两者的扩展方式不同，但并不互斥。接口可以扩展类型别名，同理，类型别名也可以扩展接口。

接口的扩展就是继承，通过 `extends` 来实现。类型别名的扩展就是交叉类型，通过 `&` 来实现。

#### 接口扩展接口

```ts
interface PointX {
    x: number
}

interface Point extends PointX {
    y: number
}
```

#### 类型别名扩展类型别名

```ts
type PointX = {
    x: number
}

type Point = PointX & {
    y: number
}
```

#### 接口扩展类型别名

```ts
type PointX = {
    x: number
}
interface Point extends PointX {
    y: number
}
```

#### 类型别名扩展接口

```ts
interface PointX {
    x: number
}
type Point = PointX & {
    y: number
}
```

## 泛型

假如让你实现一个函数 identity，函数的参数可以是任何值，返回值就是将参数原样返回，并且其只能接受一个参数，你会怎么做？

```ts
const identity = (arg) => arg;
```

由于其可以接受任意值，也就是说你的函数的入参和返回值都应该可以是任意类型。 现在让我们给代码增加类型声明：

```ts
type idBoolean = (arg: boolean) => boolean;
type idNumber = (arg: number) => number;
type idString = (arg: string) => string;
...
```

虽然实现了，但是，上面的代码是不可以被优秀程序员接受的；

还有一种方式是使用 any 这种“万能语法”。缺点是什么呢？我举个例子：

```ts
identity("string").length; // ok
identity("string").toFixed(2); // ok
identity(null).toString(); // ok
...
```

很显然，这么实现不符合我们的预期。

为了解决上面的这些问题，我们使用泛型对上面的代码进行重构。和我们的定义不同，这里用了一个 类型 `T`，这个 `T` 是一个抽象类型，只有在调用的时候才确定它的值，这就不用我们复制粘贴无数份代码了。

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

其中 `T` 代表 `Type`，在定义泛型时通常用作第一个类型变量名称。但实际上 T 可以用任何有效名称代替。除了 `T`之外，以下是常见泛型变量代表的意思：

* K（Key）：表示对象中的键类型；
* V（Value）：表示对象中的值类型；
* E（Element）：表示元素类型。

其实并不是只能定义一个类型变量，我们可以引入希望定义的任何数量的类型变量。比如我们引入一个新的类型变量 `U`，用于扩展我们定义的 `identity` 函数：

```ts
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}
console.log(identity<Number, string>(68, "Semlinker"));
```

除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号，比如：

```ts
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}
console.log(identity(68, "Semlinker"));
```

对于上述代码，编译器足够聪明，能够知道我们的参数类型，并将它们赋值给 T 和 U，而不需要开发人员显式指定它们。

## 泛型约束

假如我想打印出参数的 size 属性呢？如果完全不进行约束 TS 是会报错的：

```ts
function trace<T>(arg: T): T {
  console.log(arg.size); // Error: Property 'size doesn't exist on type 'T'
  return arg;
}

function traceAny(arg: any): any {
  console.log(arg.size);
  return arg;
}
```

报错的原因在于 T 理论上是可以是任何类型的，

不同于 any，你不管使用它的什么属性或者方法都会报错（除非这个属性和方法是所有集合共有的）。那么直观的想法是限定传给 trace 函数的参数类型应该有 size 类型，这样就不会报错了。

如何去表达这个类型约束的点呢？

实现这个需求的关键在于使用类型约束。 使用 `extends` 关键字可以做到这一点。简单来说就是你定义一个类型，然后让 T 实现这个接口即可。

```ts
interface Sizeable {
  size: number;
}
function trace<T extends Sizeable>(arg: T): T {
  console.log(arg.size);
  return arg;
}
```

有的人可能说我直接将 Trace 的参数限定为 Sizeable 类型可以么？如果你这么做，会有类型丢失的风险。

---

假设想要拿到一组数据中，age最大的

```ts
function getOldest(items: Array<{ age: number }>) {
  return items.sort((a, b) => b.age - a.age)[0];
}

// 我们吧{age: number} 抽离出来
type HasAge = { age: number };
function getOldest(items: HasAge[]): HasAge {
  return items.sort((a, b) => b.age - a.age)[0];
}


const things = [{ age: 10 }, { age: 20 }, { age: 15 }];
const oldestThing = getOldest(things);

console.log(oldestThing.age); // 20 ✅
```

但是，如果所有筛选的数据具有更多属性？

```ts
type Person = { name: string, age: number};

const people: Person[] = [
  { name: 'Amir', age: 10 }, 
  { name: 'Betty', age: 20 }, 
  { name: 'Cecile', age: 15 }
 ];

const oldestPerson = getOldest(people); // 🙂 no type errors

console.log(oldestPerson.name); // ❌ type error: Property 'name' does not exist on type 'HasAge'.
```

当然，可以使用断言来实现

```ts
const oldestPerson = getOldest(people) as Person; // 🚩
console.log(oldestPerson.name); // no type error
```

如果使用`泛型`去解决呢？

```ts
function getOldest<T extends HasAge>(items: T[]): T {
  return items.sort((a, b) => b.age - a.age)[0];
}

const oldestPerson = getOldest(people); // ✅ type Person
```

Typescript 会推断 `oldestPerson` 的类型是 `Person`，所以可以拿到 `.name`;

再看一个例子

```ts
type Person = {name: string, age: number};
const people: Person[] = [
  { name: 'Picker', age: 10 }, 
  { name: 'Picker6', age: 20 }, 
  { name: 'Picker666', age: 15 }
 ];

type Bridge = {name: string, length: number, age: number};
const bridges = [
{ name: 'London Bridge', length: 269, age: 48 },
{ name: 'Tower Bridge', length: 244, age: 125 },
{ name: 'Westminster Bridge', length: 250, age: 269 }
]

const oldestPerson = getOldest(people); // type Person
const oldestBridge = getOldest(bridges); // type Bridge

console.log(oldestPerson.name); // 'Picker6' ✅
console.log(oldestBridge.length); // '250' ✅
```

## 泛型工具类型

为了方便开发者 TypeScript 内置了一些常用的工具类型，比如 Partial、Required、Readonly、Record 和 ReturnType 等。不过先看一下其它的工具类型。

### 1.typeof

typeof 的主要用途是在类型上下文中获取变量或者属性的类型，

```ts
interface Person {
  name: string;
  age: number;
}
const sem: Person = { name: "semlinker", age: 30 };
type Sem = typeof sem; // type Sem = Person
```

在上面代码中，我们通过 typeof 操作符获取 sem 变量的类型并赋值给 Sem 类型变量，之后我们就可以使用 Sem 类型：

```ts
const lolo: Sem = { name: "lolo", age: 5 }
```

你也可以对嵌套对象执行相同的操作

```ts
const Message = {
    name: "jimmy",
    age: 18,
    address: {
      province: '四川',
      city: '成都'   
    }
}
type message = typeof Message;
/*
 type message = {
    name: string;
    age: number;
    address: {
        province: string;
        city: string;
    };
}
*/
```

此外，`typeof` 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型，比如：

```ts
function toArray(x: number): Array<number> {
  return [x];
}
type Func = typeof toArray; // -> (x: number) => number[]
```

### 2、keyof

`keyof` 操作符是在 `TypeScript` 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```ts
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```

在 TypeScript 中支持两种索引签名，`数字索引`和`字符串索引`：

```ts
interface StringArray {
  // 字符串索引 -> keyof StringArray => string | number
  [index: string]: string; 
}

interface StringArray1 {
  // 数字索引 -> keyof StringArray1 => number
  [index: number]: string;
}
```

为了同时支持两种索引类型，就得要求数字索引的返回值必须是字符串索引返回值的子类。

其中的原因就是；当使用数值索引时，JavaScript 在执行索引操作时，会先把数值索引先转换为字符串索引。

所以 keyof { [x: string]: Person } 的结果会返回 string | number。

keyof也支持基本数据类型：

```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "toString" | "toFixed" | "toExponential" | ...
let K3: keyof symbol; // let K1: "valueOf"
```

#### keyof 的作用

JavaScript 是一种高度动态的语言。有时在静态类型系统中捕获某些操作的语义可能会很棘手。以一个简单的prop 函数为例：

```ts
function prop(obj: object, key: string) {
  return obj[key]; // error  元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。在类型 "{}" 上找不到具有类型为 "string" 的参数的索引签名。
}
```

当然可以使用暴力方式处理

```ts
function prop(obj: object, key: string) {
  return (obj as any)[key];
}
```

很明显该方案并不是一个好的方案，我们来回顾一下 prop 函数的作用，该函数用于获取某个对象中指定属性的属性值。因此我们期望用户输入的属性是对象上已存在的属性，那么如何限制属性名的范围呢？这时我们可以利用本文的主角 keyof 操作符：

```ts
function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

* 首先定义了 T 类型并使用 extends 关键字约束该类型必须是 object 类型的子类型，
* 然后使用 keyof 操作符获取 T 类型的所有键，其返回类型是联合类型，
* 最后利用 extends 关键字约束 K 类型必须为 keyof T 联合类型的子类型。

```ts
type Todo = {
  id: number;
  text: string;
  done: boolean;
}

const todo: Todo = {
  id: 1,
  text: "Learn TypeScript keyof",
  done: false
}

function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const id = prop(todo, "id"); // const id: number
const text = prop(todo, "text"); // const text: string
const done = prop(todo, "done"); // const done: boolean
const date = prop(todo, "date"); // 类型“"date"”的参数不能赋给类型“keyof Todo”的参数。 ts(2345)
```

很明显使用泛型，重新定义后的 prop<T extends object, K extends keyof T>(obj: T, key: K) 函数，已经可以正确地推导出指定键对应的类型。

### 3、in

in 用来遍历枚举类型：

type Keys = "a" | "b" | "c"

``ts
type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }

```

### 4、infer

在条件类型语句中，可以用 infer 声明一个类型变量并且对它进行使用。

```ts
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

以上代码中 infer R 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

#### 5、extends

有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型, 需要传入符合约束类型的值，必须包含length属性：

```ts
loggingIdentity(3);  // Error, number doesn't have a .length property
loggingIdentity({length: 10, value: 3});
```

## 索引类型

在对象中获取一些属性的值，然后建立对应的集合

```ts
let person = {
    name: 'musion',
    age: 35
}

function getValues(person: any, keys: string[]) {
    return keys.map(key => person[key])
}

console.log(getValues(person, ['name', 'age'])) // ['musion', 35]
console.log(getValues(person, ['gender'])) // [undefined]
```

在上述例子中，可以看到getValues(persion, ['gender'])打印出来的是[undefined]，但是ts编译器并没有给出报错信息，那么如何使用ts对这种模式进行类型约束呢？

```ts
let person = {
    name: "musion",
    age: 35,
  };

  function getValues(person: { name: string; age: number }, keys: ('name' | 'age')[]) {
    return keys.map((key) => person[key]);
  }

  console.log(getValues(person, ["name", "age"])); // ['musion', 35]
  console.log(getValues(person, ["gender"])); // 不能将类型“"gender"”分配给类型“"name" | "age"”。ts(2322)
```

但是不够灵活。

这里就要用到了索引类型,改造一下getValues函数，通过 `索引类型查询` 和 `索引访问` 操作符：

```ts
function getValues<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
  return keys.map(key => person[key]);
}

interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: 'musion',
    age: 35
}

getValues(person, ['name']) // ['musion']
getValues(person, ['gender']) // 报错：
// Argument of Type '"gender"[]' is not assignable to parameter of type '("name" | "age")[]'.
// Type "gender" is not assignable to type "name" | "age".
```

编译器会检查传入的值是否是Person的一部分。通过下面的概念来理解上面的代码：

::: tip
T[K]表示对象T的属性K所表示的类型，在上述例子中，T[K][] 表示变量T取属性K的值的数组
:::

```ts
// 通过[]索引类型访问操作符, 我们就能得到某个索引的类型
class Person {
    name:string;
    age:number;
 }
 type MyType = Person['name'];  //Person中name的类型为string type MyType = string
```

介绍完概念之后，应该就可以理解上面的代码了。首先看泛型，这里有T和K两种类型，根据类型推断，第一个参数person就是person，类型会被推断为Person。而第二个数组参数的类型推断（K extends keyof T），keyof关键字可以获取T，也就是Person的所有属性名，即['name', 'age']。而extends关键字让泛型K继承了Person的所有属性名，即['name', 'age']。这三个特性组合保证了代码的动态性和准确性，也让代码提示变得更加丰富了
