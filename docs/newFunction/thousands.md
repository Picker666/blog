# 添加千分符

```js
const str = "100000000000",
    reg = /(?=(\B\d{3})+$)/g;
    // reg = /(?=(\B\d{3})+($|\.))/g;
str.replace(reg, ",");
```
