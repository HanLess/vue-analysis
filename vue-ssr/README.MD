nuxt 提供了一套 vue ssr 的工程化脚手架，在工程中主要注意三个内容

- 缓存
- 服务端给前端传值（store同步传值）
- js、css等静态文件部署 cdn

#### 缓存已经单独讨论

#### js、css等静态文件部署 cdn

在 nuxt.config.js 里，可以在 build.publicPath 指定 cdn 的域名、路径

#### 服务端给前端传值（store同步传值）
