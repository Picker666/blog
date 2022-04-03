[# 数之和

## 两数之和

给i顶一个整数数组 nums 和一个目标值 target ，请你在该数组中找出为目标值的那两个整数，并返回他们的下标

你可以假设没中输入只会对应一个答案，但是，不能重复利用这个数组中同样的元素。

::: tip
给定 nums = [2, 7, 11, 15] target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9 

所以返回 [0, 1];
:::

### 解题思路

* 利用 Map 存储与已遍历元素的差值， has 方法判断元素是否为已遍历某个元素存储的差值；
* 从第一个元素开始遍历；
* 获取目标值与 nums[i] 的差值，即 k = target - nums[i]，判断差值k 在 map中是否存在；
  * 不存在， 则加入map，nums[i] 为 key，i为value，
  * 存在，则返回下标 map.get(k)和i
* 遍历结束，返回nums。

时间复杂度O(n)

### 代码

```js
const algorithm1 = (nums: number[], target: number) => {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const k = target - nums[i];
    if (map.has(k)) {
      return [map.get(k), i];
    }
    map.set(nums[i], i);
  }
  return [];
};
```

## 三数之和

给定一个包含n个整数的数组 nums， 判断 nums 中是否存在三个元素 a, b, c, 使得 a + b + c = 0？请找出所有的满足条件且不重复的三元数组。

### 三元组不能重复！！！

::: tip
nums = [-1, 0, 1, 2, -1, -1];

结果：
[[-1, 0, 1], [-1, -1, 2]]

```js
const algorithm2 = (nums: number[], target: number) => {
  const result = [];
    let map = new Map();
    for (let i = 0; i < nums.length - 2; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const innerK = target - nums[i] - nums[j];
        if (map.has(innerK)) {
          result.push([i, map.get(innerK), j]);
          break;
        }
        map.set(nums[j], j);
      }
      map.clear();
    }
    return result;
};
```

### 没有重复元素！！！

```js
const algorithm2 = (nums: number[], target: number) => {
  const result = [];
  const set = new Set();
  for (let i = 0; i < nums.length; i++) {
    const k = target - nums[i];
    let map = new Map();

    for (let j = i + 1; j < nums.length && i < nums.length - 2; j++) {
      const innerK = k - nums[j];
      if (map.has(innerK) && !(set.has(i) || set.has(j))) {
        result.push([i, map.get(innerK), j]);
        set.add(i);
        set.add(map.get(innerK));
        set.add(j);
        break;
      }
      map.set(nums[j], j);
    }
  }
  return result;
};
```
