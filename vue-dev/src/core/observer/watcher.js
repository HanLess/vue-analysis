/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 * 
 * 
 * 没个组件默认会维护一个 watcher，属性名 _watcher , _watchers
 * 当显式地调用 $watch 方法后，会在 _watchers 推入一个新的watcher对象
 * 当data中的数据触发get方法时（被使用，包括在指令中或其他方法中），会把相关的 watcher对象
 * 都push进闭包中的dep.subs中。
 * 
 * 当data中的数据触发set方法（改变）时，会触发dep.subs中的watcher对象全都 update ，重新计算，渲染dom
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;        // 用在 computed watcher 中
  sync: boolean;
  dirty: boolean;       // 用在 computed watcher 中，平时为 false，只有 data 中的属性变化，触发 computed value 变化的时候才会被置为 true
  active: boolean;
  deps: Array<Dep>;       // 上一次添加的 Dep 实例数组
  newDeps: Array<Dep>;    // 新添加的 Dep 实例数组
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   * 
   * 在这里会重新收集dep
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      /**绑定data中的属性时（computed也基于watcher，但 getter 就不是render函数了，而是定义的computed属性函数）：
       * 
       *  this.getter = () => {
            vm._update(vm._render(), hydrating)
          }

          它会先执行 vm._render() 方法，并且在这个过程中会对 vm 上的数据访问，这个时候就触发了数据对象的 getter。
          
          vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)

          入参依次是：
          * a : tag
          * b : data
          * c : children
          * d : normalizationType

          例子：
          function render(){
            return (isShow) ?
            _c('ul', {
                staticClass: "list",
                class: bindCls
              },
              _l((data), function(item, index) {
                return _c('li', {
                  on: {
                    "click": function($event) {
                      clickItem(index)
                    }
                  }
                },
                [_v(_s(item) + ":" + _s(index))])
              })
            ) : _e()
          }
          
       */
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      /**
       * 递归去访问 value，触发它所有子项的 getter，this.deep 用来判断此数据（value）是否是对象，还有子属性
       */
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      /**
       * 为什么需要做 deps 订阅的移除？
       * 
       * 们的模板会根据 v-if 去渲染不同子模板 a 和 b，
       * 当我们满足某种条件的时候渲染 a 的时候，会访问到 a 中的数据，
       * 这时候我们对 a 使用的数据添加了 getter，做了依赖收集，
       * 那么当我们去修改 a 的数据的时候，理应通知到这些订阅者。
       * 那么如果我们一旦改变了条件渲染了 b 模板，又会对 b 使用的数据添加了 getter，
       * 如果我们没有依赖移除的过程，那么这时候我去修改 a 模板的数据，
       * 会通知 a 数据的订阅的回调，这显然是有浪费的
       */
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   * 
   * 在执行 cleanupDeps 函数的时候，会首先遍历 deps，移除对 dep 的订阅，
   * 然后把 newDepIds 和 depIds 交换，newDeps 和 deps 交换，并把 newDepIds 和 newDeps 清空
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   * 
   * 核心逻辑是 this.get()
   */
  run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   * 
   * lazy = true 才会被调用，目前主要是 computed watcher 会用
   * 这个方法的目的是：重新调用 get()，即重新调用computed方法，重新计算 value
   * 
   * 为什么要重新计算？
   * 因为 computed 不同于 data 中的属性，set新值的时候会触发setter，从而触发 re-render
   * 所以当computed用了 data 中的属性，此属性变化会触发 evaluate 执行，用属性的新值来计算新的 computed value
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
