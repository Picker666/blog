# 回文

```js
const palindrome = (str: string) => {
  if (str.length < 2) {
    return false;
  }

  let i = 0,
    j = str.length - 1;

  const reg = /[a-zA-Z]/;
  let result = true;

  while (result && i < j) {
    if (reg.test(str[i]) && reg.test(str[j])) {
      result = str[i].toLocaleUpperCase() === str[j].toLocaleUpperCase();
    } else {
      result = str[i] === str[j];
    }
    i++;
    j--;
  }
  console.log(result);
};

```