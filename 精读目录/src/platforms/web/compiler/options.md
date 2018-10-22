baseOptions 是用来创建 compiler 的参数，createCompiler(baseOptions)

```
export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}
```

```
modules = [  klass,  style,  model  ]
```

```
directives = {
  model,
  text,
  html
}
```
<a href=""> model </a>

<a href=""> text </a>

<a href=""> html </a>


```
isPreTag = (tag: ?string): boolean => tag === 'pre'
```

```
// makeMap 返回一个函数，用来判断一个字符串是否在 makeMap 入参的这个字符串中

isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
)
```

```
// 用途暂时不明

const acceptValue = makeMap('input,textarea,option,select,progress')
mustUseProp = (tag: string, type: ?string, attr: string): boolean => {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
}
```
