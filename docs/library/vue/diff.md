# Vue Diff

[实现一个Vue2 diff](https://github.com/Picker666/vue-origin-source/tree/main/diff)

所谓 diff 算法，就是基于虚拟DOM，进行新旧虚拟DOM对象对比的一套算法。

## diff 过程

* 1、首先当我们数据发生变化触发setter；
* 2、进而，触发发布订阅中心的 Dep.notify 方法；
* 3、通知订阅者更新，并进行新旧DOM的**递归**对比，即 patch(oldvnode, newvnode)；
* 4、此时，如果新旧的类型不一致，直接使用新DOM替换旧的；类型一致，则继续，此时分情况；
  * （1）、都是文本节点，用新的**替换**旧的即可；
  * （2）、oldvnode 没有， newvnode 有，此时**新增**子节点；
  * （3）、oldvnode 有，newvnode 没有，此时**删除**子节点；
  * （4）、oldvnode 和 newvnode 都有子节点，此时最为复杂，执行updateChildren
* 5、updateChildren 的更新前提是，同级存在多个虚拟节点，采用首尾指针法对比；
  * （1）、oldStart === newStart ？成功，oldStartIndex ++； newStartIndex ++; 失败则继续；
  * （2）、oldStart === newEnd ？成功，oldStartIndex ++； newEndIndex --; 失败则继续；
  * （3）、oldEnd === newStart ? 成功，oldEndIndex --； newStartIndex ++; 失败则继续；
  * （4）、oldEnd === newEnd ? 成功，oldEndIndex --； newEndIndex --; 失败则继续；
  * （5）、