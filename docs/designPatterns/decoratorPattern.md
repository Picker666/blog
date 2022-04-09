# 装饰器模式

装饰者模式的定义：在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法。

通常运用在原有方法维持不变，在原有方法上再挂载其他方法来满足现有需求。

就像我们经常需要给手机戴个保护套防摔一样，不改变手机自身，给手机添加了保护套提供防摔功能。

以下是如何实现装饰模式的例子，使用了 ES7 中的装饰器语法。

```js
function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

class Test {
  @readonly
  name = 'yck'
}

let t = new Test()

t.yck = '111' // 不可修改
```

在 React 中，装饰模式其实随处可见

```js
import { connect } from 'react-redux'
class MyComponent extends React.Component {
    // ...
}
export default connect(mapStateToProps)(MyComponent)
```

装饰器模式是继承的一种补充，可以增加功能扩展的灵活性。
