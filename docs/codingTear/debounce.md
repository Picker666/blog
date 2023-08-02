# 防抖函数debounce

防抖和[节流](/newFunction/throttle.html)是用来做性能优化，使用的频率比较高。

**例如：** 滚动事件的监听，往往滚动一下，会**触发很多次**，这显然是有性能问题的，其实只需要**触发一次**。

防抖思想：在短时间内可能多次触发执行`function`，但是，实际只需要一次的结果就好，除第一次或最后一次，其他的的触发只会重新计时。

* 立即执行：第一次触发就**执行function**，然后启动倒计时，在倒计时内再次触发，不会执行，只会更新倒计时时间。
* 延迟实行：从第一次触发开始**执行倒计时**，在倒计时内，再次触发，不会执行，只会更新倒计时时间，倒计时结束 执行`function`。

```js
/**
 * @param func 需要防抖处理的方法
 * @param wait 防抖等待时间
 * @param immediate 是否立即执行
 * 
 * @returns 经防抖处理后方法的引用，可使用cancel提前取消倒计时
*/
function debounce(func, wait, immediate) {

    var timeout, result;

    var debounced = function () {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow) result = func.apply(context, args)
        } else {
            timeout = setTimeout(function(){
                result = func.apply(context, args)
            }, wait);
        }
        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };

    return debounced;
}
```

::: warning 注意
在使用`cancel`方法时

* `immediate: true`时，`func`已执行；
* `immediate: false`时，`func`未执行；
:::

举个例子

```js
function showTop  () {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log('滚动条位置：' + scrollTop);
}
window.onscroll = debounce(showTop,1000)
```

此时会发现，必须在停止滚动1秒以后，才会打印出滚动条位置。
