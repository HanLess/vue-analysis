执行 Vue.use 引入插件，会统一执行插件的 install 方法，做如下几件事：

（1）在 vue-router 的 install 方法中会执行 Vue.mixin ，混入 beforeCreate，destroyed 两个钩子函数，在 beforeCreate 中会把整个 router 对象绑定到 vue 实例上

（2）router类会记录使用路由的vue实例，matcher 对象，记录注册的路由信息等数据

（3）defineReactive 方法把 this._route 变成响应式对象

```
Vue.util.defineReactive(this, '_route', this._router.history.current)
```

#### 路由跳转（由 transitionTo 实现）

调用 router.push 或 router.replace 方法，都会走 this.transitionTo 方法，transitionTo 方法分析如下：

```
const route = this.router.match(location, this.current)
```

这里会用 match 方法找到需要展示的 route 对象，其中 location 是要跳转的路径，this.current 是当前展示的 route 对象，transitionTo 实际上也就是在切换 this.current，最后 route 的更改会触发vue实例中，this._route的改变

#### 组件切换，重要！

<router-view>组件中：

由于我们把根 Vue 实例的 _route 属性定义成响应式的，我们在每个 <router-view> 执行 render 函数的时候，都会访问 parent.$route，如我们之前分析会访问 this._routerRoot._route，触发了它的 getter，相当于 <router-view> 对它有依赖，然后再执行完 transitionTo 后，修改 app._route 的时候，又触发了setter，因此会通知 <router-view> 的渲染 watcher 更新，重新渲染组件。

#### history模式与hash模式的区别

（1）本质上来说没区别，hash模式默认也监听 popstate 事件，如果不支持才用 hashchange

（2）官方说法hash模式比较丑？所以可以选择history模式，没觉得那里丑

（3）要用history模式需要服务端配合，原因如下：

```
我们的应用是个单页客户端应用，如果后台没有正确的配置，

当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404。

所以，要在服务端增加一个覆盖所有情况的候选资源：

如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面
```



