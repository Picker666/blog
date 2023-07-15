# type 和 interface 的区别

## 介绍

interface只能定义对象、方法 的 数据结构类型;

type 可以定人任何数据（对象、方法、数组、基本类型、枚举...）的类型;

type 声明的算是**类型别名**，而 interface 声明的是一个**新类型**。

```ts
interface Point {
    x: number;
    y: number;
}
// 或者
type Point = {
    x: number;
    y: number;
};

// ===================

interface func {
  (x: number, y: number): void;
}
// 或者
type Function = (x: number, y: number): void;
```

## 相同点

* 1、都可以用来描述一个对象或者函数

  例子如上。

* 2、都允许扩展

```ts
// interface 扩展 interface
interface Name {
  name: string;
}

interface Info extends Name {
  age:number
}

// interface 扩展 type
type Name  = {
  name: string;
}

interface Info extends Name {
  age:number
}

// type 扩展 type
type Name  = {
  name: string;
}

type Info = Name & {age: number}

// type 扩展 interface
interface Name {
  name: string;
}

type Info = Name & {age: number}
```

区别是，**interface使用关键字extends扩展，type使用&符号连接**

### 实现 implements

类可以实现interface 以及 type(除联合类型外)

```js
interface ICat{
    setName(name:string): void;
}

class Cat implements ICat{
    setName(name:string):void{
        // todo
    }
}

// type 
type ICat = {
    setName(name:string): void;
}

class Cat implements ICat{
    setName(name:string):void{
        // todo
    }
}
```

上面提到了特殊情况，类无法实现联合类型, 是什么意思呢？

```js
type Person = { name: string; } | { setName(name:string): void };

// 无法对联合类型Person进行实现
// error: A class can only implement an object type or intersection of object types with statically known members.
class Student implements Person {
  name= "张三";
  setName(name:string):void{
        // todo
    }
}
```

## 不同之处

* 1、用法不一样

```ts

```

* 2、interface支持声明合并

interface 重名了会合并属性。

```js
interface Info {
  name: string;
}

interface Info {
  age: number;
}

// 实际上的接口Info是
{
  name: string;
  age: number;
}
```

* 3、type不但可以声明基本类型别名，除此之外还可以声明**联合类型**、**交叉类型**、**元祖**等类型

```ts
// 基本类型别名
type Name = string;

// 联合类型
type Name = string;
type Age = number;
type Info =  Name | Age

// 元祖类型
type Name = string;
type Age = number;
type Info =  [Name , Age]
```

* 4、type的其它用法

```ts
// 泛型变量
type Callback<T> = (data: T) => void;  
// Pair是一个泛型变量
type Pair<T> = [T, T]; 
// 下面这个就相当于type Coordinates = [number, number]; Coordinates是一个接受number参数类型的数组
type Coordinates = Pair<number>; 

```

[](https://juejin.cn/post/7072945053936648200#heading-5)
