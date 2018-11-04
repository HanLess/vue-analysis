import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)  // 此阶段执行 beforeCreate，created
stateMixin(Vue) // 设置了 $data $props $watcher
eventsMixin(Vue) // 设置了 $on $emit $once $off ，监听、发送自定义事件
lifecycleMixin(Vue) // 设置了 $destroy $forceUpdate ，强制执行方法
renderMixin(Vue) // 设置了 $nextTick , _render 方法，dom事件触发的回调会使用 macroTask 执行

export default Vue
