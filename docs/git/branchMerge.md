# Branch Merge

## 消失的文件

世界未解之谜 - 合并完分支，文件消失了！

如下，从A 拉了一条 dev 分支出来，在节点 B 中新增了一个文件 http.js，并且合并到 master 分支，合并节点为 E，这个时候发现会引起线上 bug，赶紧撤回这个合并，新增一个 revert 节点 E1。`过了几天继续在 dev 分支上面开发新增了一个文件 main.js`,并在这个文件中 import 了 http.js 里面的逻辑，在 dev 分支上面一切运行正常。可当他将此时的 dev 分支合并到 master 时候却发现，http.js 文件不见了，导致 main.js 里面的逻辑运行报错了，http.js不见了。**但这次合并并没有任何冲突**。他又得重新做了一下 revert，并且迷茫的怀疑是 Git 的 bug。

![git flow 流程图](/blog/images/git/git11.jpg)

## 如何合并两个文件

试想一下，git是如何合并两个文件？
如果是feature分支和develop，是以develop分支为准进行合并吗？还是feature分支为准？

......

结果是都不是，git的merge是一个三向合并的过程

所谓三向合并，就是找到两个文件的一个合并 base，如下图，这样子 Git 就可以很清楚的知道说，对方修改了这一行代码，而我们没有修改，自动帮我们合并这两个文件为 Print("hello")。

![git flow 流程图](/blog/images/git/git12.png)

接下来我们了解一下什么是冲突?冲突简单的来说就是三向合并中的三方都互不相同，即参考合并 base，我们的分支和别人的分支都对同个地方做了修改。

## Git 的合并策略

![git flow 流程图](/blog/images/git/git13.png)

我们来看一个使用 git merge 来做分支合并。如上图，将 master 分支合并到 feature 分支上，会新增一个 commit 节点来记录这次合并。

Git 会有很多合并策略，其中常见的是 Fast-forward、Recursive 、Ours、Theirs、Octopus。下面分别介绍不同合并策略的原理以及应用场景。默认 Git 会帮你自动挑选合适的合并策略，如果你需要强制指定，使用git merge -s <策略名字>

### Fast-forward

![git flow 流程图](/blog/images/git/git14.png)

Fast-forward 是最简单的一种合并策略，如上图中将 some feature 分支合并进 master 分支，Git 只需要将 master 分支的指向移动到最后一个 commit 节点上

![git flow 流程图](/blog/images/git/git15.png)

::: tip
Fast-forward 是 Git 在合并两个没有分叉的分支时的默认行为，如果不想要这种表现，想明确记录下每次的合并，可以使用git merge --no-ff。
:::

### Recursive

Recursive 是 Git 分支合并策略中最重要也是最常用的策略，是 Git 在合并两个有分叉的分支时的默认行为。其算法可以简单描述为：递归寻找路径最短的唯一共同祖先节点，然后以其为 base 节点进行递归三向合并。说起来有点绕，下面通过例子来解释。

如下图这种简单的情况，圆圈里面的英文字母为当前 commit 的文件内容，当我们要合并中间两个节点的时候，找到他们的共同祖先节点(左边第一个)，接着进行三向合并得到结果为 B。(因为合并的 base 是“A”，下图靠下的分支没有修改内容仍为“A”，下图靠上的分支修改成了“B”，所以合并结果为“B”)

![git flow 流程图](/blog/images/git/git16.png)

但现实情况总是复杂得多，会出现历史记录链互相交叉等情况，如下图：

![git flow 流程图](/blog/images/git/git17.png)

当 Git 在寻找路径最短的共同祖先节点的时候，可以找到两个节点的，如果 Git 选用下图这一个节点，那么 Git 将无法自动的合并。因为根据三向合并，这里是是有冲突的，需要手动解决。(base 为“A“，合并的两个分支内容为”C“和”B“)

![git flow 流程图](/blog/images/git/git18.png)

而如果 Git 选用的是下图这个节点作为合并的 base 时，根据三向合并，Git 就可以直接自动合并得出结果“C”。(base 为“B“，合并的两个分支内容为”C“和”B“)

![git flow 流程图](/blog/images/git/git19.png)

作为人类，在这个例子里面我们很自然的就可以看出来合并的结果应该是“C”(如下图，节点 4、5 都已经是“B”了，节点 6 修改成“C”，所以合并的预期为“C”)

![git flow 流程图](/blog/images/git/git20.png)

那怎么保证 Git 能够找到正确的合并 base 节点，尽可能的减少冲突呢?答案就是，Git 在寻找路径**最短的共同**祖先节点时，如果满足条件的祖先节点不唯一，那么 Git 会继续递归往下寻找直至唯一。还是以刚刚这个例子图解。

如下图所示，我们想要合并节点 5 和节点 6，Git 找到路径最短的祖先节点 2 和 3。

![git flow 流程图](/blog/images/git/git21.png)

因为共同祖先节点不唯一，所以 Git 递归以节点 2 和节点 3 为我们要合并的节点，寻找他们的路径最短的共同祖先，找到唯一的节点 1。

![git flow 流程图](/blog/images/git/git22.png)

接着 Git 以节点 1 为 base，对节点 2 和节点 3 做三向合并，得到一个临时节点，根据三向合并的结果，这个节点的内容为“B”。

![git flow 流程图](/blog/images/git/git23.png)

再以这个临时节点为 base，对节点 5 和节点 6 做三向合并，得到合并节点 7，根据三向合并的结果，节点 7 的内容为“C”。

![git flow 流程图](/blog/images/git/git24.png)

至此 Git 完成递归合并，自动合并节点 5 和节点 6，结果为“C”，没有冲突。

![git flow 流程图](/blog/images/git/git25.png)

Recursive 策略已经被大量的场景证明它是一个尽量减少冲突的合并策略，我们可以看到有趣的一点是，对于两个合并分支的中间节点(如上图节点 4，5)，只参与了 base 的计算，而最终真正被三向合并拿来做合并的节点，只包括末端以及 base 节点。

需要注意 Git 只是使用这些策略尽量的去帮你减少冲突，如果冲突不可避免，那 Git 就会提示冲突，需要手工解决。(也就是真正意义上的冲突)。

### Ours & Theirs

Ours 和 Theirs 这两种合并策略也是比较简单的，简单来说就是保留双方的历史记录，但完全忽略掉这一方的文件变更。如下图在 master 分支里面执行git merge -s ours dev，会产生蓝色的这一个合并节点，其内容跟其上一个节点(master 分支方向上的)完全一样，即 master 分支合并前后项目文件没有任何变动。

![git flow 流程图](/blog/images/git/git26.png)

而如果使用 theirs 则完全相反，完全抛弃掉当前分支的文件内容，直接采用对方分支的文件内容。

这两种策略的一个使用场景是比如现在要实现同一功能，你同时尝试了两个方案，分别在分支是 dev1 和 dev2 上，最后经过测试你选用了 dev2 这个方案。但你不想丢弃 dev1 的这样一个尝试，希望把它合入主干方便后期查看，这个时候你就可以在 dev2 分支中执行git merge -s ours dev1。

### Octopus

这种合并策略比较神奇，一般来说我们的合并节点都只有两个 parent(即合并两条分支)，而这种合并策略可以做两个以上分支的合并，这也是 git merge 两个以上分支时的默认行为。比如在 dev1 分支上执行git merge dev2 dev3。

![git flow 流程图](/blog/images/git/git27.png)

他的一个使用场景是在测试环境或预发布环境，你需要将多个开发分支修改的内容合并在一起，如果不用这个策略，你每次只能合并一个分支，这样就会导致大量的合并节点产生。而使用 Octopus 这种合并策略就可以用一个合并节点将他们全部合并进来。

## Git rebase

rebase 也是一种经常被用来做合并的方法，其与 git merge 的最大区别是，他会更改变更历史对应的 commit 节点。

如下图，当在 feature 分支中执行 rebase master 时，Git 会以 master 分支对应的 commit 节点为起点，新增两个全新的 commit 代替 feature 分支中的 commit 节点。其原因是新的 commit 指向的 parent 变了，所以对应的 SHA1 值也会改变，所以没办法复用原 feature 分支中的 commit。(这句话的理解需要这篇文章的基础知识)

![git flow 流程图](/blog/images/git/git28.png)

## 解答

![git flow 流程图](/blog/images/git/git11.jpg)

现在我们再来看一下文章开头的例子，我们就可以理解为什么最后一次 merge 会导致 http.js 文件不见了。根据 Git 的合并策略，在合并两个有分叉的分支(上图中的 D、E‘)时，Git 默认会选择 Recursive 策略。找到 D 和 E'的最短路径共同祖先节点 B，以 B 为 base，对 D，E‘做三向合并。B 中有 http.js，D 中有 http.js 和 main.js，E'中什么都没有。根据三向合并，B、D 中都有 http.js 且没有变更，E‘删除了 http.js，所以合并结果就是没有 http.js，没有冲突，所以 http.js 文件不见了。

这个例子理解原理之后解决方法有很多，这里简单带过两个方法：1. revert 节点 E'之后，此时的 dev 分支要抛弃删除掉，重新从 E'节点拉出分支继续工作，而不是在原 dev 分支上继续开发节点 D;2. 在节点 D 合并回 E'节点时，先 revert 一下 E‘节点生成 E'‘(即 revert 的 revert)，再将节点 D 合并进来。

Git 有很多种分支合并策略，本文介绍了 Fast-forward、Recursive、Ours/Theirs、Octopus 合并策略以及三向合并。掌握这些合并策略以及他们的使用场景可以让你避免发生一些合并问题，并对合并结果有一个准确的预期。
