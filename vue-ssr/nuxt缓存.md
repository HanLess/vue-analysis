在 vue ssr 官网中提到了两种缓存形式

- 页面级别缓存 (Page-level Caching)

- 组件级别缓存 (Component-level Caching)

nuxt 中的缓存策略也是基于这两点，另外可以衍生出 API 缓存，本质一样，只不过缓存的是异步接口返回的内容，个人认为 API 缓存意义不大，redis 性能更好，且方案成熟

参考：<a href="https://juejin.im/post/5b2b62096fb9a00e61494b0b#heading-2">nuxt缓存实践</a>

### 如果决定使用 ssr，就一定要有缓存，否则就不要使用！

node 的特性决定了无法胜任计算密集型业务，而 ssr 中需要在服务端创建 vue 实例并编译生成可用的 html 结构，必定是非常耗性能的，一旦并发高了，服务端的压力会非常大，不同于 java 的多线程，当 node 压力过大服务有崩溃的危险

使用缓存后，可以缓存首屏的 html 结构，不经编译直接返回，可以极大的减轻服务端压力

### 具体策略

#### 非 nuxt 中的缓存

可以采用官网中的方法，判断命中缓存直接返回

#### nuxt、express、koa 中使用中间件

express、koa 可以使用中间件直接返回内容

nuxt 中的中间件分为两种

- 路由中间件

- server 中间件

#### 路由中间件

比较好理解，需要在 vue-render 执行后，匹配到路由对应的页面后执行，偏向于处理前端业务

#### serverMiddleware

在 vue-render 前调用，跟 koa 中间件类似，可以直接 res.end 返回缓存内容

### nuxt 中的缓存，就是在 serverMiddleware 中做

nuxt 中的 serverMiddleware 源码如下：


（1）server.js 执行 ready 方法，会执行 setupMiddleware()

```
await this.setupMiddleware()
```

（2）setupMiddleware 中会设置 connect 的中间件，connect 可以理解为轻量的 koa

```
// Add user provided middleware
  for (const m of this.options.serverMiddleware) {
    this.useMiddleware(m)
  }
  
  ...
  
  // Finally use nuxtMiddleware
  this.useMiddleware(nuxtMiddleware({
    options: this.options,
    nuxt: this.nuxt,
    renderRoute: this.renderRoute.bind(this),
    resources: this.resources
  }))
```

可以看到，是先设置 serverMiddleware 中间件，最后设置 nuxtMiddleware，即 serverMiddleware 将会先执行

（3）nuxtMiddleware 是什么？以下是代码片段

```
const result = await renderRoute(url, context)

...

const {
  html,
  cspScriptSrcHashes,
  error,
  redirected,
  preloadFiles
} = result

...

// Send response
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Accept-Ranges', 'none') // #3870
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html, 'utf8')

...

```

可以发现，nuxtMiddleware 里返回了 ssr 的最终结果：首屏内容

可以得到结论：serverMiddleware 可以在 nuxtMiddleware 执行 render 前，拦截这个请求，返回缓存内容，这个请求也就不会执行 render 逻辑了





