# 图片懒加载 - 进入可视区域

[demo](https://github.com/Picker666/blog-example/) (src/component/base/imageLazyLoading.tsx)

## 1、clientHeight + scrollTop > offsetTop

clientHeight 当前视窗的高度；

scrollTop 滚动条滚动距离

offsetTop 元素到达 offsetParent 的距离。

:::tip
offsetTop 当前元素顶部相对指定元素顶部的偏移量.

这个指定元素由当前元素的 `offsetParent` 属性确定.

offsetParent: 返回距离当前元素最近的采用定位祖先元素；祖先元素中没有采用定位的元素，则返回body元素。

* 1、offsetTop :当前对象到其上级层顶部的距离。
* 2、offsetLeft :当前对象到其上级层左边的距离。
* 3、offsetWidth :当前对象的宽度.
  * 与style.width属性的区别在于:如对象的宽度设定值为百分比宽度,则无论页面变大还是小,style.width都返回此百分比,而offsetWidth则返回在不同页面中对象的**宽度值**而不是百分比值

* 4、offsetHeight :当前对象的高度。

:::

```js
const ImageLazyLoading = () => {
  const messageCustom = throttle(() => message.info('进入可视区域啦！！'), 500);
  const withOffset = () => {
    const box = document.getElementById('container');

    const handler = function () {
      const clientH = box?.clientHeight || 0; //获取屏幕可视区域的高度
      const offsetTop = document.getElementById('yellow')?.offsetTop || 0; //获取元素相对于顶部的高度
      return function (e) {
        const scrollT = e.target.scrollTop || 0; // 滚动条滚动的距离
        if (clientH + scrollT > offsetTop) {
          messageCustom();
        }
      };
    };
    const addEvent = () => {
      box?.addEventListener('scroll', handler(box));
    };

    const removeEvent = () => {
      box?.removeEventListener('scroll', handler(box));
    };

    return { addEvent, removeEvent };
  };

  useEffect(() => {
    const { addEvent, removeEvent } = withOffset();

    addEvent();

    return removeEvent;
  }, []);

  return (
    <div id="container" style={{ marginTop: '200px', maxHeight: '600px', overflow: 'auto', position: 'relative' }}>
      <div style={{ backgroundColor: 'green', width: '100vw', height: '8000px' }}></div>
      <div id="yellow" style={{ backgroundColor: 'yellow', width: '100vw', height: '800px' }}></div>
    </div>
  );
};
```

## 2、getBoundingClientRect()

getBoundingClientRect()获得页面中某个元素的左，上，右和下分别相对**浏览器视窗**的位置。 ;

getBoundingClientRect()是DOM元素到浏览器可视范围的距离（不包含文档卷起的部分）

* 1、top：元素上边到视窗**上边**的距离;
* 2、right：元素右边到视窗**左边**的距离;
* 3、bottom：元素下边到视窗**上边**的距离;
* 4、left：元素左边到视窗**左边**的距离;
* 5、width：是元素自身的宽；
* 6、height是元素自身的高。

```js
const withRect = () => {
  const box = document.getElementById('container1');

  const handler = function () {
    const clientH = box?.clientHeight || 0; //获取屏幕可视区域的高度
    return function (e) {
      const targetData = document.getElementById('yellow1')?.getBoundingClientRect() || { top: -1 }; //获取目标元素相信息
      const top = targetData.top - 288;
      if (top > 0 && top < clientH) {
        messageCustom();
      }
    };
  };

  const addEvent = () => {
    box?.addEventListener('scroll', handler());
  };

  const removeEvent = () => {
    box?.removeEventListener('scroll', handler());
  };

  return { addEvent, removeEvent };
};
```

## 3、IntersectionObserver

新的API，针对元素的可见时间进行监听。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

```js
var io = new IntersectionObserver(callback, option);
```

IntersectionObserver是浏览器原生提供的构造函数，接受两个参数：callback是可见性变化时的回调函数，option是配置对象（该参数可选）。

构造函数的返回值是一个观察器实例。实例的observe方法可以指定观察哪个 DOM 节点。

```js
// 开始观察 
// 如果要观察多个节点，就要多次调用这个方法
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();
```

callack参数：

目标元素的可见性变化时，就会调用观察器的回调函数callback。

一般会触发两次：1.目标元素刚刚进入视口（开始可见），2.完全离开视口（开始不可见）。

callback函数的参数是一个**数组**，每个成员都是一个IntersectionObserverEntry对象

IntersectionObserverEntry 对象
提供目标元素的信息，一共有六个属性。

* 1、time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
* 2、target：被观察的目标元素，是一个 DOM 节点对象
* 3、rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
* 4、boundingClientRect：目标元素的矩形区域的信息
* 5、intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
* 6、intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0

```js
const observe = () => {
    // 观察器实例
    const io = new IntersectionObserver((entires) => {
      entires.forEach((item) => {
        // 原图片元素
        if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
          messageCustom();
        }
      });
    });

    const target = document.getElementById('yellow2') || document.body;

    // 给每一个图片设置观察器
    const addEvent = () => {
      io.observe(target);
    };

    const removeEvent = () => {
      io.unobserve(target);
    };

    return { addEvent, removeEvent };
  };

```