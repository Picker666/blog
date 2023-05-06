# 数青蛙

给你一个字符串 croakOfFrogs，它表示不同青蛙发出的蛙鸣声（字符串 "croak" ）的组合。由于同一时间可以有多只青蛙呱呱作响，所以 croakOfFrogs 中会混合多个 “croak” 。

请你返回模拟字符串中所有蛙鸣所需不同青蛙的最少数目。

要想发出蛙鸣 "croak"，青蛙必须 依序 输出 ‘c’, ’r’, ’o’, ’a’, ’k’ 这 5 个字母。如果没有输出全部五个字母，那么它就不会发出声音。如果字符串 croakOfFrogs 不是由若干有效的 "croak" 字符混合而成，请返回 -1 。

示例 1：

输入：croakOfFrogs = "croakcroak"
输出：1
解释：一只青蛙 “呱呱” 两次

示例 2：

输入：croakOfFrogs = "crcoakroak"
输出：2
解释：最少需要两只青蛙，“呱呱” 声用黑体标注
第一只青蛙 "crcoakroak"
第二只青蛙 "crcoakroak"

示例 3：

输入：croakOfFrogs = "croakcrook"
输出：-1
解释：给出的字符串不是 "croak" 的有效组合。

提示：

1 <= croakOfFrogs.length <= 105;

字符串中的字符只有 'c', 'r', 'o', 'a' 或者 'k'

```js
var minNumberOfFrogs = function(croakOfFrogs) {

    let count = 0;
    let croakingCount = 0;
    let croaking = {
        c:{
            count: 0,
        },
        r:{
            count: 0,
            last: 'c'
        },
        o:{
            count: 0,
            last: 'r'
        },
        a:{
            count: 0,
            last: 'o'
        },
        k:{
            count: 0,
            last: 'a'
        },
    };

    const length = croakOfFrogs.length;

    for(let i=0;i< length; i++) {
        const char = croakOfFrogs[i];
        const {last} = croaking[char];
        croaking[char].count ++;
        if (last) {
            croaking[last].count --;

            if (croaking[last].count === -1) {
                return -1;
            }

            if (char === 'k') {
                croakingCount --; 
            } 
        } else {
            croakingCount ++;
        }

        if (croakingCount > count) {
            count = croakingCount;
        }
    }

    const keys = Object.keys(croaking);
    const isFinish = keys.some(char =>  croaking[char].count !== 0 && char !== 'k');
    if (isFinish) {
        return -1;
    }

    return count;
};
```

```js
var minNumberOfFrogs = function(croakOfFrogs) {
    if (croakOfFrogs%5) {
        return -1;
    }

    let count = 0;
    let croakingCount = 0;
    
    let croaking = {c:0,r:1, o:2,a:3,k:4};
    let arr = new Array(5).fill(0);

    const length = croakOfFrogs.length;

    for(let i=0;i< length; i++) {
        const char = croakOfFrogs[i];
        const index = croaking[char];
        arr[index] += 1;
         
        if (index) {
            if (arr[index-1] === 0) {
                return -1;
            }
            arr[index-1] --;

            
            if (index === 4) {
                croakingCount --; 
            } 
        } else {
            croakingCount ++;
            if (croakingCount > count) {
                count = croakingCount;
            }
        }
    }

    if (croakingCount) {
        return -1;
    }

    return count;
};
```