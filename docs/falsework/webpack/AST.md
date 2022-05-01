# webpack之AST与代码转换

::: tip AST
AST是Abstract Syntax Tree的缩写既"抽象语法树"
它以树状的形式表现编程语言的语法结构
:::

## AST应用场景

通过操作AST,可以精准的定位到声明、赋值、运算语句,从而实现对代码的分析、优化、变更等操作。

即:

* 代码风格,语法的检查,IDE中的错误提示,格式化,自动补全等等
* 优化变更代码，代码压缩等等
* es6转es5,以及TypeScript、JSX等转化为原生Javascript等等

![ast](/blog/images/webpack/ast1.jpg)

## 如何生成AST

生成过程：1.源码--2.词法分析--3.语法分析--4.抽象语法树

例如：let sum = 10 + 66;

![生成AST](/blog/images/webpack/ast2.jpg)

* 1、词法分析

词法分析阶段把字符串形式的代码转换为令牌（tokens）流。

从左到右一个字符一个字符地读入源程序，从中识别出一个个“单词”"符号"等
单词 单词 符号 数字 符号 数字 符号
| let | sum | = | 10 | + | 66 | ; |

```js
 [
  {"type": "word", value: "let"},
  {"type": "word", value: "sum"},
  {"type": "Punctuator", value: "="},
  {"type": "Numeric", value: "10"},
  {"type": "Punctuator", value: "+"},
  {"type": "Numeric", value: "66"},
  {"type": "Punctuator", value: ";"},
 ]
```

* 2、语法分析

语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作。

即：在词法分析的基础上根据当前编程语言的语法,将单词序列组合成各类语法短语
关键字 标识符 赋值运算符 字面量 二元运算符 字面量 结束符号

```js
|  let  |    sum   |       =      |     10     |      +     |   66   |     ;   |
[
  {
    "type": "VariableDeclaration",
    "content": {
      {"type": "kind", value: "let"}, // kind 表示是什么类型的声明
      {"type": "Identifier", value: "sum"}, // Identifier 表示是标识符
      {"type": "init", value: "="}, // init 表示初始值的表达式
      {"type": "Literal", value: "10"}, // Literal 表示是一个字面量
      {"type": "operator", value: "+"}, // operator 表示是一个二元运算符
      {"type": "Literal", value: "66"},
      {"type": "Punctuator", value: ";"},
    }
  }
]
```

* 3、生成抽象语法树

```js
let tree = {
  "type": "Program",
  "start": 0,
  "end": 18,
  "body": [
      {
          "type": "VariableDeclaration",
          "kind": "let",
          "start": 0,
          "end": 18,
          "declarations": [
              {
                  "type": "VariableDeclarator",
                  "start": 4,
                  "end": 17,
                  "id": {
                      "type": "Identifier",
                      "start": 4,
                      "end": 7,
                      "name": "sum"
                  },
                  "init": {
                      "type": "BinaryExpression",
                      "start": 10,
                      "end": 17,
                      "left": {
                          "type": "Literal",
                          "start": 10,
                          "end": 12,
                          "value": 10,
                          "raw": "10"
                      },
                      "operator": "+",
                      "right": {
                          "type": "Literal",
                          "start": 15,
                          "end": 17,
                          "value": 66,
                          "raw": "66"
                      }
                  }
              }
          ],
      }
  ]
};
```

参考：

[](https://zhuanlan.zhihu.com/p/361683562)

[什么是AST](https://segmentfault.com/a/1190000016231512)

[一看就懂的JS抽象语法树 - SegmentFault 思否](https://segmentfault.com/a/1190000012943992)

[AST抽象语法树--最基础的javascript重点知识，99%的人根本不了解 - SegmentFault 思否](https://segmentfault.com/a/1190000016231512)

[实践系列 Babel原理](https://juejin.cn/post/6844903760603398151#comment)
