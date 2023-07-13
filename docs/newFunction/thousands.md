# 添加千分符

```js
const str = "100000000000",
    reg = /(?=(\B\d{3})+$)/g;
    // reg = /(?=(\B\d{3})+($|\.))/g;
str.replace(reg, ",");
```

但是会与一个问题：

```js
var a = '123456789.9656789';
a.replace(/(?=(\B\d{3})+(\.|$))/g, ',');// '123,456,789.9,656,789'
```

总解决方案：

```js
var a = '123456789.9656789';
a.replaceAll(/(?<!\.\d*)(?=(\B\d{3})+($|\.))/g, ',');// '123,456,789.9656789'
```

## 保留小数

```js
function formatPrecision() {
 let [int, decimal=''] = val.split('.');
  const decimalLength = decimal.length;
  if (decimalLength > precision) {
    if (precision === 0) {
      const next = decimal[0];
      if (next > 4) {
        int++;
      }
      return String(int);
    }
    let pre = decimal.slice(0, precision - 1);
    let current = decimal[precision - 1];
    const next = decimal[precision];
    if (next > 4) {
      current++;

      if (current > 9) {
        current = current % 10;
        const oldPreLength = pre.length;
        pre++;
        pre = pre.toString();
        if (pre.length > oldPreLength) {
          pre = pre.slice(1);
        }
        int++;
      }
    }
    decimal = '.' + pre + current;
  } else if (decimalLength < precision) {
    const delta = precision - decimalLength;
    let i = 0;
    while (i<delta) {
      decimal += '0';
      i++;
    }
    decimal = '.' + decimal;
  }
  return int + decimal;
}
```
