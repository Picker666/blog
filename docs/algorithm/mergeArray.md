# 合并有序数组

```js
function merge(left, right) {
    let i = 0
    let j = 0
    const temp = []
    while(i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            temp.push(left[i])
            i++
        } else {
            temp.push(right[j])
            j++
        }
    }
    while(i < left.length) {
        temp.push(left[i])
        i++
    }
    while(j < right.length) {
        temp.push(right[j])
        j++
    }
    return temp
}
```
