# 洗牌算法

## 方法一(Fisher-Yates)

从原数组中随机抽取一个元素放入新数组；

* 1、从原数组（假如长度为n）中，随机生成一个索引 random
* 2、从原数组中删除第 random 个元素并将其push到新数组
* 3、重复第2步直到所有元素取完
* 4、最终得到一个新的打乱的数组

```js
const shuffle1 = arr => {
    let res = [], random
    while (arr.length > 0) {
        random = parseInt(Math.random() * arr.length)
        res.push(arr.splice(random, 1)[0])
        
    }
    return res
}

shuffle1([2,3,6,2,6,2]) // [6, 3, 2, 2, 2, 6]
```

这种算法要去除原数组 arr 中的元素，所以时间复杂度为 O(n2)

## 方法二(Knuth-Durstenfeld ShuffleFisher-Yates)

每次从原数组中随机取一个元素，然后把该元素跟最后一个元素交换，即数组的尾部放的是已经处理过的元素

这是一种原地打乱的算法，不会产生新的数组，每个元素随机概率也相等，时间复杂度从 Fisher 算法的 O(n2)提升到了 O(n)

* 1、假设原数组长度为n，生成一个0～n-1的随机数random，然后将第random个元素跟数组最后一个元素交换
* 生成一个0～n-2的随机数random，然后将第random个元素跟数组倒数第二个元素交换
* 以此类推，直到交换结束为止

```js
const shuffle2 = arr => {
    let n = arr.length,
        tmp,
        random
    while(n != 0){
        random = parseInt(Math.random() * n)
        n-- // n减一，方便下一趟循环继续交换
        // 交换
        tmp = arr[length]
        arr[length] = arr[random]
        arr[random] = tmp
    }
    return arr
}

shuffle2([2,3,6,2,6,2]) // [6, 3, 2, 2, 6, 2]
```

## sort

利用Array的sort方法可以更简洁的实现打乱，对于数量小的数组来说足够。因为随着数组元素增加，随机性会变差。

随机返回-0.5到0.5的值，数组顺序进行随机交换，就实现了洗牌，也可以理解为数组排序规则不固定，穿插从大到小或者从小到大，从而实现随机。

```js
const shuffle3 = arr => arr.sort(() => 0.5 - Math.random())

shuffle3([2,3,6,2,6,2]) // [6, 2, 2, 2, 3, 6]
```

## ES6

Knuth-Durstenfeld shuffle 的 ES6 实现，利用位运算符，代码更简洁

```js
const shuffle4 = arr => {
    let len = arr.length, random
    while(len != 0){
        random = (Math.random() * len--) >>> 0; // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
        [arr[len], arr[random]] = [arr[random], arr[len]] // ES6的结构赋值实现变量互换
    }
    return arr
}

shuffle4([2,3,6,2,6,2]) // [3, 6, 6, 2, 2, 2]
```
