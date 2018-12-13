myapp 是ssr的demo，包括如下功能

<ul>
  <li>router 与 vuex</li>
  <li>服务端渲染首屏（默认路由）</li>
  <li>生成 client-bundle.js 文件，使路由跳转在前端处理</li>
  <li>服务端渲染首屏，并请求异步数据，传递给前端</li>
</ul>

#### 这个 demo 基本包括了 vue 项目普遍使用的功能（vue + router + vuex）

### SSR 的注意点

#### 在服务端的渲染，没有响应数据，可以把服务端渲染理解为 vue 项目的一张“快照”，呈现的是一个状态（路由，数据），但状态的变化无法在服务端做

```
import { createApp } from '../src/main'

export default context => {
    return new Promise((resolve, reject) => {
        const app = createApp()

        // 更改路由
        app.$router.push(context.url)

       ...

        // 遍历路由下所以的组件，如果有需要服务端渲染的请求，则进行请求
        Promise.all(matchedComponents.map(component => {
            if (component.serverRequest || component.methods.serverRequest) {
                let serverRequest = component.serverRequest || component.methods.serverRequest

                return serverRequest(app.$store)
            }
        })).then(() => {
            // vuex 状态
            context.state = app.$store.state
            resolve(app)
        }).catch(reject)
    })
}
```

```
const createApp = require('./dist/bundle.server.js')['default']

createApp(context).then(app => {
    renderer.renderToString(app, (err, html) => {
        ...
    })
})
```

可以看到，renderer.renderToString 的入参是一个 app，是一个 vue 实例（createApp 创造），require('./dist/bundle.server.js')['default'] 中创造的vue 实例，已经定格了当前项目的状态，会渲染成 html 反给前端

#### 项目的正常运转，需要靠生成的客户端 js，即 entry-client 为入口的，webpack 打包出来的文件


















