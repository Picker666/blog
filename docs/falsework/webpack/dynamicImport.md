# Webpack之按需加载

如果系统很庞大，将代码一次性载入，就显得太过于强大，最好能做到根据我们的需求来选择性地加载我们需要的代码。

## 一、两种动态加载的方式

* 1、符合 ECMAScript 提案 的 import() 语法 来实现动态导入。（import() 调用会在内部用到 promises。）
* 2、webpack 的遗留功能，使用 webpack 特定的 require.ensure。

```js
import(/* webpackChunkName: "b" */ './b').then(function(module){
    const b = module.default;
    b();
})
```

现在都比较推荐第一种方式，从实践中可以得到下面的结论

* 1、webpack中output的设置并不决定是否拆分代码
* 2、拆分代码的决定因素在import语法上
* 3、webpack在扫描到代码中有import语法的时候，才决定执行拆分代码

在业务中，如果使用的是react,一般都是需要和react-router联合使用的。

那么一般配置如下，

## 二、webpack.config.js

```js
var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry:'./a.js',
  mode:'development',
  output:{
    filename:'[name].js',
    chunkFilename:'[name].js',// 设置按需加载后的chunk名字
    publicPath:'dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  devServer: {
    contentBase: './',
    compress: true,
    port: 9000,
    hot: true,
  },
  plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
  ],
}
```

## 三、添加.babelrc

```js
{
  "presets": ["@babel/preset-react","@babel/preset-env"],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

## 四、添加组件

```js
import React,{Component} from 'react';
import ReactDom from 'react-dom';

export default class A extends Component{
  render(){
    return <div>
      this is A
    </div>
  }
}
ReactDom.render(<A />,document.getElementById('component'))
```

## 五、集成react-loadable

现在用react-loadable方式实现的按需加载是官方比较推荐的方式。 在这个过程中，用了import()这个方法

```js
import React,{Component} from 'react';
import { BrowserRouter as Router, Route, Switch,Link } from 'react-router-dom';
import ReactDom from 'react-dom';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const B = Loadable({
  loader: () => import('./b.js'),
  loading: Loading,
})
const C = Loadable({
  loader: () => import('./C.js'),
  loading: Loading,
})
export default class A extends Component{
  render(){
    return <div>
      <Router>
        <div>
          <Route path="/B" component={B}/>
          <Route path="/C" component={C}/>
          <Link to="/B">to B</Link><br/>
          <Link to="/C">to C</Link>
        </div>
      </Router>
    </div>
  }
}
ReactDom.render(<A/>,document.getElementById('component'))
```

## 六、封装Loadable组件

```js
const LazyLoad = (path)=>{
  return Loadable({
    loader: () => import(path),
    loading: Loading,
  })
}

const B = LazyLoad('./b.js')
```

如果用上面的方式来封装组件，会发现报错。因为webpack编译的时候，会先扫描一遍js文件，找出需要按需加载的部分，然后进行按需加载，不会关心内部的js执行上下文。

所以只能把import的部分拿出来。

```js
const LazyLoad = loader => Loadable({
  loader,
  loading:Loading,
})
const B = LazyLoad(()=>import('./b.js'));
```
