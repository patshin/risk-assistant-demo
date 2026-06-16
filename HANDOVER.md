# AI 智能风控助手 Demo 交接报告

更新时间：2026-06-16

## 1. 项目概览

本项目是一个用于汇报演示的移动端 H5 / WebView 风控 Copilot demo，模拟嵌入 iPhone 宽度环境中的 AI-native 风控助手。

核心定位：

- 不是传统金融后台或密集看板。
- 面向集团管理层与风控团队。
- 强调 AI 主动发现风险、解释风险、关联影响对象、生成建议和汇报。
- 全站采用移动端优先设计，最大宽度 430px，奶油米色背景、浅橙氛围、橙色强调、圆角卡片和轻阴影。

技术栈：

- React 19
- TypeScript
- Vite
- React Router
- lucide-react 图标
- 纯 CSS 设计系统，无后端，全部 mock 数据

## 2. 运行方式

```bash
npm install
npm run dev
npm run build
npm run preview
```

当前 `package.json` 脚本：

- `npm run dev`：启动 Vite，host 为 `127.0.0.1`
- `npm run build`：执行 `tsc -b && vite build`
- `npm run preview`：本地预览构建产物

最近一次验证：

- `npm run build` 已通过。
- 已在浏览器验证首页点击“近期看点”可进入 `/watch`，页面从顶部展示且控制台无错误。

## 3. 路由结构

入口文件：

- `src/main.tsx`
- `src/App.tsx`

当前路由：

- `/`：首页「AI 智能风控助手」
- `/brief`：今日风险简报详情页
- `/macro`：宏观风险
- `/credit`：信用风险
- `/investment`：投资风险
- `/watch`：近期看点总览
- `/watch/today`：今日重点全部页
- `/watch/tracking`：重点跟踪全部页
- `/report`：领导汇报生成页

`src/App.tsx` 中已加入 `ScrollToTop`，每次路径变化会重置页面滚动位置，避免从首页中段点击入口后新页面继承旧滚动位置，看起来像空白页。

## 4. 已实现页面

### 首页

文件：`src/pages/HomePage.tsx`

已实现：

- 顶部状态栏和操作入口
- AI 头像与问候区
- 今日风险简报卡片，点击进入 `/brief`
- 四大入口卡片：
  - 宏观风险 -> `/macro`
  - 信用风险 -> `/credit`
  - 投资风险 -> `/investment`
  - 近期看点 -> `/watch`
- AI 主动提醒区域
- 底部 AI 输入框
- 首页局部 `BottomSheet`，用于简单上下文提示

### 今日风险简报详情

文件：`src/pages/BriefDetailPage.tsx`

已实现：

- 今日风险简报页面
- 风险温度卡片
- AI 风险摘要
- 今日重点风险
- 风险变化归因
- 可能影响对象
- AI 建议下一步
- “影响链路”和“处置建议”半屏弹层
- “生成领导汇报”跳转至 `/report`

### 领导汇报

文件：`src/pages/ReportPage.tsx`

已实现：

- 本周风险汇报摘要
- 一句话汇报口径
- 重点影响对象
- 建议动作
- 支撑证据
- 汇报形式选择
- 底部操作按钮

### 宏观风险

文件：`src/pages/MacroRiskPage.tsx`

已实现三个 tab：

- 周期性风险
- 系统性风险
- 金融市场分析

包含：

- AI 总结卡
- 指标速览
- 风险传导链
- 系统性风险评分
- 重点事件
- 可能影响对象
- 金融市场信号
- 市场影响解读
- 底部 AI 输入框

### 信用风险

文件：`src/pages/CreditRiskPage.tsx`

已实现三个 tab：

- 大户风险
- 集中度风险
- 行业信用风险

包含：

- 重点客户风险预警
- 筛选 chips
- 客户卡片
- 集中度风险总览
- 二级维度切换
- 集中暴露列表
- 行业信用风险概览
- 趋势图和热度卡片
- AI 洞察
- 底部 AI 输入框

### 投资风险

文件：`src/pages/InvestmentRiskPage.tsx`

已实现四个 tab：

- 组合概览
- 压力测试
- 风险因子
- 资产配置

包含：

- 组合风险评分
- 核心指标
- 风险贡献环形图
- 压力测试情景
- 影响拆解
- 重点受影响资产
- 风险因子列表
- 因子暴露分布
- 资产配置结构
- AI 建议
- 底部 AI 输入框

### 近期看点

文件：`src/pages/WatchPage.tsx`

已实现：

- `/watch` 近期看点总览
- `/watch/today` 今日重点全部页
- `/watch/tracking` 重点跟踪全部页

包含：

- AI 今日总览
- 今日重点风险卡片
- 重点跟踪速览
- 数据摘要
- 领导指引
- 筛选 chips
- 已跟踪风险列表
- AI 建议动作
- 底部 AI 输入框

最近修复：

- 首页点击“近期看点”后页面看似空白的问题已修复。
- 原因是路由切换后保留旧滚动位置。
- 修复点在 `src/App.tsx` 的 `ScrollToTop`。

## 5. 设计系统与基础组件

全局样式：

- `src/styles/tokens.css`：颜色、字号、阴影、间距等设计变量
- `src/styles/global.css`：全局布局、页面样式和各页面模块样式

基础组件：

- `src/components/AppShell.tsx`：移动端 App Shell，最大宽度 430px
- `src/components/PageHeader.tsx`：顶部导航
- `src/components/SectionTitle.tsx`：分区标题
- `src/components/RiskCard.tsx`：首页风险入口卡片
- `src/components/MetricCard.tsx`：指标卡片
- `src/components/TabBar.tsx`：顶部 tab 导航
- `src/components/AIInsightCard.tsx`：AI 洞察卡
- `src/components/BottomAskBar.tsx`：底部 AI 输入框
- `src/components/PillTag.tsx`：状态标签
- `src/components/MiniLineChart.tsx`：轻量折线图
- `src/components/DonutChart.tsx`：轻量环形图
- `src/components/BottomSheet.tsx`：半屏弹层

组件出口：

- `src/components/index.ts`

## 6. 数据与内容

首页 mock 数据：

- `src/data/mockRisk.ts`

页面内大部分 mock 数据目前直接写在对应页面文件顶部，便于快速演示和迭代。

后续如果要规模化维护，建议将各模块 mock 数据拆到：

- `src/data/macroRisk.ts`
- `src/data/creditRisk.ts`
- `src/data/investmentRisk.ts`
- `src/data/watch.ts`
- `src/data/brief.ts`

## 7. 交互状态

已完成的核心跳转：

- 首页「今日风险简报」-> `/brief`
- 首页「宏观风险」-> `/macro`
- 首页「信用风险」-> `/credit`
- 首页「投资风险」-> `/investment`
- 首页「近期看点」-> `/watch`
- 今日风险简报详情「生成领导汇报」-> `/report`
- 近期看点「今日重点 - 全部」-> `/watch/today`
- 近期看点「重点跟踪速览 - 全部」-> `/watch/tracking`

部分按钮目前仍是静态演示或仅展示 UI：

- 多数“继续追问”
- 多数“查看影响链路”
- 多数“查看压力影响”
- 多数“生成处置建议”
- 多数“加入跟踪”
- 多数“生成汇报”

这符合前期“先完成完整样例页面 demo，部分跳转逻辑先搁置”的实现节奏。

## 8. 尚未完成 / 下一步重点

### 最高优先级：全局 AI 风控助手组件

用户已提出第七步需求，但尚未完整落地为全局统一组件。

目标：

- 全局通用 Copilot，不是单页面聊天框
- 基于当前页面上下文工作
- 默认 Bottom Sheet 半屏打开
- 可展开为全屏
- 触发来源包括：
  - 底部 AI 输入框
  - 继续追问
  - 查看影响链路
  - 查看压力影响
  - 生成处置建议
  - 生成汇报

建议实现方式：

- 新增 `src/components/AIRiskCopilot.tsx`
- 新增 `src/context/CopilotContext.tsx` 或在 `App.tsx` 维护全局状态
- 将各页面的 `BottomAskBar onOpen={() => undefined}` 改为打开全局 Copilot
- 给 CTA 传入上下文，例如 `contextTitle`、`intent`、`riskName`
- 保留 `BriefDetailPage` 中已有的专用“影响链路 / 处置建议”弹层，或逐步迁移到全局 Copilot

### 其他待办

- 将散落在页面文件中的 mock 数据拆分到 `src/data`
- 为关键路由添加基础 smoke test
- 为 `BottomAskBar` 增加统一上下文 placeholder 和真实打开行为
- 统一“生成汇报”按钮行为：跳转 `/report` 或打开预览
- 检查 iPhone 390px 与 430px 下所有页面底部固定输入框遮挡情况
- 补充空状态和 loading 状态，方便后续接后端

## 9. 注意事项

- 不要把界面改成传统后台风格。当前项目刻意避免冷蓝科技风、密集表格和硬阴影。
- 字体和卡片间距要保持移动端真实可读，不要为了塞进一屏压缩内容。
- 页面允许纵向滚动，这是设计原则之一。
- CTA 的优先交互应是结构化半屏面板，而不是全部跳聊天页。
- 当前项目没有后端接口，也没有真实风控计算逻辑，所有内容均为演示 mock。

## 10. 快速接手建议

推荐下一位接手按以下顺序继续：

1. 先实现全局 `AIRiskCopilot`，替换各页面底部输入框的空回调。
2. 将“继续追问 / 查看影响链路 / 查看压力影响 / 生成处置建议 / 加入跟踪”统一接入 Copilot。
3. 再做视觉微调，尤其是全局 Copilot 的半屏和全屏形态。
4. 最后整理 mock 数据结构，为后续真实接口接入做准备。
