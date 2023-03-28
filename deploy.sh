#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 移除dist
#  rm -rf docs/.vuepress/dist

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

# git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:picker666/picker666.github.io.git master
# https://github.com/Picker666/blog.git
# git@github.com:Picker666/blog.git
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/Picker666/blog.git master:deploy

# cd -