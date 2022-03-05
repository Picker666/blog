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
