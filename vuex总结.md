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
