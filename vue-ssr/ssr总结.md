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

#### 服务端渲染的钩子函数

<ul>
  <li>服务端渲染只会执行 beforeCreated , created 两个钩子函数</li>
  <li>原因：服务端渲染只是一张“快照”，所以也不需要进行响应数据的绑定，且不需要进行渲染（$mount），所以只需要执行上述两个钩子</li>
</ul>

#### 对于异步获取数据，并更改响应数据

（1）对于在 created 中同步更改响应数据，服务端会执行created，并把“快照”返回前端，如下

```
<template>
    <div>
          home
          <div>{{createdData}}</div>
    </div>
</template>
<script>
export default {
    created(){
        // setTimeout(() => {
        //     this.createdData = "createdData changed!!!!!!!"
        // },1000)
        this.createdData = "createdData changed!!!!!!!"
    },
    data(){
        return {
            createdData: "init data",
        }
    }
}
</script>
```

返回的 html 中，createdData 被渲染成 "createdData changed!!!!!!!"

（2）如果在 created 中异步更改数据，如下

```
...
created(){
         setTimeout(() => {
             this.createdData = "createdData changed!!!!!!!"
         },1000)
        // this.createdData = "createdData changed!!!!!!!"
    },
...
```

返回的 html 中，createdData 被渲染成 "init data"，即不会等待异步返回

（3）那如何在服务端渲染的时候，异步获取初始化数据（第一屏数据），并渲染给前端？

```
// entry-server

// 遍历路由下所以的组件，如果有需要服务端渲染的请求，则进行请求
Promise.all(matchedComponents.map(component => {
    if (component.serverRequest || component.methods.serverRequest) {
        let serverRequest = component.serverRequest || component.methods.serverRequest

        return serverRequest(app.$store)
    }
})).then(() => {
    context.state = app.$store.state
    resolve(app)
}).catch(reject)

```

可以看到，在 entry-server 中获取异步数据，塞给前端。因为是通过 entry-server 来获取 vue 实例的，所以每次在服务端 render 的时候一定会执行这里，也就会获取数据了

#### 项目结构的变化

在传统 vue 项目中，main.js 里创建了一个 vue 实例（new Vue），在 SSR 中，main.js 变为一个工厂函数，用来提供新的 vue 实例，如下

```
// 导出一个工厂函数，用于创建新的vue实例
export function createApp() {
    const router = createRouter()
    const store = createStore()
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    return app
}
```

然后在 entry-client , entry-server 中各自调用 main，创建 vue 实例

#### 怎么理解 entry-client , entry-server

SSR 把 vue 项目渲染了两次，一次在服务端，一次在客户端。在两个端渲染，都需要一个编译后的 js 作为驱动（webpack编译输出的内容），而 entry-client 与 entry-server 是两个端编译的入口

<ul>
  <li>entry-server：作用是给 renderToString 提供新的 vue 实例（这个 vue 实例是一个快照，保存着某种状态）</li>
  <li>entry-client：可以认为等于传统 vue 项目的 main.js 文件，用来初始化 vue</li>
</ul>












