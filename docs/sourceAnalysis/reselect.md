# reselect 源码分析

## 为什么使用reselect？

`说来话长，一切要从redux说起，redux` 在每一次dispatch之后都会让注册的回调都执行一遍，然后就是 `connect` 函数的锅了，connect实际上就是一个高阶组件，来看看 `connect` 的简单实现

```js
export const connect = (mapStateToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }

    constructor () {
      super()
      this.state = { allProps: {} }
    }

    componentWillMount () {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())  // 这里可以发现connect函数返回的这个高阶组件帮我们在redux的store里面注册了一个函数，而这个函数的作用就是获取新的state和props，然后触发一次setState，这就必然会导致这个高阶组件的重新render，如果子组件不是继承自PureComponent或做过其他处理，那么子组件也必然会重新render，即使可能该组件涉及到的state和props都没有发生变化，这样一来就产生了性能问题，其实这个问题还好解决，通过继承PureComponent或者自己在shouldCOmponentUpdate里面做判断即可解决。但是另一个不可避免的性能问题在于mapStateToProps函数的执行，如果前端管理的数据十分复杂，每次dispatch以后所有用到store的组件都要计算mapStateToProps自然就会浪费性能，解决这个问题的方法改造mapStateToProps的入参函数，在入参函数里面缓存一个旧值，然后每次执行mapStateToProps的时候就利用新值和旧值缓存的一个浅比较来判断是否返回原值，如果浅比较相同就直接返回原值，这样就不用再做计算，节省了性能。这样对于性能的提高往往是很大的，因为一次dispatch一般只改变很少的内容。
    }

    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps(store.getState(), this.props) // 额外传入 props，让获取数据更加灵活方便
      this.setState({
          allProps: { // 整合普通的 props 和从 state 生成的 props
          ...stateProps,
          ...this.props
          }
      })
    }

    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }

  return Connect;
}
```

于是乎，reselect就出现了，来看看reselect的源码，注释里面写了解读

```js
function defaultEqualityCheck(a, b) {
    return a === b
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
      return false
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  const length = prev.length
  for (let i = 0; i < length; i++) {
      if (!equalityCheck(prev[i], next[i])) {
          return false
      }
  }

  return true
}

export function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function () {
      if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
          // apply arguments instead of spreading for performance.
          lastResult = func.apply(null, arguments)  
          // defaultMemoize被调用了两次，一次是执行函数返回一个selector，每次dispatch之后传入selector的参数是state和props，而state总是会发生变化的，所以前面的判断总是会进入到这里
          // 第二次调用时，这里的arguments是dependency函数的运算结果，而前面的判断就是看这些运算结果是否发生了变化，如果依赖项没有发生变化，及直接返回旧值
      }

      lastArgs = arguments
      return lastResult
  }
}

function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs

  if (!dependencies.every(dep => typeof dep === 'function')) {
      const dependencyTypes = dependencies.map(
          dep => typeof dep
      ).join(', ')
      throw new Error(
          'Selector creators expect all input-selectors to be functions, ' +
          `instead received the following types: [${dependencyTypes}]`
      )
  }

  return dependencies
}

export function createSelectorCreator(memoize, ...memoizeOptions) {
  // 返回的这个函数就是最后导出的createSelector，memorize是传入的defaultMemorize函数
  // createSelector的入参是dependency函数和一个获取最终数据的函数
  // dependency函数可以放在一个数组里面也可以直接传入
  return (...funcs) => {
    let recomputations = 0
    const resultFunc = funcs.pop()  // pop出来的就是最后获取数据的函数
    const dependencies = getDependencies(funcs)  // 获取dependency数组

    const memoizedResultFunc = memoize(
      function () {
        recomputations++
        // apply arguments instead of spreading for performance.
        return resultFunc.apply(null, arguments)
      },
      ...memoizeOptions
    )

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    const selector = memoize(function () {
      const params = []
      const length = dependencies.length

      for (let i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments))
      }

      // apply arguments instead of spreading for performance.
      return memoizedResultFunc.apply(null, params) 
      // params数组存放着dependency函数的运算结果，被当做arguments传入memoizedResultFunc，其实每次dispatch之后都会触发dependency函数的重新计算，至于控制性能的问题是在memoizedResultFunc里面实现的
    })

    selector.resultFunc = resultFunc
    selector.dependencies = dependencies
    selector.recomputations = () => recomputations
    selector.resetRecomputations = () => recomputations = 0
    return selector
  }
}

export const createSelector = createSelectorCreator(defaultMemoize)
// 这里export的createSelector函数就是我们所使用的函数

export function createStructuredSelector(selectors, selectorCreator = createSelector) {
  if (typeof selectors !== 'object') {
    throw new Error(
      'createStructuredSelector expects first argument to be an object ' +
      `where each property is a selector, instead received a ${typeof selectors}`
    )
  }
  const objectKeys = Object.keys(selectors)
  return selectorCreator(
    objectKeys.map(key => selectors[key]),
      (...values) => {
      return values.reduce((composition, value, index) => {
        composition[objectKeys[index]] = value
        return composition
      }, {})
    }
  )
}
```

## 总结

关于为什么redux每次dispatch一个action之后总是返回一个新的state？

如果总是修改原来的state，则可能无法触发新的渲染
可以实现回滚
reselect的出现就是为了避免一些不必要的mapStateToProps的计算，提升性能。
