# 节流函数throttle

在[防抖](/newFunction/debounce.html)的处理中，如果在限定时间段内，不断触发滚动事件，只要不停止触发，理论上就永远不会执行 `function`，或者只在最初执行一次 `function`。

**例如：**某个用户闲着无聊，按住滚动不断的拖来拖去，理论上永远不会输出当前距离顶部的距离，或者只会在开始时候输出一次。

**但是**, 如果产品同学的期望处理方案是：即使用户不断拖动滚动条，也能在某个时间间隔之后给出反馈呢？

**效果：**如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。

```js
/**
 * @param func 需要节流处理的方法
 * @param wait 节流等待时间
 * @param options?: {leading, trailing}，可选参数，可包含两个属性，
 *      leading：是否在节流开始时候执行，默认是执行，设为`false`时，不执行
 *      trailing: 是否在节流结束时候执行，默认执行，设为`false`是，不执行
 * 
 * @returns 经防抖处理后方法的引用，可使用cancel提前取消倒计时
*/
function throttle(func, wait, options) {
    let timeout, context, args, result;
    let previous = 0;
    if (!options) options = {};

    const later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };

    const throttled = function() {
        const now = new Date().getTime();
        if (!previous && options.leading === false) {
            previous = now;
        }

        const remaining = wait - (now - previous);
        context = this;
        args = arguments;

        if (remaining <= 0 || remaining > wait) { // 条件1
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            previous = now;
            func.apply(context, args);

            if (!timeout) {
                context = args = null;
            }

        } else if (!timeout && options.trailing !== false) {  // 条件2
            timeout = setTimeout(later, remaining);
        }
    };
    return throttled;
}
```


例如

```js
function showTop  () {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log('滚动条位置：' + scrollTop);
}
window.onscroll = throttle(showTop,1000)

window.onscroll = throttle(showTop,1000, { leading: false })

window.onscroll = throttle(showTop,1000, { leading: false, remaining: false})
```

**结果：**

* 立刻输出当前位置和顶部的距离，之后会以1s的时间间隔，持续输出当前位置和顶部的距离，先满足`条件1`，之后之会满足`条件2`;
* 1s后输出当前位置和顶部的距离，之后会以1s的时间间隔，持续输出当前位置和顶部的距离，只会满足`条件2`;
* 1s后输出当前位置和顶部的距离，之后会以1s的时间间隔，持续输出当前位置和顶部的距离，只会满足`条件1`.
