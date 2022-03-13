# 策略模式（done）

在策略模式（Strategy Pattern）中，一个类的行为或其算法可以在运行时更改。这种类型的设计模式属于行为型模式。

在策略模式中，我们创建表示各种策略的对象和一个行为随着策略对象改变而改变的 context 对象。策略对象改变 context 对象的执行算法。

## 介绍

### 意图

定义一系列的算法,把它们一个个封装起来, 并且使它们可相互替换。

### 主要解决

在有多种算法相似的情况下，使用 if...else 所带来的复杂和难以维护。

将算法的使用和算法的实现分离开来。

一个基于策略模式的程序至少由两部分组成：

* 第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。
* 第二个部分是环境类Context，Context接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明Context 中要维持对某个策略对象的引用

### 何时使用

一个系统有许多许多类，而区分它们的只是他们直接的行为。

### 如何解决

将这些算法封装成一个一个的类，任意地替换。

### 关键代码

实现同一个接口。

### 应用实例

* 1、诸葛亮的锦囊妙计，每一个锦囊就是一个策略。
* 2、旅行的出游方式，选择骑自行车、坐汽车，每一种旅行方式都是一个策略。
* 3、JAVA AWT 中的 LayoutManager。

### 优点

* 1、算法可以自由切换。
* 2、避免使用多重条件判断。
* 3、扩展性良好。

### 缺点

* 1、策略类会增多。
* 2、所有策略类都需要对外暴露。

## 实现

策略模式可以用于**组合**一系列**算法**，也可用于组合一系列业**务规则**

假设需要通过成绩等级来计算学生的最终得分，每个成绩等级有对应的加权值。我们可以利用对象字面量的形式直接定义这个组策略

```js
// 加权映射关系
var levelMap = {
    S: 10,
    A: 8,
    B: 6,
    C: 4
};

// 组策略
var scoreLevel = {
    basicScore: 80,

    S: function() {
        return this.basicScore + levelMap['S']; 
    },

    A: function() {
        return this.basicScore + levelMap['A']; 
    },

    B: function() {
        return this.basicScore + levelMap['B']; 
    },

    C: function() {
        return this.basicScore + levelMap['C']; 
    }
}

// 调用
function getScore(level) {
    return scoreLevel[level] ? scoreLevel[level]() : 0;
}

console.log(
    getScore('S'),
    getScore('A'),
    getScore('B'),
    getScore('C'),
    getScore('D')
); // 90 88 86 84 0
```

在组合业务规则方面，比较经典的是表单的验证方法。这里列出比较关键的部分

```js
// 错误提示
var errorMsgs = {
    default: '输入数据格式不正确',
    minLength: '输入数据长度不足',
    isNumber: '请输入数字',
    required: '内容不为空'
};

// 规则集
var rules = {
    minLength: function(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg || errorMsgs['minLength']
        }
    },
    isNumber: function(value, errorMsg) {
        if (!/\d+/.test(value)) {
            return errorMsg || errorMsgs['isNumber'];
        }
    },
    required: function(value, errorMsg) {
        if (value === '') {
            return errorMsg || errorMsgs['required'];
        }
    }
};

// 校验器
function Validator() {
    this.items = [];
};

Validator.prototype = {
    constructor: Validator,
    
    // 添加校验规则
    add: function(value, rule, errorMsg) {
        var arg = [value];

        if (rule.indexOf('minLength') !== -1) {
            var temp = rule.split(':');
            arg.push(temp[1]);
            rule = temp[0];
        }

        arg.push(errorMsg);

        this.items.push(function() {
            // 进行校验
            return rules[rule].apply(this, arg);
        });
    },
    
    // 开始校验
    start: function() {
        for (var i = 0; i < this.items.length; ++i) {
            var ret = this.items[i]();
            
            if (ret) {
                console.log(ret);
                // return ret;
            }
        }
    }
};

// 测试数据
function testTel(val) {
    return val;
}

var validate = new Validator();

validate.add(testTel('ccc'), 'isNumber', '只能为数字'); // 只能为数字
validate.add(testTel(''), 'required'); // 内容不为空
validate.add(testTel('123'), 'minLength:5', '最少5位'); // 最少5位
validate.add(testTel('12345'), 'minLength:5', '最少5位');

var ret = validate.start();

console.log(ret);
```
