# 二分法

## 一、是什么

在计算机科学中，二分查找算法，也称折半搜索算法，是一种在有序数组中查找某一特定元素的搜索算法

想要应用二分查找法，则这一堆数应有如下特性：

* 存储在数组中
* 有序排序

搜索过程从数组的中间元素开始，如果中间元素正好是要查找的元素，则搜索过程结束

如果某一特定元素大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找，而且跟开始一样从中间元素开始比较

如果在某一步骤数组为空，则代表找不到

这种搜索算法每一次比较都使搜索范围缩小一半

。。。

<!-- https://vue3js.cn/interview/algorithm/BinarySearch.html#%E4%B8%80%E3%80%81%E6%98%AF%E4%BB%80%E4%B9%88 -->

```js
function BinarySearch(arr, target) {
    if (arr.length <= 1) return -1
    // 低位下标
    let lowIndex = 0
    // 高位下标
    let highIndex = arr.length - 1

    while (lowIndex <= highIndex) {
        // 中间下标
        const midIndex = Math.floor((lowIndex + highIndex) / 2)
        if (target < arr[midIndex]) {
            highIndex = midIndex - 1
        } else if (target > arr[midIndex]) {
            lowIndex = midIndex + 1
        } else {
            // target === arr[midIndex]
            return midIndex
        }
    }
    return -1
}
```
