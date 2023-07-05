# git reset

`git reset` 命令的作用是回退版本，可以回退到期望的某一次提交。

```git
git reset [--soft | --mixed | --hard] [HEAD]
```

## 一、工作区域

* 1、工作区（Working Directory）：写代码的目录，项目代码存放目录 -- git add 之前的目录
* 2、暂存区（index/stage）：工作区和代码仓库之前的缓存地带。用 git add 把文件代码添加进去。-- git add 之后的目录
* 3、仓库区：git commit 之后，代码提交到的地方，也就是本地仓库。

## 二、--mixed

`--mixed` 为 `git reset` 的默认值。

也就是 `git reset` 等价于 `git reset --mixed`。

命令效果：

* 1、重置暂存区文件。
  * （1）、历史记录保持不变，也就是不会更改仓库区；
  * （2）、暂存区内容撤销，**回到工作区**；
  * （3）、工作区**原有**内容保持不变，就是工作有为 git add 的内容，也仍然保持不变，**暂存区的内容会添加到工作区**；
* 2、原有文件内容的变更： 修改内容还在只是变成 `git add` 之前的状态；
* 3、关于目录文件的变更：
  * （1）、新增文件：文件仍然存在，只是变成 `git add` 之前的状态；
  * （2）、删除文件：目录仍然不存在，只是变成 `git add` 之前的状态；

::: tip `git add` 之前的状态
在执行 `git status` 时候，红色的部分代表是：`git add` 之前的状态；绿色部分代表是：`git add` 之后 `git commit` 之前 的状态。
:::

![git reset](/blog/images/git/gitreset1.png)

## 三、--soft commitId

使用场景：

代码已经commit。

命令效果：

* 1、移动当前 HEAD 指针回到上一个 commit或者指定的commitID，从仓库删除 当前 commit，提交内容撤回到 暂存区；
* 2、暂存区和工作区 原本存在的内容不改变，另外撤销内容回到暂存区；
* 3、关于目录文件的变更：
  * （1）、新增文件：文件仍然存在，只是变成 `git add` 之后的状态；
  * （2）、删除文件：目录仍然不存在，只是变成 `git add` 之后的状态；

![git reset --soft](/blog/images/git/gitreset2.png)

:::tip
如果 commitId 不是上一个commit，那么会将 commitId之前的所有操作撤回到 暂存区。
:::

## 四、–-hard

```git
git reset --hard DEAD|commitId
```

参数撤销工作区和暂存区中所有未提交的修改内容。

命令效果：

* 1、将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交，当前 HEAD 指针可能改变，工作区和暂存区内容清空；
* 2、原有文件内容的变更：修改内容丢失（修改的代码不会变成未add的状态）；
* 3、目录结构的变更（增加或者删除文件）：新增文件丢失、删除的文件相当于没删。

![git reset --soft](/blog/images/git/gitreset3.png)
![git reset --soft](/blog/images/git/gitreset4.png)

:::tip
如果 DEAD 或者 commitId 为上一条commit id，HEAD 指针不变；

如果 commitId 为更早的commit id，HEAD 指针指向对应的 commit。
:::

:::warning 版本回退注意
如果执行了 git reset --hard 较早的commitId，这时候要保证协作的同事都做了本地和远程的代码更新。
:::
