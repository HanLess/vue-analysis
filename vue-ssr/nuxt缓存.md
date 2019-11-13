在 vue ssr 官网中提到了两种缓存形式

- 页面级别缓存 (Page-level Caching)

- 组件级别缓存 (Component-level Caching)

nuxt 中的缓存策略也是基于这两点，另外可以衍生出 API 缓存，本质一样，只不过缓存的是异步接口返回的内容，个人认为 API 缓存意义不大，redis 性能更好，且方案成熟

参考：<a href="https://juejin.im/post/5b2b62096fb9a00e61494b0b#heading-2">nuxt缓存实践</a>

