# instanceof

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