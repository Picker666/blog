# AST（Abstract Syntax Tree）

AST 是 前端工程化的一个重要环节，比如：

* 1、将Typescript转化为Javascript；
* 2、将SASS/LESS转化为CSS（sass/less）；
* 3、将ES6+ 转化为ES5（babel）；
* 4、将 Javascript 代码进行格式化（eslint/prettier）；
* 5、识别 React 项目中的 JSX（babel）；
* 6、GraphQL、MDX、Vue SFC 等等；

在语言转换过程中，实质上就是对 AST 的操作，核心步骤就是 AST 三步：

* 1、Code -> AST (Parse)
* 2、AST -> AST (Transform)
* 3、AST -> Code (Generate)

以下是一段代码，及其对应的 AST

```js
// Code
const a = 4

// AST
{
  "type": "Program",
  "start": 0,
  "end": 11,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 11,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 6,
          "end": 11,
          "id": {
            "type": "Identifier",
            "start": 6,
            "end": 7,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 10,
            "end": 11,
            "value": 4,
            "raw": "4"
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "module"
}
```

不同的语言拥有不同的解析器，比如 Javascript 的解析器和 CSS 的解析器就完全不同。

对相同的语言，也存在诸多的解析器，也就会生成多种 AST，如 babel 与 espree。

在 [AST Explorer](https://astexplorer.net/) 中，列举了诸多语言的解析器(Parser)，及转化器(Transformer)。
