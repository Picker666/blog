# rebase

假设你现在基于远程分支`"origin"`，创建一个叫`"picker"`的分支。

```git
git checkout -b picker origin
```

![分支示意图](/images/git/git2.jpg)

现在我们在这个分支做一些修改，然后生成两个提交(commit).

```git
// add file.txt
git commit
// add otherfile.txt
git commit
```

但是与此同时，有些人也在`"origin"`分支上做了一些修改并且做了提交了. 这就意味着`"origin"`和`"picker"`这两个分支各自"前进"了，它们之间"分叉"了。

![分支示意图](/images/git/git3.jpg)

## git merge GitHub

![分支示意图](/images/git/git4.jpg)

但是，如果你想让`"picker"`分支历史看起来像没有经过任何合并一样，你也许可以用 `git rebase`:

```git
git checkout picker
git rebase origin
```

这些命令会把你的`"picker"`分支里的每个提交(`commit`)取消掉，并且把它们临时 保存为补丁(`patch`)(这些补丁放到`".git/rebase"`目录中),然后把`"picker"`分支更新 到最新的"origin"分支，最后把保存的这些补丁应用到`"picker"`分支上。
