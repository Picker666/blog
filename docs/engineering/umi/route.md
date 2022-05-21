# Umi.js 路由

## 约定式路由

什么是约定式路由，就是Umi约定好的路由。不需要自己配置即可使用。这里会梳理约定是的所有路由大纲，对于如何实现请点击这里[Umi约定式路由](https://v2.umijs.org/zh/guide/router.html#%E7%BA%A6%E5%AE%9A%E5%BC%8F%E8%B7%AF%E7%94%B1)。

* 1、基础路由：page目录下所有的页面都会自动形成路由（没有配置路由的前提下）
* 2、动态路由：带 $ 前缀的目录或文件为动态路由。
* 3、可选路由：动态路由如果带 $ 后缀，则为可选动态路由。
* 4、嵌套路由：目录下有 `_layout.js` 时会生成嵌套路由，以 `_layout.js` 为该目录的 layout 。
* 5、404 路由：约定 pages/404.js 为 404 页面。
* 6、注释扩展路由：路由文件的首个注释如果包含 yaml 格式的配置，则会被用于扩展路由。

## 配置式路由

如果你倾向于使用配置式的路由，可以配置 `.umirc.(ts|js)` 或者 config/config.(ts|js) 配置文件中的 routes 属性，此配置项存在时则不会对 src/pages 目录做约定式的解析。

```js
export default {
  routes: [
    { path: '/', component: './a' },
    { path: '/list', component: './b', Routes: ['./routes/PrivateRoute.js'] },
    { path: '/users', component: './users/_layout',
      routes: [
        { path: '/users/detail', component: './users/detail' },
        { path: '/users/:id', component: './users/id' }
      ]
    },
  ],
};
```

component 是相对于 src/pages 目录的

## 权限路由

umi 的权限路由是通过配置路由的 Routes 属性来实现。约定式的通过 yaml 注释添加，配置式的直接配上即可。

比如有以下配置：

```js
[
  { path: '/', component: './pages/index.js' },
  { path: '/list', component: './pages/list.js', Routes: ['./routes/PrivateRoute.js'] },
]
```

然后 umi 会用 ./routes/PrivateRoute.js 来渲染 /list。

./routes/PrivateRoute.js 文件示例：

```js
import { Route, Redirect } from 'dva/router';

const AuthRouter = (props) => {
  const { route } = props;
  const { component:Component } = route;
  return (
    //true ? <Route {...route} /> : <Redirect to="/login" />
    //这个也可以，跟下边的二选一，否则会报错 

    <Route render={ props => {
      console.log(props);
      return false ? <Component { ...props } /> : <Redirect to="/login" />
    }} />
  )
}

export default AuthRouter;
```

## 路由动效

路由动效应该是有多种实现方式，这里举 react-transition-group 的例子。

## 面包屑

面包屑也是有多种实现方式，这里举 react-router-breadcrumbs-hoc 的例子。

## 启用 Hash 路由

umi 默认是用的 Browser History，如果要用 Hash History，需配置：

```js
export default {
  history: 'hash',
}
```

## Scroll to top

在 layout 组件（layouts/index.js 或者 pages 子目录下的 _layout.js）的 componentDidUpdate 里决定是否 scroll to top，比如：

```js
import { Component } from 'react';
import withRouter from 'umi/withRouter';

class Layout extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(Layout);
```
