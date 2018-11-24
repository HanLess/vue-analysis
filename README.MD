读 vue 源码有两个目的：（1）搞清楚以vue为代表的 mvvm 框架实现原理，设计架构（2）熟悉这种大型框架的架构，设计思路

以 platforms/web/entry-runtime-with-compiler.js 为入口文件

在看的过程中带着问题，以解决问题的方式阅读源码，待解决的问题如下：

（1）Vue构造函数的实现

（2）new Vue() 之后发生了什么，初始化的方法的实现

（3）$mount 方法的执行

（4）编译的过程

（5）数据响应的流程

（6）组件的注册与组件的更新（dom的更新）

以上只是能想到的大方向，在看源码的过程中一定会有新的问题，并且在看的过程中会把细碎的点连起来，解决完大方向后，再根据Vue的API文档，一个一个地去看实现，都完成后，vue的源码基本就读完了


### 主要问题的流程图如下

<a href = "https://github.com/HanLess/vue-analysis/blob/master/flowImg/%24mount%E6%96%B9%E6%B3%95%E7%9A%84%E6%89%A7%E8%A1%8C.png">$mount方法的执行.png</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/flowImg/vue.png">vue类的实现</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/flowImg/%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E6%B5%81%E7%A8%8B.png">数据响应流程</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/flowImg/%E7%BB%84%E4%BB%B6%E7%9A%84%E6%9B%B4%E6%96%B0%EF%BC%88vnode%E7%9A%84%E6%9B%B4%E6%96%B0%EF%BC%89.png">组件的更新（vnode的更新）</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/flowImg/%E7%BB%84%E4%BB%B6%E7%9A%84%E6%B3%A8%E5%86%8C.png">/组件的注册.</a>

<a href="https://github.com/HanLess/vue-analysis/blob/master/flowImg/%E7%BC%96%E8%AF%91%EF%BC%88render%E5%87%BD%E6%95%B0%E7%94%9F%E6%88%90%E6%B5%81%E7%A8%8B%EF%BC%89.png">编译（render函数生成流程）</a>

#### 在读源码的过程中，在没个关键节点都做了详细的注释，源码是 vue-dev，因为一直认为配合代码看注释、文档效果是最好的

