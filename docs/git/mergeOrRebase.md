# merge or rebase

`merge`和`rebase`都是用来合并分支的,

以及两个命令的原理，详细解释参考[这里](/git/rebase)。

## merge和rebase的区别

* 1、采用`merge`和`rebase`后，`git log`的区别，`merge`命令会保留`merge`的分支的`commit`：

![合并操作示意图](/blog/images/git/git8.png)

* 2、处理冲突的方式：

  * （一股脑）使用`merge`命令合并分支，解决完冲突，执行`git add .`和`git commit -m'fix conflict'`。这个时候会**产生**一个`commit`。
  * （交互式）使用`rebase`命令合并分支，解决完冲突，执行`git add .`和`git rebase --continue`，**不会产生**额外的`commit`。这样的好处是，‘干净’，分支上不会有无意义的解决分支的`commit`；坏处，如果合并的分支中存在多个`commit`，需要重复处理多次冲突。

* 3、`git pull`和git pull --rebase`区别：

`git pull`做了两个操作分别是‘获取’和合并。所以加了`rebase`就是以`rebase`的方式进行合并分支，默认为`merge`。

## git merge 和 git merge --no-ff的区别

1、有时候`merge`命令后，发现：`merge`时并没有产生一个`commit`。不是说`merge`时会产生一个merge `commit`吗？

::: warning 注意
只有在冲突的时候，解决完冲突才会自动产生一个`commit`。
:::

如果想在没有冲突的情况下也自动生成一个commit，记录此次合并就可以用：`git merge --no-ff`命令，下面用一张图来表示两者的区别

![有无--no-ff对比示意图](/blog/images/git/git9.png)

2、如果不加 `--no-ff` 则被合并的分支之前的`commit`都会被抹去，只会保留一个解决冲突后的 `merge commit`。

## 如何选择合并分支的方式

* git merge
  * 主分支会有很多多余的commit，对强迫症来说很难受，
  * 但是，可以很清晰的看出每次合并的发生过程，对代码历史问题的查找还是很有帮助的；
  * 并且，不需要删除个人分支，开发者个人分支在每次往主分支合并前，合并来自主分支的代码，并解决冲突；

* git rebase
  * 主分支比较干净，所有的commit都是来自于开发者的提交，并且按顺序排好；
  * 如果在rebase主分支代码时候有多个commit，要重复处理冲突；
  * 要避免合并时候重复处理冲突的问题，就需要经常去合并主分支的代码。

* 结合
  * 获取远程项目中最新代码时：`git pull --rebase`，这个时隐性的合并远程分支的代码不会产生而外的commit（但是如果存在冲突的commit太多就像上面说的，需要处理很多遍冲突）。
  * 合并到分支的时候：git merge --no-ff，自动一个merge commit，便于管理（个人认为）。
