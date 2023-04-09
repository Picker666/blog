# async/await

```js
function MyAsync(func) {
    return function (...rest) {
      const next = (result, resolve, reject, value) => {
        const res = result.next(value);
        if (res.done) {
          return resolve(res.value);
        } else {
          return Promise.resolve(res.value).then(
            (val) => {
              next(result, resolve, reject, val);
            },
            (err) => {
              reject(err);
            }
          );
        }
      };
      return new Promise((resolve, reject) => {
        const result = func(...rest);
        next(result, resolve, reject, undefined);
      });
    };
  }

  function* generatorF() {
    const value = yield asyncFn1();
    console.log('value: ', value);
    const value1 = yield asyncFn1(9);
    console.log('value1: ', value1);
  }

    MyAsync(generatorF)();
  ```

[demo 最后一个](https://github.com/Picker666/blog-example/blob/main/src/component/newFunction/AsyncAwait.tsx)

