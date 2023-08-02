# 练习

## 对象差集

### 1、T中存在，U中不存在的对象

```ts
type D<T, U> = T extends U ? never : T; // Exclude

type Deff<T, U> = {
  [k in D<keyof T, keyof U>]: T[k];
};

// 或者

type Deff<T, U> = {
  [k in Exclude<keyof T, keyof U>]: T[k];
};

const a = { name: 1, age: 18, sex: 99 };
const b = { name: 2, age: 1, grade: 99 };

const c: Deff<{ name: number; age: number; sex: number }, { name: number; age: number }> = { sex: 66 };
```

### 2、T中存在，U中也存在的对象

```ts
type D<T, U> = T extends U ? T : never; // Extract

type Deff<T, U> = {
  [k in D<keyof T, keyof U>]: T[k];
};

// 或者

type Deff<T, U> = {
  [k in Extract<keyof T, keyof U>]: T[k];
};

const a = { name: 1, age: 18, sex: 99 };
const b = { name: 2, age: 1, grade: 99 };

const c: Deff<{ name: number; age: number; sex: number }, { name: number; age: number }> = { name: 2, age: 1 };
```

### 3、T中不存在，U存在；T存在，U不存在

```ts
type D<T, U> = T extends U ? never : T;

type Deff<T, U> = {
  [k in D<keyof T, keyof U>]: T[k];
};

type DC<T, U> = Deff<T, U> & Deff<U, T>;

const a = { name: 1, age: 18, sex: 99 };
const b = { name: 2, age: 1, grade: 99 };

const c: DC<{ name: number; age: number; sex: number }, { name: number; age: number }> = { sex: 66 };

```
