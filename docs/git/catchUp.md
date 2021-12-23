# git 常见问题

## 1、remote: PermissionDenied

remote: PermissionDenied: Permission Deny: You are not allowed to push this branch

![PermissionDenied 报错图](/blog/images/git/git1.jpg)

::: tip 原因
电脑原来存的密码不正确
:::

### 解决方式

```js
git config --system --unset credential.helper // 清除已经设置的密码
git push // 需要输入正确的账号和密码即可  每次push 都需要输入
```

### 记住密码

在mac中自动保存git的用户名和密码很简单，只需要在终端命令行中输入下面的命令就是：

```js
git config --global credential.helper osxkeychain
```

然后在git 操作中 只要输入一次账号名和密码 ,在之后的操作中 就不需要再次输入了
