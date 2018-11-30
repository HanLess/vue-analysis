执行 Vue.use 引入插件，会统一执行插件的 install 方法，
在 vue-router 的 install 方法中会执行 Vue.mixin ，混入 beforeCreate，destroyed 两个钩子函数，在 beforeCreate 中会把整个 router 对象绑定到vm实例上
