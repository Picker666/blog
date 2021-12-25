---
sideBarDep: 2
---

# Array 基础方法手写

## every

```js
Array.prototype.myEvery = function(callbackFn) {
    var _arr = this, thisArg = arguments[1] || window;
    // 开始标识值为true
    // 遇到回调返回false，直接返回false
    // 如果循环执行完毕，意味着所有回调返回值为true，最终结果为true
    var flag = true;
    for (var i = 0; i<_arr.length; i++) {
        // 回调函数执行为false，函数中断
        if (!callbackFn.call(thisArg, _arr[i], i, _arr)) {
            return false;
        }
    }
    return flag;
}
```

## filter

```js
Array.prototype.myFilter = function(callbackFn) {
    var _arr = this, thisArg = arguments[1] || window, res = [];
    for (var i = 0; i<_arr.length; i++) {
        // 回调函数执行为true
        if (callbackFn.call(thisArg, _arr[i], i, _arr)) {
            res.push(_arr[i]);
        }
    }
    return res;
}
```

## forEach

```js
Array.prototype.myForEach = function (callbackFn) {
    // 判断this是否合法
    if (this === null || this === undefined) {
        throw new TypeError("Cannot read property 'myForEach' of null");
    }
    // 判断callbackFn是否合法
    if (Object.prototype.toString.call(callbackFn) !== "[object Function]") {
        throw new TypeError(callbackFn + ' is not a function')
    }
    // 取到执行方法的数组对象和传入的this对象
    var _arr = this, thisArg = arguments[1] || window;
    for (var i = 0; i < _arr.length; i++) {
        // 执行回调函数
        callbackFn.call(thisArg, _arr[i], i, _arr);
    }
}
```

## map

```js
Array.prototype.myMap = function(callbackFn) {
    var _arr = this, thisArg = arguments[1] || window, res = [];
    for (var i = 0; i<_arr.length; i++) {
        // 存储运算结果
        res.push(callbackFn.call(thisArg, _arr[i], i, _arr));
    }
    return res;
}
```

## reduce

```js
Array.prototype.myReduce = function(callbackFn) {
    var _arr = this, accumulator = arguments[1];
    var i = 0;
    // 判断是否传入初始值
    if (accumulator === undefined) {
        // 没有初始值的空数组调用reduce会报错
        if (_arr.length === 0) {
            throw new Error('initVal and Array.length>0 need one')
        }
        // 初始值赋值为数组第一个元素
        accumulator = _arr[i];
        i++;
    }
    for (; i<_arr.length; i++) {
        // 计算结果赋值给初始值
        accumulator = callbackFn(accumulator,  _arr[i], i, _arr)
    }
    return accumulator;
}
```
