# NextJs 渲染方式的区别

## SSR(Server-side Rendering)

### 特点

* 每次请求页面时候生成html；
* export async function getServerSideProps

### 运行时机

* 直接请求页面时候，请求的时候运行 getServerSideProps，并以其结果作为组件的props；
* 在客户端通过 next/link 或者 next/router 跳转时，nextjs向运行 getServerSideProps 的服务器发送请求，运行getServerSideProps。

### 适用场景

每次请求页面都需要最新数据；

:::tip
只有header配置cache-control才能被缓存；

res.setHeader(
  'Cache-Control',
  'public, s-maxage=10, stale-while-revalidate=59',
);
:::

## SSG(Static Site Generation)

### 适用于SSG的场景

* 不需要依赖外部数据的页面；
* 需要外部数据进行与渲染，内容依赖外部数据（getStaticProps）和路径依赖外部数据（getStaticPaths）；

### 特点

* 可以是，返回 async getStaticProps/getStaticPaths 方法，也可以是纯React组件；
* 构建时生成静态html，调用getStaticProps/getStaticPaths，并把其结果生成JSON文件；
* 请求该页面时，传递json数据作为 组件的props，进行与预渲染；

### 适用 getStaticProps 的场景

* 该数据是页面渲染必须的数据，需要保证用户请求之前，构建时可用；
* 数据来自 headless CMS ？
* 页面必须预渲染（SEO）和快速响应，使用 getStaticProps 可在构建时生成 html和json数据，并通过cdn缓存，以提高性能；
* 数据可以被公开缓存。可以通过中间件重写路径绕过此条件。

### getStaticProps 运行时机

* 构建时（next build）
* fallback:true, 运行在后台
* fallback：blocking，初始渲染之前调用
* 使用revalidate 时，在后台运行
* 使用revalidate 时，在后台**按需**运行

:::tip

当与增量静态再生（Incremental Static Regeneration）相结合时，getStaticProps将在后台运行，同时重新验证过时的页面，并将新页面提供给浏览器。

getStaticProps无法访问传入请求（如查询参数或HTTP标头），因为它生成静态HTML。如果您需要访问页面请求，请考虑除了使用getStaticProps之外还使用中间件。
:::

### 适用 getStaticPaths 的场景

前提：如果一个页面是 **动态路由** 并且使用了 **getStaticProps** 方法，这时候需要定义个静态生成的路径列表；

* 页面数据来自headless CMS
* 页面数据来自数据库
* 页面数据来自文件系统
* 数据可以被公开缓存
* 页面必须预渲染（SEO）和快速响应，使用 getStaticProps 可在构建时生成 html和json数据，并通过cdn缓存，以提高性能。

### getStaticPaths 运行时机

* 构建时（next build）
* fallback:true, 运行在后台
* fallback：blocking，初始渲染之前调用。

### getStaticPaths 可以用在哪

* 必须和getStaticProps一起使用
* 不能和getServerSideProps 一起使用
* 不能在**非page**文件下使用
* 不能作为组件的属性

:::tip
按需生成，过多的生成将会降低build速度
:::

## ISR(Incremental Static Regeneration)

### 特点

* getStaticProps 方法返回值中添加 revalidate：number，最多多少秒刷新一下page；
* revalidate 在服务端使用response.revalidate(path) 来重新验证路由api
