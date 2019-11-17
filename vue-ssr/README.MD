nuxt 提供了一套 vue ssr 的工程化脚手架，在工程中主要注意三个内容

- 缓存
- 服务端给前端传值（store同步传值）
- js、css等静态文件部署 cdn

#### 缓存已经单独讨论

#### js、css等静态文件部署 cdn

在 nuxt.config.js 里，可以在 build.publicPath 指定 cdn 的域名、路径

#### 服务端给前端传值（store同步传值）

nuxt 提供了 nuxtServerInit 方法，可以把服务端数据直接传给 vuex

store/index.js 中

```
export const actions = {
    nuxtServerInit ({ commit }, { req }) {
        console.log(req.data)
        commit('changeTest', req.data);
    }
}
```

server/index.js 中

```
app.use((ctx) => {
    // console.log('bingo')
    ctx.status = 200
    ctx.respond = false 
    ctx.req.ctx = ctx 
    ctx.req.data = 'hello world hanhongxuan'
    nuxt.render(ctx.req, ctx.res)
  })
```

即可在 vue 组件中使用 state 中的数据。但这里有个问题，nuxtServerInit 只能写在 store 顶层的 actions 中，不能写在模块里，当某个模块的数据为首屏展示数据时，需要二次赋值，不过问题不大


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
