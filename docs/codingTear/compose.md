# compose

[代码例子](https://github.com/Picker666/blog-example/blob/main/src/component/newFunction/Compose.tsx)

```js
const newCompose = (...func) => {
  return function (...rest) {
    return func.reduceRight(function (a, b) {
      return b.apply(null, rest);
    }, rest);
  };
};

```
