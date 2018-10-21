此js为rollup入口文件

```
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'
```

core/util/index 模块是一个中转页，中转了util下的一些模块

```
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})
```
获取容器元素的方法。

```
接下来给$mount方法，在 原有功能基础上 加了编译模版（template）的功能，Vue.prototype.$mount = function(el){...}
```

主要操作判断条件是 template，let template = options.template

判断一：

```
/*
如果满足条件，优先将 template 设为 html 元素
*/

if (template) {
  if (typeof template === 'string') {
    if (template.charAt(0) === '#') {
      template = idToTemplate(template)
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && !template) {
        warn(
          `Template element not found or is empty: ${options.template}`,
          this
        )
      }
    }
  } else if (template.nodeType) {
    template = template.innerHTML
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn('invalid template option:' + template, this)
    }
    return this
  }
} else if (el) {
  template = getOuterHTML(el)
}
```

判断二：

```
if (template) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    mark('compile')
  }

  const { render, staticRenderFns } = compileToFunctions(template, {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
  }, this)
  options.render = render
  options.staticRenderFns = staticRenderFns

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    mark('compile end')
    measure(`vue ${this._name} compile`, 'compile', 'compile end')
  }
}
```
