# Typescript 内置工具类型

## Partial

`Partial<T>` 表示将某个类型里的属性全部变为可选项。

用法：

```ts
type Person = {
  name: string;
  age?: number;
}

type PartialResult = Partial<Person> // { name?: string | undefined; age?: number | undefined }
```

代码实现：

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}

type PartialResult = MyPartial<Person> // { name?: string | undefined; age?: number | undefined }
```

## Required

`Required<T>` 表示将某个类型里的属性全部变为必填项。

```ts
type Person = {
  name: string;
  age?: number;
}

type PartialResult = Required<Person> // { name: string; age: number }
```

代码实现：

```ts
type MyPartial<T> = {
  [P in keyof T]-?: T[P]
}

type PartialResult = MyRequired<Person> // { name: string; age: number }
```

## Readonly

`Readonly<T>` 表示将某个类型中的所有属性变为只读属性，也就意味着这些属性不能被重新赋值。

用法：

```ts
interface Todo {
  title: string
  description: string
}

const todo: Readonly<Todo> = {
  title: "Hey",
  description: "foobar"
}
```

代码实现：

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = '改名' // Cannot assign to 'title' because it is a read-only property.(2540)
todo.description = '改不了嘿嘿' // Cannot assign to 'description' because it is a read-only property.(2540)
```

## Pick

`Pick<T, K extends keyof T>` 表示从某个类型中选取一些属性出来。

用法：

```ts
interface Todo {
    title: string
    description: string
    completed: boolean
}

type TodoPreview = Pick<Todo, 'title' | 'completed'> // { title: string, completed: boolean }
```

代码实现：

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
```

代码详解：

`K extends keyof T`：表示 K 只能是 keyof T 的子类型，如果我们在使用 Pick 时，传递了一个不存在 T 类型的字段，会报错：

```ts
// Type '"title" | "phone"' does not satisfy the constraint 'keyof Todo'.
// Type '"phone"' is not assignable to type 'keyof Todo'.(2344)
type AAA = Pick<Todo, 'title' | 'phone'>
```

## Record

`Record<K, T>`表示迭代联合类型K，将每个属性名作为key，T作为属性值组合成一个新的类型。

用法：

```ts
type Person = {
  name: string;
  age: number
}
type Student = 'tom' | 'tony'

type result = Record<Student, Person> // {tom: Person, tony: Person}
```

代码实现：

```ts
type MyRecord<K extends string | number | symbol, T> = {
  [P in K]: T
}

type result = MyRecord<Student, Person> // {tom: Person, tony: Person}
```

## ReturnType

`ReturnType<T>` 用来获取函数返回值的类型

用法： 

```ts
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}
type a = ReturnType<typeof fn> // 1 | 2
```

代码实现：

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never
```

## Exclude

`Exclude<T, U>`表示从联合类型T中排除U的类型成员，可以理解为取T中，U没有的类型。

用法：

```ts
type union = 'you' | 'and' | 'me'
// 'you' | 'and'
type result = Exclude<union, 'me'>
```

代码实现：

```ts
type MyExclude<T, U> = T extends U ? never : T
// 'you' | 'and'
type result = MyExclude<union, 'me'>
```

代码详解: 

`T extends U`：这段代码会从T的子类型开始分发

```ts
T extends U
=> 'you' | 'and' | 'me' extends 'me'
=> (
	'you' extends 'me' ? never : 'you' | 
	'and' extends 'me' ? never : 'and' | 
	'me' extends 'me' ? never : 'me'
)
=> 'you' | 'and'
```

## Extract

`Extract<T, U>`表示用来取联合类型 T 和 U 的交集。

用法：

```ts
type Person = {
  name: string;
  age: number;
  address: string;
}
// 结果：'age'|'address'
type ExtractResult = Extract<keyof Person, 'age'|'address'|'sex'>
```

代码实现：

```ts
type MyExtract<T, U> = T extends U ? T : never
```

代码详解：

`T extends U`：此代码会自动将T的子类型进行分发，例如：

```ts
T extends U
=> 'name'|'age'|'address' extends 'age'|'address'|'sex' ? T : never
=> (
  'name' extends 'age'|'address'|'sex' ? 'name' : never |
  'age' extends 'age'|'address'|'sex' ? 'age' : never |
  'address' extends 'age'|'address'|'address' ? 'age' : never
)
=> 'age'|'address'
```

## Omit

`Omit<T, U>`表示从T类型中剔除U类型包含的字段。

用法：

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}
// { completed: boolean }
type TodoPreview = Omit<Todo, 'description' | 'title'>
```

代码实现：

```ts
type MyOmit<T,K extends keyof T> = {
  [P in Exclude<keyof T, K> ]: T[P]
}
```

代码详解：

`Exclude<keyof T, K>` 取 T 类型和 K 类型的差集。

## NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 null 及 undefined 类型

用法：

```ts
type NonNullable<T> = T extendsnull | undefined ? never : T;
```

举例说明

```ts
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```
