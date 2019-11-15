nuxt 提供了一套 vue ssr 的工程化脚手架，在工程中主要注意三个内容

- 缓存
- 服务端给前端传值（store同步传值）
- js、css等静态文件部署 cdn

#### 缓存已经单独讨论

#### js、css等静态文件部署 cdn

在 nuxt.config.js 里，可以在 build.publicPath 指定 cdn 的域名、路径

#### 服务端给前端传值（store同步传值）


#### source map 的生成

nuxt.config.js 里提供了自定义 webpack 打包配置的选项，devtool = 'source-map' 可以为每一个打包的文件生成 source-map

```
build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
    }
  }
```
