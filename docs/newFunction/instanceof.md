# instanceof

instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。

因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

Object 的 prototype 属性是 Object.prototype, 而由于 Object 本身是一个函数，由 Function 所创建，所以 Object.__proto__ 的值是 Function.prototype，而 Function.prototype 的 __proto__ 属性是 Object.prototype

[浅谈 instanceof 和 typeof 的实现原理](https://juejin.cn/post/6844903613584654344)

```js
function myInstanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}
```

???
```js
function instance_of(Case, Constructor) {
// 基本数据类型返回false
// 兼容一下函数对象
if ((typeof(Case) != 'object' && typeof(Case) != 'function') || Case == 'null') return false;
let CasePrototype = Object.getPrototypeOf(Case);
while (true) {
    // 查到原型链顶端，仍未查到，返回false
    if (CasePrototype == null) return false;
    // 找到相同的原型
    if (CasePrototype === Constructor.prototype) return true;
    CasePrototype = Object.getPrototypeOf(CasePrototype);
}

```
