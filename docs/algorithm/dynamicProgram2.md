#  最长回文子串

给你一个字符串 s，找到 s 中最长的回文子串。

如果字符串的反序与原始字符串相同，则该字符串称为回文字符串。

示例 1：

输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。

示例 2：

输入：s = "cbbd"
输出："bb"

提示：

1 <= s.length <= 1000
s 仅由数字和英文字母组成

```js
var palindromeCalc = function (s, start, end, length, currentPalindrom) {
    const currentLength = end - start + 1
    const { palindromLength } = currentPalindrom;

    if(start === end || s[start] === s[end]) {
        if (palindromLength < currentLength) {
            currentPalindrom.start = start;
            currentPalindrom.palindromLength = currentLength;
        }
        if (start > 0 && end < length - 1) {
            palindromeCalc(s, start-1, end +1, length, currentPalindrom);
        }
    }
}
var longestPalindrome = function(s) {
    const length = s.length;
    const currentPalindrom = {
        start: '',
        palindromLength: 0
    };
  
    for (let i = 0; i <= length-1; i++) {
        let start = i;
        let end = i;
        while(start > 0 && s[i] === s[start-1]) {
            start --;
        }
        while(end < length - 1 && s[end+1] === s[i]) {
            end ++;
        }
        palindromeCalc(s, start, end, length, currentPalindrom);
    }

    const {start, palindromLength} = currentPalindrom;

    return s.slice(start, start + palindromLength);
};
```
