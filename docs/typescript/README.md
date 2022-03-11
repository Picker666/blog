# 认识 typescript 及环境搭建

## 基于 `javascript` 认识 `typescript`

### `typescript` 的特点

* [`ts`](https://juejin.cn/post/7018805943710253086?share_token=9c38baf9-7fe8-428b-946d-21c08e7f4206)是`js`的超集，即你可以在`ts`中使用原生`js`语法。
* `ts`需要静态编译，它提供了强类型与更多面向对象的内容。
* `ts`最终仍要编译为弱类型的`js`文件，基于对象的原生的`js`，再运行。故`ts`相较`java`/`C#`这样天生面向对象语言是有区别和局限的
* `ts`是由微软牵头主导的，主要来自`C#`

### `typescript` 和 `javascript` 的区别

* `TypeScript`是一个应用程序级的`JavaScript`开发语言。（这也表示`TypeScript`比较牛掰，可以开发大型应用，或者说更适合开发大型应用）
* `TypeScript`是`JavaScript`的超集，可以编译成纯`JavaScript`。这个和我们`CSS`中的`Less`或者Sass`是很像的，
* 我们用更好的代码编写方式来进行编写，最后还是有好生成原生的`JavaScript`语言。
* `TypeScript`跨浏览器、跨操作系统、跨主机、且开源。由于最后他编译成了`JavaScript`所以只要能运行JS的地方，都可以运行我们写的程序，设置在`node.js`里。
* `TypeScript`始于`JavaScript`，终于`JavaScript`。遵循`JavaScript`的语法和语义
* `TypeScript`可以重用`JavaScript`代码，调用流行的`JavaScript`库。
* `TypeScript`提供了类、模块和接口，更易于构建组件和维护。

## `typescript`环境搭建

::: tip 注意
typescript: v4.5.4

javaScript: ES2020
:::

### 安装最新版本的`typescript`

```js
npm i -g typescript
```

### 安装`ts-node`

```js
npm i -g ts-node
```

### 创建一个`tsconfig.json`文件

```js
tsc --init
```

然后新建`index.ts`,输入代码后，执行 `ts-node index.ts` 即可。

::: tip

也可以使用`webpack/vite`搭建一个使用`typescript`的项目环境。
