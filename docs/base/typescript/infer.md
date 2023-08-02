# Practices - infer

在搞明白infer的理解与使用前，先来看一下 `类型分发`;

## 类型分发

虽然他们关系不是太大，但是如果把infer与类型分发结合起来，可堪称完美。

至于**协变**与**逆变**等概念会比较容易让人搞混乱，可以以后再掌握。

先看一个基本的例子

```ts
interface Fish {
    fish: string
}
interface Water {
    water: string
}
interface Bird {
    bird: string
}
interface Sky {
    sky: string
}
//naked type
type Condition<T> = T extends Fish ? Water : Sky;
 
 
let condition1: Condition<Fish | Bird> = { water: '水' };
let condition2: Condition<Fish | Bird> = { sky: '天空' };
```

在 `condition1` 和 `condition2` 里定义的类型里所传的泛型与后面赋值的类型并不一样。也就是说，类型分发一般是用来**先知道已知类型**，赋的值的类型会基于这个分发进行判断**推出**相应类型。

当然，可以写一个联合类型实现：

```ts
let condition1: Water | Sky = { water: '水' };
let condition2: Water | Sky = { sky: '天空' };
```

上面那个例子没啥卵用，但是如果判断继承的也是泛型，那么就可以快速取出一些类型，而不用自己重新去定义：（虽然这些很多都是内置的）

```ts
type Diff<T, U> = T extends U ? never : T;
type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
 
type Filter<T, U> = T extends U ? T : never;
type R1 = Filter<string | number | boolean, number>; // number
```

## infer

infer大家应该都知道，returnType就是infer搞得，代码是这样：

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;

type E = ReturnType<() => void>; // void
type E = ReturnType<() => boolean>; // boolean
type E = ReturnType<() => string>; // string

const t0: T0 = [];
const t1: T1 = ["a"];
const t11: T1 = ["a", "3a"]; // 不能将类型“[string, string]”分配给类型“[s: string]”。源具有 2 个元素，但目标仅允许 1 个。ts(2322)
const t2: T2 = [""];
```

可以认为那也是个类型的分发。

这个parameter也是内置的，也是个类型分发，跟returnType区别就是infer X的占位跑到参数上去定义类型了。

如果我们把infer R换成已知类型，那么这个类型分发就跟一开始的demo没太大区别：

```ts
type Parameters<T> = T extends (...args:string[]) => any ? string[] : any;
type T0 = Parameters<() => string>; 
```

如果不换成已知类型，那么只写R不写infer会报错，因为不知道R是什么东西。

那么如果通过泛型传呢？可惜args必须是个数组类型，所以用泛型传还得限定下它的条件：

```ts
const t01: T01 = ["string", "string12"];
```

可以发现，这么传跟已知类型传其实没太大区别，因为在传第二个泛型的时候，这个类型我们是知道的，所以这种情况，也没什么太大用处，除非传泛型的是另一个人，那么我们在写这个库的时候，倒是可以拿到用户所定义的类型。这时倒是有点作用。???

这样一换就可以发现，infer可以在类型推导中去占任何位置，最后的推导的类型可以借助这之间所需的类型。可以看下这个例子加深理解:

```ts
type T1 = { name: string };
type T2 = { age: number };

type UnionToInterp<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type T3 = UnionToInterp<{ a: (x: T1) => void; b: (x: T2) => void }>; // T1 & T2
```

这个例子就是infer取得参数，两个函数的参数，对于为啥2个会出来交叉类型，这里是**协变**，所以是交叉类型

下面看一下更难点的[例子](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)

```ts
interface Action<T> {
    payload?: T;
    type: string;
  }
  
  class EffectModule {
    count = 1;
    message = "hello!";
  
    delay(input: Promise<number>) {
      return input.then(i => ({
        payload: `hello ${i}!`,
        type: 'delay'
      }));
    }
  
    setMessage(action: Action<Date>) {
      return {
        payload: action.payload!.getMilliseconds(),
        type: "set-message"
      };
    }
  }
  
  // 修改 Connect 的类型，让 connected 的类型变成预期的类型
  type Connect = (module: EffectModule) => any;
  
  const connect: Connect = m => ({
    delay: (input: number) => ({
      type: 'delay',
      payload: `hello 2`
    }),
    setMessage: (input: Date) => ({
      type: "set-message",
      payload: input.getMilliseconds()
    })
  });
  
  type Connected = {
    delay(input: number): Action<string>;
    setMessage(action: Date): Action<number>;
  };
  
  export const connected: Connected = connect(new EffectModule());
```

要求修改那个any，使其返回正确类型，而且这个类型要和connected一样。

有同学说，直接把any改成connected不就完了？要是这么简单也不会出这题。这个肯定是要你推出来，并且这个connected它的类型是EffectModule实例上的方法，里面的参数与返回还修改了。

这题怎么做呢，先一步步来，先提取出effectModule的方法，不然没法下一步。

提取class方法没有现成的，肯定不能keyof EffectModule，因为还有别的东西，怎么排除别的玩意呢？就是利用类型分发和class可以取值来做，如果是函数，那就提取，否则就不提取：

```ts
  type MethodName<T> = {[F in keyof T]:T[F] extends Function ? F:never}[keyof T]  type EE =  MethodName<EffectModule>
```

这里同时利用value如果是never 则keyof就不会返回。这段其实挺有启发性，因为很多时候，都想搞个循环判断类型，然后进行选择，这就是个很好的范例。

拿到了name然后要改装方法它需要：

```ts
asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>> asyncMethod<T, U>(input: T): Action<U> syncMethod<T, U>(action: Action<T>): Action<U>  syncMethod<T, U>(action: T): Action<U>
```

这个是题目给的，直接抄来：

```ts
type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>> type asyncMethodConnect<T, U> = (input: T) => Action<U> type syncMethod<T, U> = (action: Action<T>) => Action<U> type syncMethodConnect<T, U> = (action: T) => Action<U> 
```

然后需要做一个类型分发，用来判断是哪个方法，再分发给哪个方法：

```ts
type EffectMethodAssign<T> = T extends asyncMethod<infer U, infer V>      ? asyncMethodConnect<U, V>     : T extends syncMethod<infer U, infer V>     ? syncMethodConnect<U, V>     : never
```

这段很简单，就是分发判断，泛型是用infer占位ok。

最后，修改connect，就大功告成.

```ts
  type Connect = (module: EffectModule) => {
      [F in MethodName<typeof module>]:EffectMethodAssign<typeof module[F]>
  }
```
