# SQL 注入

SQL注入是一种常见的Web安全漏洞，攻击者利用这个漏洞，可以访问或修改数据，或者利用潜在的数据库漏洞进行攻击。

## 原理

我们先举一个万能钥匙的例子来说明其原理：

前端输入一个username: admin' --, password: password;

后端的 SQL 语句可能是如下这样的：

```java
SELECT * FROM user WHERE username='admin' AND psw='password'
```

但是恶意攻击者用奇怪用户名将你的SQL语句变成了如下形式：

```java
SELECT * FROM user WHERE username='admin' --' AND psw='xxxx'
```

在SQL中, ' --是闭合和注释的意思，-- 是注释后面的内容的意思，所以查询语句就变成了：

```java
SELECT * FROM user WHERE username='admin'
```

所谓的万能密码,本质上就是SQL注入的一种利用方式。

一次SQL注入的过程包括以下几个过程：

* 获取用户请求参数
* 拼接到代码当中
* SQL语句按照我们构造参数的语义执行成功。

SQL注入的必备条件：

* 1.可以控制输入的数据
* 2.服务器要执行的代码拼接了控制的数据。

## 危害

* 获取数据库信息
  * 管理员后台用户名和密码
  * 获取其他数据库敏感信息：用户名、密码、手机号码、身份证、银行卡信息……
  * 整个数据库：脱裤
* 获取服务器权限
* 植入Webshell，获取服务器后门
* 读取服务器敏感文件

## 如何防御

* **严格限制Web应用的数据库的操作权限**，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害
* **后端代码检查输入的数据是否符合预期**，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。
* **对进入数据库的特殊字符（'，"，，<，>，&，*，; 等）进行转义处理，或编码转换**。基本上所有的后端语言都有对字符串进行转义处理的方法，比如 lodash 的 lodash._escapehtmlchar 库。
* **所有的查询语句建议使用数据库提供的参数化查询接口**，参数化的语句使用参数而不是将用户输入变量嵌入到 SQL 语句中，即不要直接拼接 SQL 语句。例如 Node.js 中的 mysqljs 库的 query 方法中的 ? 占位参数。