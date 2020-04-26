在组件中连续修改属性

```
this.name = xxx

this.age = zzz

this.hello = ddd
```

vue 最终只会更新、渲染一次，且是异步执行，过程如下：

#### 第一阶段

```
Object.defineProperty( setter ) => dep.notify => watch.update => queueWatcher，将 watcher 推入 queue 中

```

此阶段是通知过程，全同步执行，更新三次执行三次

#### 第二阶段

```
queueWatcher => has[id] => 收集 watcher => nextTick => 收集回调 flushSchedulerQueue，flushSchedulerQueue 是重新渲染的入口

```
第二阶段中，判断 has[id]，即一个 watcher 发起的更新只会执行一次 nextTick，也就是说，只会重新渲染一次

#### 第三阶段

```
microTimerFunc => flushCallbacks => 执行收集的 cbs，这里就是 flushSchedulerQueue =>

flushSchedulerQueue 中的逻辑：遍历 queue，执行每一个 watch.run()
```

#### 自己实现一个简单的异步、统一更新

```
var obj = {
    id: 'obj',
    a: 0,
    b: 0,
    c: 0
}
var has = new Map()

var cbs = []
var nextTick = function (cb) {
    cbs.push(cb)

    new Promise(function (resolve) {
        console.log(cbs)
        resolve()
    }).then(function () {
        cbs.forEach(function(val){
            val()
        })
    })
}

var updateView = function () {
    console.log(obj)
    console.log('视图更新了 ！')
}

for (let key in obj) {
    let val = obj[key]
    Object.defineProperty(obj, key , {
        get () {
            return val
        },
        set(newValue) {
            val = newValue
            if (!has.has(obj)) {
                has.set(obj,true)
                nextTick(updateView);
            }
        }
    })
}
obj.a = 2
obj.b = 3
obj.c = 224
```



