# Vue2 生命周期

Vue 生命周期就是 Vue实例从创建到销毁的过程。即从创建、初始化数据、编译模版、挂载、Dom到渲染、更新到渲染、销毁等一系列的过程。主要分为八个阶段：创建前后、载入前后、更新前后、销毁前后以及一些特殊场景（activated、deactivated和errorCaptured）的生命周期。

## 生命周期分解

### 1、创建阶段

* beforeCreate()

在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。初始化阶段，应用不多。

此时$el、data都获取不到。

* created()

在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调，可访问data、computed、watch、methods上的方法和数据。然而，挂载阶段还没开始，$el property和$ref 目前尚不可用。

### 2、挂载阶段

* beforeMount()

在挂载开始之前被调用：相关的 render 函数首次被调用。此时已经能访问$el，但此时并未渲染到dom中。

* mounted()

该阶段执行完了模板解析，以及挂载。同时组件根组件元素被赋给了 $el 属性，该阶段可以通过 DOM 操作来对组件内部元素进行处理了。

### 3、更新阶段

* beforeUpdate()

数据更新时调用，但是还没有对视图进行重新渲染，这个时候，可以获取视图更新之前的状态。

* updated()

由于数据的变更导致的视图重新渲染，可以通过 DOM 操作来获取视图的最新状态。

### 4、卸载阶段

* beforeDestroy()

实例销毁之前调用，移除一些不必要的冗余数据，比如定时器。

* destroyed()

Vue 实例销毁后调用。

### 5、总结

|生命周期|描述|
|------|--|
|beforeCreate|组件实例被创建之初|
|created|组件实例已被完全创建|
|beforeMount|组件挂载之前|
|mounted|组件实例被挂载之后|
|beforeUpdate|组件数据发生变化，更新之前|
|updated|数据更新之后|
|beforeDestroy|组件实例销毁之前|
|destroyed|组件实例销毁之后|
|activated|keep-alive缓存组件激活时|
|deactivated|keep-alive缓存组件失活|
|errorCaptured|捕获一个来自子孙组件的错误时调用|

## 生命周期的执行流程

![流程图](/blog/images/vue/lifeCycle1.png)
