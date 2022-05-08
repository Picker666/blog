# flex 项目属性 flex

[flex](/base/css/flexBox.html#_5、flex)

## 一、默认值

```js
flex: 0 1 auto;

flex-grow: 0; // 当空间有剩余时，不会伸展；
flex-shrink: 1; // 当空间不足时 按比例缩减
flex-basis: auto; // 元素宽度自动撑开。（我们例子中设置了宽度，以设置的宽度为准）
```

::: tip
**比例缩减**：参考flex-shrink 值得比例和盒子宽度的比例。

**关于盒子宽度**

* 如果设置 `flex-basis` 将以 `flex-basis` 的值为准，再此基础上进行 拉伸和压缩
* 如果没有设置 `flex-basis`，或者其值为 `auto`, 将以设置的 width 为准，再此基础上进行 拉伸和压缩
* 如果没有设置 `flex-basis`，或者其值为 `auto`，并且没有设置 width，将以元素撑开的宽度为准，再此基础上进行 拉伸和压缩
:::

### 1、宽度充足时

此时不会发生拉伸。

![宽度充足时](/blog/images/base/flexItemSetting1.png)

### 2、宽度不足时

宽度不足，此时按照元素宽度比例收缩。

![宽度不足时](/blog/images/base/flexItemSetting2.png)

## 二、flex: none

```js
flex: none;

flex-grow: 0; // 当空间有剩余时，不会伸展；
flex-shrink: 0; // 当空间不足时 不会缩减
flex-basis: auto; // 元素宽度自动撑开。（我们例子中设置了宽度，以设置的宽度为准）
```

### 1、宽度充足时

此时不会发生拉伸。

![宽度充足时](/blog/images/base/flexItemSetting3.png)

### 2、宽度不足时

此时不会发生压缩，并且宽度溢出

![宽度充足时](/blog/images/base/flexItemSetting4.png)

## 三、flex: n

```js
flex: n 1 0;

flex-grow: n; // 当空间有剩余时，按比例拉伸；
flex-shrink: 1; // 当空间不足时 按比例压缩
flex-basis: 0; // 元素宽度为0。（我们例子中设置了宽度，但是以flex-basis的宽度为准）
```

因为 `flex-basis: 0`, 将覆盖 `width`设置宽度，并且，总是处于空间充足，元素被按比例拉伸。

![flex: n](/blog/images/base/flexItemSetting5.png)

::: tip
当项目的flex值不一致时，按照n的比例来分配空间。
:::

## 四、flex: 1 1 `npx`

此时，`npx`覆盖`width`的值。按比例拉伸或者压缩。

### 1、宽度充足时

此时会发生拉伸，并且会按照 1:1 的比例占取剩余空间。

![宽度充足时](/blog/images/base/flexItemSetting6.png)

### 2、宽度不足时

此时会发生压缩，并且会按照 'npx'宽度之比（200：300）来分配空间。

![宽度充足时](/blog/images/base/flexItemSetting7.png)

## 五、flex: x y `npx`

`npx`覆盖`width`的值。按比例拉伸或者压缩。

空间充足时，会按照比例（项目的x之比）来分配多余空间；

空间不足时，会

### 1、宽度充足时

此时会发生拉伸，并且会按照 3:2 的比例占取剩余空间。

![宽度充足时](/blog/images/base/flexItemSetting8.png)

### 2、宽度不足时

此时会发生压缩，并且会按照 'npx'宽度之比（200：300）来分配空间。

![宽度充足时](/blog/images/base/flexItemSetting9.png)
