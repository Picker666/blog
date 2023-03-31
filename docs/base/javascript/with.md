# with

with 是一个不推荐使用的语法，因为它的作用是改变上下文，而上下文环境对开发者影响很大。

```js
with (console) {
  log('I dont need the "console." part anymore!');
}

with (console) {
  with (['a', 'b', 'c']) {
    log(join('')); // writes "abc" to the console.
  }
}
```

[参考](https://zhuanlan.zhihu.com/p/397800013)
[JavaScript's Forgotten Keyword (with)](https://link.zhihu.com/?target=https%3A//dev.to/mistval/javascript-s-forgotten-keyword-with-48id)
