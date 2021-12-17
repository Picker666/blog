# promise 手写

## promise.all

```js
function PromiseAll(promises){
    return new Promise((resolve, reject)=>{
        if(!Array.isArray(promises)){
            throw new TypeError("promises must be an array")
        }
        let result = []
        let count = 0
        promises.forEach((promise, index) => {
            promise.then((res)=>{
                result[index] = res
                count++
                count === promises.length && resolve(result)
            }, (err)=>{
                reject(err)
            })
        })
    })
}
```

## promise.finally

```js
Promise.prototype.finally = function (cb) {
  return this.then(function (value) {
    return Promise.resolve(cb()).then(function () {
      return value
    })
  }, function (err) {
    return Promise.resolve(cb()).then(function () {
      throw err
    })
  })
}
```

## promise.allSettled

```js
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])

  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )

  return new Promise((resolve, reject) => {
    const result = []
    let unSettledPromiseCount = _promises.length

    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }

        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }

        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```

## promise.race

```js
Promise.race = function(promiseArr) {
    return new Promise((resolve, reject) => {
        promiseArr.forEach(p => {
            Promise.resolve(p).then(val => {
                resolve(val)
            }, err => {
                rejecte(err)
            })
        })
    })
}
```

## promise.any

```js
Promise.any = function(promiseArr) {
    let index = 0
    return new Promise((resolve, reject) => {
        if (promiseArr.length === 0) return 
        promiseArr.forEach((p, i) => {
            Promise.resolve(p).then(val => {
                resolve(val)

            }, err => {
                index++
                if (index === promiseArr.length) {
                  reject(new AggregateError('All promises were rejected'))
                }
            })
        })
    })
}
```

## resolve

```js
Promise.resolve = function(value) {
    if(value instanceof Promise){
        return value
    }
    return new Promise(resolve => resolve(value))
}
```

## rejecte

```js
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => reject(reason))
}
```
