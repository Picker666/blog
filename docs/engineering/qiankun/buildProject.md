# 搭建一个项目

qiankun 孵化自蚂蚁金融科技基于微前端架构的云产品统一接入平台, 是一个基于 `single-spa` 的微前端实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

微前端架构具备以下几个核心价值:

* 1、技术栈无关 - 主框架不限制接入应用的技术栈，微应用具备完全自主权；
* 2、独立开发、独立部署 - 微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
* 3、增量升级 - 在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略
* 4、独立运行时 - 每个微应用之间状态隔离，运行时状态不共享

微前端架构旨在解决单体应用在一个相对长的时间跨度下，由于参与的人员、团队的增多、变迁，从一个普通应用演变成一个巨石应用(Frontend Monolith)后，随之而来的应用不可维护的问题。这类问题在企业级 Web 应用中尤其常见。

qiankun 搭建的微前端框架，是一个 **基座** 管理**多个子应用**的模式。

## 关于本文

[项目地址](https://github.com/Picker666/qiankun-Picker)

版本:

```json
"qiankun": "^2.10.9",

"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "^6.13.0",

"vue": "^3.3.4",
"vue-router": "^4.2.2"

"antd": "^5.6.2",
```

## 基座

使用 react 搭建一个基座；

```git
npx create-react-app qiankun-base

yarn add qiankun
```

### 1、一个应用在前端展示需要提前注册 - `registerMicroApps`

```js
const apps = [
  {
    name: 'vueApp',
    entry: '//localhost:8081',
    container: '#container',
    activeRule: '/app-vue',
    loader: (loading) => {
      console.log('vueApp, loading: ', loading);
    },
    props: {
      name: 'vueApp',
    }
  },
  {
    name: 'reactApp',
    entry: '//localhost:3002',
    container: '#container',
    activeRule: (location) => {
      return location.pathname.startsWith('/app-react');
    },
    loader: (loading) => {
      console.log('reactApp, loading: ', loading);
    },
    props: {
      name: 'reactApp'
    }
  },
];

const lifeCycles = {
  beforeLoad: (app) => {
    console.log('app beforeLoad: ', app);
  },
  beforeMount: [(app) => {
    console.log('app beforeMount: ', app);
  }],
  afterMount: [
    (app) => {
      console.log('app afterMount1: ', app);
    },
    (app) => {
      console.log('app afterMount2: ', app);
    }
  ],
  beforeUnmount: (app) => {
    console.log('app beforeUnmount: ', app);
  },
  afterUnmount: (app) =>{
    console.log('app beforeUnmount: ', app);
  }
}

/**
 * registerMicroApps(apps, lifeCycles?)
 * apps - Array<RegistrableApp> - 必选，微应用的一些注册信息
  lifeCycles - LifeCycles - 可选，全局的微应用生命周期钩子
*/
registerMicroApps(
  apps,
  lifeCycles,
);
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

[具体字段和类型](https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles)

### 2、启动 - `start`

```js
/**
 * start(opts?)
  opts - Options 可选
*/
start({
  prefetch: function(a) {
    console.log('a======: ', a);
    return {
      criticalAppNames: ['reactApp']
    }
  },
  sandbox: {
    experimentalStyleIsolation: true,
    // strictStyleIsolation:  true,
  }
});
```

配置 启动qiankun 的一些配置信息，主要是**预加载**和**沙箱**

[具体字段和类型](https://qiankun.umijs.org/zh/api#startopts)

### 3、设置默认加载子应用（可选）

```js
setDefaultMountApp('/app-react');
```

### 4、关于全局状态管理的配置（可选）

```js
const actions = initGlobalState({rootCount: 0});

actions.onGlobalStateChange((state, prev) => {
  console.log('state,=============== prev: ', state, prev);
  // state: 变更后的状态; prev 变更前的状态
});
actions.setGlobalState({count: 2});
```

### 5、路由 - BrowserRouter

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 6、改造一下 app.jsx

```js
import { useState, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';

import './App.css';

const { Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const defaultKey = useRef(location.pathname.split('/')[1]);
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const items = useMemo(() => [{
    label: <Link to="/app-vue">Vue应用</Link>,
    icon: <DesktopOutlined/>,
    key: 'app-vue',
    title: 'Vue应用',
  },{
    label: <Link to="/app-react">React应用</Link>,
    icon: <PieChartOutlined />,
    key: 'app-react',
    title: 'React应用'
  }], []);

  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={[defaultKey.current]} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Content>
          <div id="container" className="site-layout-background" style={{ minHeight: 360 }}></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>This Project ©2021 Created by DiDi</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
```

`id="container"` 的div将是子应用渲染的地方。

## React子应用

几个点需要关注到

* 1、导出必要的生命周期

需要导出子应用的生命周期, qiankun 规定的三种生命周期，分别是：bootstrap、mount、 unmount。以下引用文档的描述。

* 2、关于render的处理

:::warning
  `<Router basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>` 要区分作为子应用运行还是独立运行。
:::

* 3、关于publicPath

* 4、独立运行的render

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './Main';

if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

let root = null;
const getRoot = (container) => {
  if (!root) {
    const rootEle = container ? container.querySelector('#root') : document.querySelector('#root');
    return ReactDOM.createRoot(rootEle);
  }
  return root;
};

function render(props) {
  const { container } = props;
  root = getRoot(container);

  root.render(
    <React.StrictMode>
      <Router basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
        <App />
      </Router>
    </React.StrictMode>);
}

// 独立运行 的render
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

const handleGlobalStateChange = (state, preState) => {
  console.log('==========state, preState: ', state, preState);
}

// bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等
export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

// 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
export async function mount(props) {
  console.log('[react16] props from main framework', props);
  props.onGlobalStateChange(handleGlobalStateChange)
  props.setGlobalState({count: 66});
  render(props);
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount(props) {
  root.unmount();
  root = null;
}

// 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
export async function update(props) {
  console.log('update props', props);
}

```

:::tip 关于webpack配置的更改

* 1、重写 cra 配置使用 [react-app-rewired](react-app-rewired)，关于跨域、打包输出的名字和格式以及publicPath；
* 2、注意端口号的更改 在命令中更改或者新建.env

:::

## vue 子应用

并没有什么特别的。

```js
// import Vue from 'vue';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vue.config.productionTip = false

// 文档中将此代码单独放到了一个文件中，此处是直接写在了 main.js 中，两种都可。但是 eslint-disable 需要加上
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  console.log('window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__: ', window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__); 
}

let instance = null;
function render(props = {}) {
  const { container } = props;
  // 文档中使用store，此处没有便删除了。
  // 文档中的router对象是在此处创建的，但是在router文件夹的index.js中已经创建好了，所以稍加改造直接导入就好，下方贴了代码
  instance = createApp(App).use(router)
  instance.mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时 直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

export async function mount(props) {
  console.log("[vue] props from main framework", props);
  render(props);
}

export async function unmount() {
  instance.unmount();
  // instance.$el.innerHTML = "";
  instance = null;
}
```

### 关于更改配置

```js
// vue.config.js
const { name } = require("./package");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    port: 8081
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      // libraryTarget: "window", // 
      // jsonpFunction: `webpackJsonp_${name}`,
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
  },
})
```
