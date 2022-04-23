# 一个字符串出现最多的字母

```js
if (str.length === 1) {
  return str;
}

const charObj = {};
for (let i of Object.keys(str)) {
  const current = str[i];
  if (charObj[current] === undefined) {
    charObj[current] = 1;
  } else {
    charObj[current]++;
  }
}
let maxChar = '',
  maxNum = 0;

for (let i of Object.keys(charObj)) {
  const current = charObj[i];
  if (current > maxNum) {
    maxNum = current;
    maxChar = i;
  }
}

console.log(maxChar, '=======', maxNum);
```

简化版

```js
const maxDuplication2 = (str: string) => {
  if (str.length === 1) {
    return str;
  }

  let maxChar = '',
    maxNum = 0;

  const charObj = {};
  for (let i of Object.keys(str)) {
    const current = str[i];
    if (charObj[current] === undefined) {
      charObj[current] = 1;
    } else {
      charObj[current]++;
    }

    if (charObj[current] > maxNum) {
      maxChar = current;
      maxNum = charObj[current];
    }
  }

  console.log(maxChar, '=======', maxNum);
};
```