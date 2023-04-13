# 虚拟DOM

## 什么是虚拟DOM

虚拟DOM(元素)是一个一般的js对象，准确的说是一个**倒立的对象树**

虚拟DOM保存了真实DOM的**层次关系**和**基本属性**，与真实DOM**一一对应**

如果只是更新虚拟DOM，页面**不会重绘**，大大提高了绘制效率。

## 为什么虚拟DOM更快

* 1、减少DOM操作的次数

虚拟DOM可以将多次操作合并成一次操作；

比如，添加1000个节点，传统方式是一个个的添加，使用虚拟DOM 是一次性添加。

* 2、减少DOM操作的范围

虚拟DOM可以借助DOM diff 把多余的操作省掉；

借助 DOM diff，检测时新增、删除和更改的DOM，仅仅对这些进行更改。

比如，添加1000个节点基础上，再添加10个，传统方式是循环一个个的添加，操作1010次，使用虚拟 DOM 是，对比发现仅仅有10元素是新增的，然后，一次性添加10节点。

## 虚拟DOM长什么样

```js
const cNode = {
  key: null, 
  type: 'div',
  props: {
    children: [
      {type: 'span', ...},
      {type: 'span', ...}
    ],
    className: 'red', 
    onClick: () => {}
  },
  ref: null,
  ...
}
```

## 虚拟DOM创建

`createElement`方法可以帮我们创建一个虚拟DOM，来模仿你想要的真实DOM的结构

参数：

* 1、tag：DOM元素的标签（ 'a' , 'p ', 'div' ...）
* 2、props：DOM元素的属性（ {className:'box' , id:'container' , style:{fontSize:'20px'} , key:1 , ...}）
* 3、children：DOM元素的内容（ 字符串或其他虚拟DOM元素组成的数组 ）

```js
// 用 createElement 方法创建一个虚拟DOM的结构
let virtualDOM = createElement('div',{id:'container'},[
    createElement('p',{className:'msg',key:1},'这是一条消息'),
    createElement('p',{className:'msg',key:2},'这是另一条消息'),
    createElement(null,null,'这是一条没有标签包裹的文本'),
    createElement('button',{className:'btn',key:3},'按钮')
]);
```

但是，在我们实际的开发中是这样的

```jsx
<div id="container">
  <p className="msg" key={1}>这是一条消息</p>
  <p className="msg" key={2}>这是另一条消息</p>
  这是一条没有标签包裹的文本
  <button className="btn" key={2}>按钮</button>
</div>
```

实际上是我们通过 loader babel 将 我们的jsx语法转化成 createElement 的形式。

## 虚拟DOM到真实的DOM

render方法：`render( virtualDOM, DOM )`

`render` 方法可以将你的虚拟DOM解析成真实的DOM并渲染到页面上

参数：

* 1、virtualDOM：需要解析的虚拟DOM
* 2、DOM：需要渲染在哪个DOM里

```js
render(virtualDOM,document.getElementById('root'));
```

## 虚拟DOM原理

### 1、初始化：定义类型

```js
// 定义一个tag类型集合
const tagTypes = {
    HTML:"HTML",
    TEXT:"TEXT"
}


// 定义children类型集合
const childrenTypes = {
    // 子元素只有一个  说明是字符串
    single:"single",
    // 子元素是一个数组  数组里是多个元素
    many:"many",
    // 子元素是一个空  没有子元素
    empty:"empty"
}
```

### 2、createElement()

实现原理：根据你传入参数的类型，返回一个对应出来你想要的结构的整合后的JS对象。

```js
// 创建虚拟dom的方法
function createElment(tag,props,children){
    
    // 定义tag类型
    let type;
    
    // 如果tag存在，那么该元素就是HTML元素，否则是字符串
    if(typeof tag === 'string'){
        type = tagTypes.HTML;
    }else{
        type = tagTypes.TEXT;
    }

    // 定义children类型
    let childrenType;
    
    // 如果children是文本的时候就创建一个文本虚拟dom
    // 如果children是数组的时候就创建一个有子节点的虚拟dom
    // 如果children是空的时候就创建一个空虚拟dom
    if(typeof children === 'string'){
        childrenType = childrenTypes.single;
        // createTextNode:创建文本DOM方法
        children = createTextNode(children)
    }else if(Array.isArray(children)){
        childrenType = childrenTypes.many;
    }else{
        childrenType = childrenTypes.empty;
    }

    // 返回虚拟dom对象
    return {
        el:null,
        type,
        tag,
        props,
        children,
        childrenType
    }
}

//创建文本虚拟dom，直接返回一个对应的文本虚拟DOM
function createTextNode(text){
    return {
        type:'text',
        tag:null,
        props:null,
        children:text,
        childrenType:childrenTypes.empty
    }
}
```

### 3、render()

```js
// 渲染方法
function render(vnode, container){

    if(container.vnode){
        // 如果虚拟DOM已经存在，那么执行更新
        // 这一步是相当复杂的diff算法，单独开辟章节来讲，此处暂时只考虑首次渲染
    }else{
        // 如果虚拟DOM没有存在，那么执行挂载（首次渲染）
        mounted(vnode, container);
    }

    // 判断是初次渲染还是更新渲染
    container.vnode = vnode;
}

// 首次渲染函数
function mounted(vnode,container){
    
    let {type} = vnode;
    if(type === 'HTML'){
        // 渲染HTML元素方法
        mountedElement(vnode,container)
    }else{
        // 渲染文本元素方法
        mountedText(vnode,container)
    }
}

// 渲染HTML元素的方法
function mountedElement( vnode, container ){
    let { type, tag, props, children, childrenType } = vnode;
    // el是真是的DOM元素，此处创建tag对应的DOM元素并赋给el
    var el = document.createElement(tag);
    vnode.el = el;
    
    // 遍历设置props属性
    if(props){
        for(var key in props){
            /*  设置DOM的属性(方法在代码最后)
                语法:patchProps( 设置属性的元素, 属性的key值, 旧的value值, 新的value )  */
            patchProps(el,key,null,props[key])
        }
    }
    
    // 判断该元素的子元素的类型
    if(childrenType === childrenTypes.single){
        // 如果 childrenType 属性为 single 那么肯定是文本，用渲染文本方法将子元素渲染
        mountedText(children, el)
    }else if(childrenType === childrenTypes.many){
        // 如果 childrenType 属性为 many 则肯定是嵌套子元素，遍历后用首次渲染方法将子元素渲染（递归）
        children.forEach((item)=>{
            mounted( item, el )
        })
    }

    // 渲染完成后，最终要插入到父级里面（最高父级就是root）
    container.appendChild(el);
}

// 渲染文本虚拟dom的方法
function mountedText(vnode,container){
    // 创建一个对应的文本节点，直接插入父元素
    var textNode = document.createTextNode(vnode.children);
    vnode.el = textNode;
    container.appendChild(textNode);
}

// 挂载属性的方法(部分情况)
// patchProps( 设置属性的元素, 属性的key值, 旧的value值, 新的value )
function patchProps(el, key, oldVal, newVal) {
    switch (key) {
        case 'className':
            el.className = newVal;
            break;
        case 'id':
            el.id = newVal;
            break;
        case 'onClick':
            el.addEventListener("click", newVal);
            break;
        case 'style': {
            for (var sKey in newVal) {
                el.style[sKey] = newVal[sKey];
            }
            break;
        }
        default:
            if (key != 'key') {
                el.setAttribute(key, newVal);
            }

    }
}
```
