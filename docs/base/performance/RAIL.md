# RAIL 模型

来自google。

* R: Response 响应 - 网站给到用户的反馈
* A: Animation 动画 - 给到用户流畅的动画
* I: Idle 空闲 - 浏览器的空闲时间，也就是浏览器响应足够快
* L: Load 网络加载时间 - 网站加载时间要足够快

目的：让用户有最好的体验；

## Response

用户期望的交互-反馈时间是 100ms，输入处理 50ms + 事件处理 50ms。

处理事件应该 50ms 以内完成。

## Animation

每秒有 60帧；

每10ms产生一帧 + 浏览器绘制事件 6ms。

## Idle

尽可能增加空闲时间。

减少大量业务计算，保证浏览器空闲。

## Load

在 5s 内完成所有内容的加载并可以交互。

加载 + 解析 + 渲染 <= 5s。

另外，用户的网络环境可能存在问题。

## 性能测试工具

* 1、Chrome DevTools 开发调试、性能测评
* 2、LightHouse 网站整体质量评估
* 3、WebPageTest 多测试地点，全面性能报告
