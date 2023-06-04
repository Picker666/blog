# NextJS - Images

Next.js 对图片资源做了以下优化：

* 1、尺寸优化：使用WebP和AVIF等现代图像格式，自动为每个设备提供正确尺寸的图像；
* 2、视觉稳定性：防止在加载图像时自动切换布局；
* 3、更快的页面加载：图像只有在使用本地浏览器延迟加载（可选模糊占位符）进入视口时才会加载；
* 4、资产灵活性：根据需要调整图像大小，即使是存储在远程服务器上的图像。

Next.js 提供了 Image 组件，可以通过 `src` 属性引用本地或者远程的图片。

```js
import Image from 'next/image';
```

## 本地图片

基于引入图片资源，Next.js 将自动决定图片的 `width` 和 `height`。在图片加载时候，这里的 `width` 和 `height` 将用来预先占位，防止布局偏移。

:::tip
不支持，动态加载 `await import()` 或者 `require()`，因为动态加载在构建（next build）时候不能分析得到 `width` 和 `height`。
:::

## 远程图片

因为在构建的时候不能获取到图片，所以，需要设置 `width` 和 `height` ，可以选的 `blurDataURL`;

:::tip
`blurDataURL` 图片被用作占位图片，当 `src` 图片没有加载出来之前， 但是只能 `placeholder="blur"` 时才能生效。
:::

此时设置的 `width` 和 `height` 并不能决定图片渲染的尺寸，图片还是会按照实际尺寸渲染。

为了安全的获取图片资源，可以定义一个支持的 url 配置列表 在 next.config.js;

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
    ],
  },
};
```

以上设置只能存 `https://s3.amazonaws.com/my-bucket` 下去图片。
