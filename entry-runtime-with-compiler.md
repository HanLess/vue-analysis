此js为rollup入口文件

```
const idToTemplate = cached(id => {
  const el = query(id)
  return el && el.innerHTML
})
```
