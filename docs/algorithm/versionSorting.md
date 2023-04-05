# 版本号排序

## 使用sort

```js
const sortingArr = arr.slice();
sortingArr.sort((a, b) => {
  const arrA = a.split('.');
  const arrB = b.split('.');

  let i = 0;
  while (true) {
    const aVal = arrA[i];
    const bVal = arrB[i];
    if (aVal === undefined || bVal === undefined) {
      return arrA.length - arrB.length;
    } else if (aVal !== bVal) {
      return aVal - bVal;
    }
    i++;
  }
});
```

## 原生 快速排序

```js
const compare = (a, b) => {
  const arrA = a.split('.');
  const arrB = b.split('.');

  let i = 0;
  while (true) {
    const aVal = arrA[i];
    const bVal = arrB[i];
    if (aVal === undefined || bVal === undefined) {
      return arrA.length - arrB.length;
    } else if (aVal !== bVal) {
      return aVal - bVal;
    }
    i++;
  }
};

const sorting3 = (data, left, right) => {
  if (left >= right) {
    return data;
  }

  const temp = data[left];

  let i = left;
  let j = right;

  while (j > i) {
    let differ;
    while (j > i && differ === undefined) {
      differ = compare(temp, data[j]);
      if (differ <= 0) {
        j--;
        differ = undefined;
      }
    }

    data[i] = data[j];

    differ = undefined;

    while (j > i && differ === undefined) {
      differ = compare(temp, data[j]);

      if (differ >= 0) {
        i++;
        differ = undefined;
      }
    }

    data[j] = data[i];
  }

  data[i] = temp;

  let newData = sorting3(data, left, i);
  newData = sorting3(data, i + 1, right);
  console.log(newData);
  return newData;
};
```
