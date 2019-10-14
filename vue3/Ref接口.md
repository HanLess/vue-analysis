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


#### Ref 的作用

对于基本数据类型，函数传递或者对象解构时，会丢失原始数据的引用，换言之，我们没法让基本数据类型，或者解构后的变量(如果它的值也是基本数据类型的话)，成为响应式的数据。

但是有时候，我们确实就是想一个数字、一个字符串是响应式的，或者就是想利用解构的写法。那怎么办呢？只能通过创建一个对象，也即是源码中的Ref数据，然后将原始数据保存在Ref的属性value当中，再将它的引用返回给使用者。既然是我们自己创造出来的对象，也就没必要使用Proxy再做代理了，直接劫持这个value的get/set即可，这就是ref函数与Ref类型的由来。






