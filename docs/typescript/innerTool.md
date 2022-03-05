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
