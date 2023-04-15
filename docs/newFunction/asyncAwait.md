# async/await

ES7 中引入了 async/await，这种方式能够彻底告别执行器和生成器，实现更加直观简洁的代码。根据 MDN 定义，async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。可以说async 是Generator函数的语法糖，并对Generator函数进行了改进。

一比较就会发现，async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

async函数对 Generator 函数的改进，体现在以下四点：

* 内置执行器。Generator 函数的执行必须依靠执行器，而 async 函数自带执行器，无需手动执行 next() 方法。
* 更好的语义。async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
* 更广的适用性。co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。
* 返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用。

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
