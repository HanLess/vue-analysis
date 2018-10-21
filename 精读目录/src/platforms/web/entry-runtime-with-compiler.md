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
获取容器元素的方法。<a href = "https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/platforms/web/util/index.md"> query方法 </a>

```
接下来给$mount方法，在 原有功能基础上 加了编译模版（template）的功能，Vue.prototype.$mount = function(el){...}
```

主要操作判断条件是 template，let template = options.template

### 步骤一：

如果满足条件，优先将 template（渲染模版） 设为 html 元素，经过第一个 if 后，template 有两种情况：
（1）html 元素
（2）字符串，如：`<App />`，即 用字符串表示的具体的 html 结构

```
if (template) {
  if (typeof template === 'string') {
  
  // 是字符串，是不是以 id 表示，是的话获取 html 元素
  
    if (template.charAt(0) === '#') {
      template = idToTemplate(template)
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && !template) {
        warn(
          `Template element not found or is empty: ${options.template}`,
          thi
        )
      }
    }
  } else if (template.nodeType) {
  
  // 是html节点，获取节点内元素
  
    template = template.innerHTML
  } else {
    if (process.env.NODE_ENV !== 'production') {
      warn('invalid template option:' + template, this)
    }
    return this
  }
} else if (el) {

// 没有设置 template ，获取 $mount 方法的入参 el 的 html 元素，赋值给 template

  template = getOuterHTML(el)
}
```

### 步骤二：

在第二个 if 中，做了两件事：
（1）如果满足条件，计时，知识点，windown.mark 与 window.measure 配合应用，打点计时
（2）执行 compileToFunctions 方法，将 template 编译成 render 函数。

<a href="https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/core/util/perf.md"> mark方法 </a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/platforms/web/compiler/index.md">compileToFunctions</a>

shouldDecodeNewlines 和 shouldDecodeNewlinesForHref 是两个布尔值，用来表示是否需要把 html 元素中 属性的值的换行符（\n）转码成 “&#10\;”

<a href="https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/platforms/web/util/compat.md">shouldDecodeNewlines</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/%E7%B2%BE%E8%AF%BB%E7%9B%AE%E5%BD%95/src/platforms/web/util/compat.md">shouldDecodeNewlinesForHref</a>

```
if (template) {
  /* istanbul ignore if */
  // 计时，开始编译
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
  // 计时，编译结束
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    mark('compile end')
    measure(`vue ${this._name} compile`, 'compile', 'compile end')
  }
}
```
### 步骤三：

最终return的是Component，可见 mount 最后生成一个 Component，而 new Vue()，也是生成一个 Component

```
return mount.call(this, el, hydrating)
```



