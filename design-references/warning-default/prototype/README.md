# 预警出险移动端 HTML 高保真原型

## 打开方式

直接用浏览器打开 `index.html`。原型不需要安装依赖、不需要构建、不访问网络。

默认入口：

- `index.html#/credit/warning`

## 页面与 Hash

| 页面/状态 | Hash |
|---|---|
| 预警出险总览 | `#/credit/warning` |
| 总览本日状态 | `#/credit/warning?period=today` |
| 指标口径弹层 | `#/credit/warning?sheet=metrics` |
| 预警资产总览 | `#/credit/warning/prewarnings` |
| 预警资产成员公司空状态 | `#/credit/warning/prewarnings?member=租赁` |
| 预警迁移 | `#/credit/warning/prewarnings/migrations` |
| 重大预警客户 | `#/credit/warning/prewarnings/customers` |
| 重大预警筛选弹层 | `#/credit/warning/prewarnings/customers?sheet=filter` |
| 重大预警无结果 | `#/credit/warning/prewarnings/customers?member=银行` |
| 重大预警列表错误状态 | `#/credit/warning/prewarnings/customers?state=error` |
| 常宁尚宇客户风险概览 | `#/credit/warning/customers/changning-shangyu` |
| 常宁尚宇预警资产详情 | `#/credit/warning/assets/changning-shangyu-20260623` |
| 出险资产总览 | `#/credit/warning/defaults` |
| 出险客户 | `#/credit/warning/defaults/customers` |
| 出险筛选弹层 | `#/credit/warning/defaults/customers?sheet=filter` |
| 出险客户错误状态 | `#/credit/warning/defaults/customers?state=error` |
| 广西百色客户风险概览 | `#/credit/warning/customers/guangxi-baise` |
| 广西百色出险资产详情 | `#/credit/warning/assets/guangxi-baise-047` |
| 加入重点跟踪弹层 | `#/credit/warning/assets/guangxi-baise-047?sheet=tracking&asset=guangxi-baise-047` |
| 重点跟踪详情 | `#/watch/tracking/guangxi-baise-default` |
| 更新跟踪进展弹层 | `#/watch/tracking/guangxi-baise-default?sheet=progress` |
| 加入风险报告弹层 | `#/watch/tracking/guangxi-baise-default?sheet=report&asset=guangxi-baise-047` |
| 全局 Copilot | `#/credit/warning?copilot=1` |

## 主要交互路径

### 重大预警

`总览 → 预警资产 → 预警迁移 → 重大预警客户 → 常宁尚宇客户概览 → 预警资产详情 → 加入跟踪/加入报告`

### 出险

`总览 → 出险资产 → 出险客户 → 广西百色客户概览 → 出险资产详情 → 加入重点跟踪 → 重点跟踪详情 → 加入风险报告`

### 全局 Copilot

任一显示底部 AI 输入的页面，点击输入条或“＋”打开。默认回答只汇总确认的结构化业务事实，不生成风险预测或处置建议。

## 截图

`screenshots/` 中的 PNG 全部由该 HTML 在 Chromium 390 × 844 视口中渲染后截取，没有使用图像生成模型重绘。
