执行 Vue.use 引入插件，会统一执行插件的 install 方法，做如下几件事：

（1）在 vue-router 的 install 方法中会执行 Vue.mixin ，混入 beforeCreate，destroyed 两个钩子函数，在 beforeCreate 中会把整个 router 对象绑定到 vue 实例上

（2）router类会记录使用路由的vue实例，matcher 对象，记录注册的路由信息等数据

（3）defineReactive 方法把 this._route 变成响应式对象

```
Vue.util.defineReactive(this, '_route', this._router.history.current)
```

#### 路由跳转

调用 router.push 或 router.replace 方法，都会走 this.transitionTo 方法，transitionTo 方法分析如下：

```
const route = this.router.match(location, this.current)
```

这里会用 match 方法找到需要展示的 route 对象，其中 location 是要跳转的路径，this.current 是当前展示的 route 对象，transitionTo 实际上也就是在切换 this.current

接下来调用 confirmTransition 进行真正的跳转
