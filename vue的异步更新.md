在组建中连续修改属性

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
microTimerFunc => flushCallbacks => 执行收集的 cbs，这里就是 flushSchedulerQueue => flushSchedulerQueue 中的逻辑：遍历 queue，执行每一个 watch.run()
```



