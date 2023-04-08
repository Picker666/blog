# 前端开发规范化

ESLint 最适用于 JavaScript 和 TypeScript，它允许我们通过指定您自己的规则或扩展来自 Google、Airbnb（常用） 等公司的标准化规则来配置和定制它以满足我们的需求。

Prettier 可以认为是一个**代码格式化**程序，它的代码样式一致且更易于使用。它支持 HTML、CSS、Javascript 和它们的大部分库。

Husky 是一个让我们使用 Git 钩子的工具。Git 钩子是可以配置为在 Git 生命周期中的特定点运行的脚本，我们将使用 Husky 来运行 ESlint 和 Prettier 作为我们的预提交钩子，以确保如果他们的代码违反了我们的规则，则没有人可以提交。

创建预提交和配置 Husky 可能很难在团队中设置和共享，因此我们将使用 lint-staged，这是一个安装 Husky 并为您**配置所有内容**的工具，您只需指定要在每次提交时运行的脚本。

lint-staged的作用是只对 git add 缓存区的代码进行 eslint 代码规范验证。这样只会对改动的代码进行验证，其它代码不做 eslint 校验。

## eslint

### 1、下载

```git
npm install eslint --save-dev
```

### 2、初始化

```git
npx eslint --init
<!-- 或者 -->
npm init @eslint/config
```

![npx eslint --init](/images/engineering/standard1.png)

### 3、并生成.eslintrc.js文件

```js
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

[私房菜](/engineering/common/eslintConfig.html)

4、规则可以更改，见官网；

5、package.json中配置检查命令行

```json
"lint": "eslint --ext .js --ext .jsx --ext .tsx src/",
```

![npm run init](/images/engineering/standard3.png)
![npm run init](/images/engineering/standard2.png)

直接执行  npm run lint 会对全部文件进行检测，所以，问题很多，如果老项目中添加eslint，这么搞是 要炸了。

### 6、eslintignore

.eslintignore.js 自己建文件，自己编写不需要eslint 检查的文件或目录。

### 7、eslint的意义

一个项目需要很多个开发者完成，为了统一代码风格，进而提升效率，降低沟通和理解代码的成本，也降低因为代码风格不同造成的代码误解，减少bug。

## prettier

有些事我们删除一些代码，或者对代码  ctrl + C/V 的时候，格式会很乱，我们期望save一下就好了，整齐了！

这就是perttier干的活。

偏向于**代码排版**层面上的格式化。

### 1、安装

```git
npm install --save-dev --save-exact prettier
<!-- 或者 -->
yarn add --dev --exact prettier
```

### 2、格式化

```git
npx prettier --write src/
```

写乱的代码，变得整齐了。

### 4、配置自定义的prettier规则

需要在根目录新建一个文件.prettierrc.js（则需要module.export）,如果是.prettierrc(则只需要json格式)

```js
module.exports = {
  tabWidth: 2, // 缩进字节数
  bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
  singleQuote: true, // 使用单引号代替双引号
  printWidth: 120,
  semi: true,
  trailingComma:'es5'
};
```

### 5，prettier插件保存代码自动修复

如果下载Prettier插件，应该没什么问题；

### 6、让编译器能报prettier的错

对于prettier,我们还无法查看哪里不符合规则,只是通过自动修复来规范代码风格；

如果想像eslint一样，代码一写，如果不符合，就出现红色的波浪线提示哪里有问题。

这个要怎么实现呢？可以利用eslint的报错，把prettier当成eslint的插件注入eslint中，让eslint来报这个错（实际上还是vscode的eslint实现的）

```git
npm i -D eslint-plugin-prettier
```

然后再在.eslintrc.js 配置文件中添加这个配置，意思就是使用 eslint 报prettier的错误：

```js
// .eslintrc.js
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

### 7，解决eslint和prettier的冲突问题

不是真正意义上的eslint和prettier的冲突;

eslint的规则设置在.eslintrc.js的rules中，prettier的设置在prettierrc.js中，这两者都是我们开发者自己设置的。

需要再强调一点，这个extends数组中的规则，后面的会覆盖前面的。

eslint和prettier的冲突问题，其实说的是这些依赖引入的规则和prettier的冲突！

第一种方案：把自己想要的规则配置成npm包发布，然后引入到这个extends数组中。

第二种方案：relus中的配置和prettier中的保持一致即可。

## 提交代码时eslint校验

安装 husky

```git
npm install husky@4.3.8 --save-dev
```

然后在package.json中增加配置：

```js
"husky": {
  "hooks": {
    "pre-commit": "echo 'husky' && npm run lint"
  }
}
```

如果eslint验证通过了，则会进行commit 操作，否则会报eslint的错误提示。

![npm run init](/images/engineering/standard4.png)
![npm run init](/images/engineering/standard5.png)

这个报的很多！

## lint-staged

如果这是一个新项目以上的就已经满足要求了，但是如果拿到的项目是一个老项目呢，别人开发了很久，这个时候加入再加入 eslint 规则，全局去检查，会发现一堆报错信息。这个就慌了。修改可能带来其他问题。

为了解决这种问题，我们就需要引入 lint-staged

lint-staged 的作用是只对 git add 缓存区的代码进行 eslint 代码规范校验。这样就避免了全局校验的问题。你修改了上面代码，你就提交了什么代码，其他代码不做 eslint 校验

```git
npm install --save-dev lint-staged
```

在 package.json 中添加：

```json
"lint-staged": {
  "src/**/*.{css，scss,less}": [
    "npm run lint",
    "git commit"
  ],
  "src/**/*.{js,jsx,ts,tsx}": [
    "npm run lint",
    "git commit"
  ]
}
```

似乎不起作用！！！提交时候还是会检查所有。

husky新版本（v5以上，当前是v8），需要单独提供脚本，放于.husky 文件夹下。内容可以如下

建议参考lint-staged的官网方式进行安装；

```js
px mrm@2 lint-staged
```

该命令会做一下三件事：

* 在package.json中添加需要lint的文件（智能添加…）
* 添加pre-commit的脚本(husky add)
* package.json添加prepare脚本。从而任何人安装依赖完成后都会添加上hook.

[参考](https://blog.csdn.net/weixin_42349568/article/details/121505460)
