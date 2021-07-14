#### 挂载

vue 插件机制，通过 mixin 方法，在 beforeCreated 阶段把 store 挂载在组件上，可以通过 this.$store 访问

#### 响应式数据

store 的实例就是一个 vue 实例， 本质上就是一个全局的 vue 实例，通过 vue 实例中 data 的能力来实现响应式数据，如下

```
import Vue from 'vue'

let store = new Vue({
    data: {
        storeName: 'myStore'
    }
})

export default store


// my component
import store from './store.js

beforeCreate() {
	this.$store = store
}

```



vuex的主要内容是 state , getter , mutation , action

<img src="https://github.com/HanLess/vue-analysis/blob/master/flowImg/vuex.png" />

可以定义 modules 来分模块，每个模块可以包含上述四个部分：

```
var store = new Vuex.Store({
	actions,
	getters,
	modules: {
		juhe,
		question_list,
		college,
		search
	}
})

```
