vue3 的 Ref 接口如下

```
refSymbol = Symbol(__DEV__ ? 'refSymbol' : undefined)

interface Ref<T = any> {
  [refSymbol]: true
  value: UnwrapNestedRefs<T>
}
```

利用 symbol 指定一个唯一的 key，用 value 存数据

```
// 递归地获取嵌套数据的类型
// Recursively unwraps nested value bindings.
export type UnwrapRef<T> = {
  // 如果是ref类型，继续解套
  ref: T extends Ref<infer V> ? UnwrapRef<V> : T
  // 如果是数组，循环解套
  array: T extends Array<infer V> ? Array<UnwrapRef<V>> : T
  // 如果是对象，遍历解套
  object: { [K in keyof T]: UnwrapRef<T[K]> }
  // 否则，停止解套
  stop: T
}[T extends Ref
  ? 'ref'
  : T extends Array<any>
    ? 'array'
    : T extends BailTypes
      ? 'stop' // bail out on types that shouldn't be unwrapped
      : T extends object ? 'object' : 'stop']

// 声明类型别名：UnwrapNestedRefs
// 它是这样的类型：如果该类型已经继承于Ref，则不需要解套，否则可能是嵌套的ref，走递归解套
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>
```

#### 对于 Ref 的解释

Ref是这样的一种数据结构：它有个key为Symbol的属性做类型标识，有个属性value用来存储数据。这个数据可以是任意的类型，唯独不能是被嵌套了Ref类型的类型。
