/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * 
   * 注意，在 js 里，静态方法可以是用 this 关键字，this 指向类本身（构造函数）
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id

          // 这里可以证明，vue组件也是Vue对象，Vue.component 的核心逻辑就这一句，即生成一个继承于 Vue 的组件的构造函数

          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        /**
         * 执行 Vue.component 方法后，把构造函数 definition 存在 Vue.options.components 下面，作为全局组件
         */
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
