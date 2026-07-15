# Codex Build Prompt — 预警出险模块 React 重建（HTML 原型联动版）

你将在仓库 `patshin/risk-assistant-demo` 中重建“预警出险”模块。

本任务不是在旧预警出险页面上做表面美化。新的系统性设计、`DESIGN_SPEC.md` 和 `prototype/index.html` 是新实现的事实来源。旧模块的数据结构、页面结构、组件边界、Mock、状态管理和 CSS 均不构成兼容约束。

---

## 0. 最终目标

在现有 React 应用中实现一套生产级、可维护、可交互的预警出险模块，覆盖：

- 总览
- 预警资产
- 预警迁移
- 重大预警客户列表
- 出险资产
- 出险客户列表
- 法人客户风险概览
- 预警资产详情
- 出险资产详情
- 筛选、排序、空状态和错误状态
- 加入重点跟踪
- 更新跟踪进展
- 加入风险报告
- 全局 Copilot 结构化事实查询
- 返回、分享、弹层和操作反馈
- 375、390、393、414、430px 宽度适配

生产实现必须使用仓库现有 React / TypeScript / React Router 架构，不得嵌入或直接发布单文件 HTML 原型。

---

## 1. 开始前必须完成

### 1.1 读取仓库指令

首先读取：

- 仓库根目录 `AGENTS.md`
- 将要修改目录中的任何嵌套 `AGENTS.md`
- 与设计、前端、测试相关的项目说明

遵循层级最近的 `AGENTS.md`。

### 1.2 检查 Git 状态

先运行：

```bash
git status --short
git branch --show-current
```

要求：

- 识别用户已有修改
- 不覆盖、不回滚、不清理无关修改
- 不格式化无关文件
- 不删除不属于本任务的文件
- 如已有修改与本任务重叠，先说明冲突和保护方案

### 1.3 读取全部设计资产

必须读取：

```text
design-references/warning-default/DESIGN_SPEC.md
design-references/warning-default/CODEX_BUILD_PROMPT.md
design-references/warning-default/prototype/index.html
design-references/warning-default/prototype/README.md
design-references/warning-default/prototype/QA_REPORT.md
design-references/warning-default/prototype/manifest.json
design-references/warning-default/prototype/screenshots/
```

不要只查看 PNG。HTML 原型是交互、Hash、状态恢复和布局行为的可执行参考。

### 1.4 实际运行 HTML 原型

在开始编码前，必须在浏览器中打开：

```text
design-references/warning-default/prototype/index.html#/credit/warning
```

逐一访问 `prototype/README.md` 中列出的所有 Hash。

优先直接打开本地文件；如自动化浏览器限制 `file://`，使用环境已有的本地静态服务工具，不要为此新增项目依赖。例如在 Python 已存在时，可从参考目录启动：

```bash
python3 -m http.server 4174
```

然后打开相应本地 URL 和 Hash。

必须实际点击：

- Tab
- 本日 / 本月
- 客户列表
- 搜索
- 筛选
- 排序
- 返回
- 资产下钻
- 加入跟踪
- 更新进展
- 加入报告
- Copilot

### 1.5 审计现有项目

检查：

- `HashRouter` 和当前路由
- 全局 App Shell
- 全局 tokens
- `PageHeader`
- `BottomAskBar`
- `BottomSheet`
- `GlobalCopilot`
- 信用风险三级 Tab
- 风险跟踪和风险报告入口
- 构建与 GitHub Pages 机制
- 旧预警出险实现所在文件

审计目标不是保留旧实现，而是判断哪些全局能力符合新设计、哪些模块内容应彻底替换。

### 1.6 修改前先报告计划

在写代码前先向用户说明：

1. 计划修改的文件和目录
2. 新建的模块目录
3. 预计复用的全局组件
4. 预计扩展或重写的组件
5. 旧预警出险入口如何切换到新模块
6. 数据类型和 Mock 如何拆分
7. 路由和页面状态如何实现
8. 浏览器 QA 如何执行

如果预计修改超过5个文件，必须说明：

- 为什么超过5个文件是必要的
- 每组文件的职责
- 如何保证不修改无关模块

---

## 2. 必须使用的技能和工具

### 2.1 `$impeccable`

用于：

- 视觉实现
- 字体、字重、行高和基线
- 间距和卡片一致性
- 标签、按钮和图表精修
- 响应式稳定性
- 最终视觉走查

### 2.2 `$vercel-react-best-practices`

用于检查：

- React 组件边界
- 数据与页面分离
- 派生状态
- Effect 使用
- 渲染性能
- 列表 key
- 状态管理
- 可维护性
- 大组件拆分

### 2.3 `$agent-browser`

用于：

- 打开 HTML 原型
- 打开开发中的 React 应用
- 在相同视口对照
- 逐页点击流程
- 截图
- 检查控制台
- 验证响应式
- 修复后重新验证

### 2.4 依赖限制

不得新增依赖，除非：

1. 说明现有 React、CSS、SVG 和已有依赖为什么不能完成；
2. 说明依赖用途、体积和替代方案；
3. 获得用户明确批准。

优先使用：

- React
- TypeScript
- React Router
- 现有 `lucide-react`
- CSS
- 原生 SVG
- 浏览器原生 API

---

## 3. 事实来源和冲突处理

优先级：

1. 已确认业务规则和系统性产品结论
2. `prototype/index.html`
3. `DESIGN_SPEC.md`
4. 原型浏览器截图
5. 现有全局应用外壳和合适 tokens
6. 旧模块代码

### 3.1 HTML 原型的使用方式

原型用于读取：

- 内容顺序
- 页面层级
- Hash 路由和 Query 状态
- 点击行为
- 返回行为
- 筛选草稿与应用
- 空状态和错误状态
- 弹层结构
- 反馈状态
- 视觉节奏
- 响应式意图

原型不得：

- 被 iframe 嵌入
- 被复制到 `public/` 作为生产页面
- 使用 `dangerouslySetInnerHTML` 注入
- 被包装成一个 React `useEffect` 单文件
- 成为生产单一数据源
- 被直接修改以掩盖生产实现差异

### 3.2 PNG 的使用方式

PNG 只用于：

- 快速视觉索引
- 滚动位置参考
- QA 证据

不得只根据 PNG 猜交互。

### 3.3 旧模块

旧预警出险模块只可作为迁移入口参考。允许彻底重建：

- 数据模型
- 页面
- 组件
- Mock
- 状态
- 样式

不要在旧代码上做“换皮”。

---

## 4. 推荐模块架构

可按仓库习惯调整名称，但必须保持清晰边界，例如：

```text
src/features/warning-default/
├── pages/
│   ├── WarningOverviewPage.tsx
│   ├── PrewarningOverviewPage.tsx
│   ├── WarningMigrationPage.tsx
│   ├── RiskCustomerListPage.tsx
│   ├── RiskCustomerDetailPage.tsx
│   ├── RiskAssetDetailPage.tsx
│   ├── DefaultOverviewPage.tsx
│   └── TrackingDetailPage.tsx
├── components/
├── charts/
├── data/
├── hooks/
├── types/
├── utils/
├── styles/
└── routes.tsx
```

要求：

- 类型独立
- Mock 独立
- formatter 独立
- 页面独立
- 弹层组件独立
- 图表独立
- 路由状态独立
- 业务聚合不写在 JSX 中

不得把所有页面和数据塞回一个 `CreditRiskPage.tsx`。

---

## 5. 路由要求

建议 canonical routes：

```text
/credit/warning
/credit/warning/prewarnings
/credit/warning/prewarnings/migrations
/credit/warning/prewarnings/customers
/credit/warning/customers/:customerId
/credit/warning/assets/:assetId
/credit/warning/defaults
/credit/warning/defaults/customers
/watch/tracking/:trackingId
```

旧入口：

```text
/credit?tab=warning
```

应重定向或进入新模块，不能继续展示旧预警页面。

Query 状态：

```text
?period=today|month
?member=<id>
?search=<text>
?sort=amountDesc|dateDesc
?sheet=metrics|filter|tracking|progress|report
?state=error
?copilot=1
```

要求：

- HashRouter 刷新后恢复页面
- 直接访问子路由可工作
- 弹层可通过浏览器返回关闭
- 返回列表保留 Query

---

## 6. 必须实现的页面和状态

逐一对应原型：

- WD-01A / WD-01B：总览同一长页
- WD-01-S1：指标口径弹层
- WD-02：预警资产总览
- WD-02-E1：成员公司空状态
- WD-03：预警迁移
- WD-04：重大预警客户
- WD-04-S1：重大预警筛选
- WD-04-E1：无结果
- WD-04-E2：错误
- WD-05：重大预警客户概览
- WD-06：预警资产详情
- WD-07：出险资产总览
- WD-08：出险客户
- WD-08-S1：出险筛选
- WD-08-E1：错误
- WD-09：出险客户概览
- WD-10A / WD-10B：出险资产详情同一长页
- WD-10-S1：创建重点跟踪
- WD-11：重点跟踪详情
- WD-11-S2：更新跟踪进展
- WD-11-S1：加入风险报告
- WD-AI-01：全局 Copilot

不要将滚动续页实现成独立页面。

---

## 7. 新数据模型

必须按 `DESIGN_SPEC.md` 建立独立类型：

- `RiskLevel`
- `RiskTrend`
- `WarningStatus`
- `WarningTransitionType`
- `DefaultStatus`
- `LimitStatus`
- `ManagementStrategy`
- `DispositionStatus`
- `TrackingStatus`
- `TrackingPriority`

禁止一个笼统 `status`。

核心实体：

- `MemberCompany`
- `CorporateGroup`
- `CorporateCustomer`
- `RiskAsset`
- `WarningSignal`
- `RiskStateTransition`
- `DefaultEvent`
- `WarningDefaultSnapshot`
- `TrackingCase`
- `TrackingRecord`
- `ReportInclusionDraft`
- `CopilotFactResponse`

必须标记数据来源：

- confirmed
- derived
- demo

页面不得把演示数据伪装成已确认事实。

---

## 8. 必须保持一致的业务数据

### 8.1 总览

- 数据日期：2026-06-24
- 本月新增重大预警：0.60亿元、5户
- 本月新增出险：0.83亿元、7户
- 本日新增重大预警：0.00亿元、0户
- 本日新增出险：0.05亿元、1户
- 预警资产：3,342亿元、964户
- 出险资产：2,967亿元、731户

### 8.2 三级预警

- 重大：1,162亿元、34.77%、较上月末-9亿元
- 二级：1,320亿元、39.49%、较上月末-3亿元
- 一级：860亿元、25.74%、较上月末-4亿元
- 全部预警净变化：-16亿元
- 上月末预警资产：3,358亿元，派生值

### 8.3 重大预警案例

常宁市尚宇高级中学有限公司：

- 所属集团：湖南尚宇教育投资集团
- 成员公司：医保科技
- 预警日期：2026-06-23
- 规模：0.25亿元
- 当前状态：重大预警
- 预警原因：暂无可用触发原因明细

欧龙汽车贸易集团有限公司：

- 所属集团：欧龙汽车贸易集团
- 成员公司：租赁
- 预警日期：2026-06-15
- 规模：0.24亿元

### 8.4 出险案例

广西百色试验区发展集团有限公司：

- 所属集团：广西百色城市产业发展集团
- 成员公司：租赁
- 出险规模：0.47亿元
- 业务类型：非标投资
- 项目 / 产品名称：广西百色试验区发展集团有限公司
- 投资组合：—
- 资金来源：一方资金
- 放款日：2022-05-23
- 到期日：2026-05-23
- 担保方：
  - 广西百色开发投资集团有限公司
  - 广西百色城市建设投资发展集团有限公司
- 出险类别：逾期（本息实质逾期）
- 出险日期：2026-06-01
- 出险认定时逾期：9天，派生值

泰州盈润光伏科技有限公司：

- 所属集团：江苏长明新能源电力科技集团
- 成员公司：租赁
- 出险日期：2026-06-01
- 规模：0.13亿元

---

## 9. 业务规则

必须实现：

1. 客户户数按法人公司去重。
2. 法人客户可有所属集团。
3. 所属集团不参与客户数计数。
4. 同一法人客户存在出险资产时，只计入出险客户数。
5. 客户名下每笔资产金额按自身当前状态归类。
6. 出险与当前预警互斥。
7. 一级、二级、重大可升级、降级、解除和重新进入。
8. 进入重大包括二级升级到重大。
9. 缺失预警原因时显示空值，不生成原因。
10. 跟踪状态不等于处置状态。
11. 创建跟踪不改变风险状态。
12. 逾期9天以到期日和出险认定日计算，不用当前日期。

不确定口径不得由前端推断。

---

## 10. 页面交互要求

### 10.1 总览

- 本日 / 本月真实切换
- 指标卡可下钻
- 三级结构可下钻
- 客户预览可下钻
- “全部”真实可用
- 口径弹层真实可用
- 分享真实可用
- BottomAskBar不遮挡内容

### 10.2 预警总览和迁移

- 成员公司切换
- 无数据状态
- 结构对比图
- 月份选择
- 排序
- 客户下钻
- 不虚构迁移来源

### 10.3 列表

- 搜索真实过滤
- 筛选 draft 和 applied 分离
- 排序真实改变结果
- URL Query 持久化
- 返回恢复状态
- 无结果可重置
- 错误可重试

### 10.4 客户和资产详情

- 数据完整
- 长名称稳定
- 查看完整字段平滑滚动
- 状态记录全部真实可用
- 加入跟踪 / 报告真实可用

### 10.5 跟踪

- 责任人、截止日期必填
- 未完成时按钮禁用
- 提交中防重复
- 成功进入跟踪详情
- 失败保留输入
- 更新进展真实可用
- 查看原资产真实可用

### 10.6 报告

- 目标报告选择
- 内容勾选
- 摘要预览
- 至少选择一项
- 成功 / 失败反馈

### 10.7 Copilot

- 使用当前页面和 Query 上下文
- 返回确认的结构化事实
- 显示数据日期
- 显示“AI推断：无”
- 不显示预测或处置建议
- 关闭恢复原状态

---

## 11. 视觉实现要求

严格遵循 `DESIGN_SPEC.md` 和原型的稳定规则：

- 390 × 844 基准
- 375 / 393 / 414 / 430px稳定
- 系统中文字体栈
- 等宽数字
- 明确字号和行高
- 页面边距14 / 16 / 18px
- 卡片使用最小高度而非裁切固定高度
- 标签内部不换行
- 客户名最多2行
- 金额与单位不换行
- 图表响应式 SVG
- 页面无横向溢出
- Bottom Sheet Body可滚动
- BottomAskBar不遮挡
- Safe Area正确

不要以像素级复制原型中的偶发误差为目标。

---

## 12. 公共组件复用

优先评估：

- `AppShell`
- 全局 tokens
- `PageHeader`
- 路由
- `BottomAskBar`
- `GlobalCopilotProvider`
- `BottomSheet`
- 通用图标

只有视觉和行为都符合新设计时才复用。

不匹配时应重写或扩展，不得为了复用强行改变设计。

特别注意：

- 旧 `TabBar` 胶囊样式不适合信用风险三级导航
- 旧 `AIInsightCard` 不应出现在本模块
- 旧 `RiskCard` 不等于新法人客户或资产卡
- 旧 Copilot 通用“传导链路/推荐动作”不适合本模块

---

## 13. 无障碍和异常状态

必须实现：

- 44px最小点击区
- 键盘焦点
- `aria-label`
- Dialog语义
- 焦点锁定和恢复
- Esc关闭
- 宿主滚动锁
- Toast `aria-live`
- Reduced Motion
- 图表文本替代

必须区分：

- Loading
- Empty
- No Results
- Error
- Zero
- Unavailable
- Success
- Failure

真实零：

- `0.00亿元`
- `0户`

数据不可用：

- `—`
- `暂无数据`

---

## 14. 禁止事项

- 不修改无关模块
- 不重写大户风险和集中度风险
- 不新增未经批准的依赖
- 不嵌入 HTML 原型
- 不复制原型单文件架构
- 不用 `dangerouslySetInnerHTML` 渲染原型
- 不创建页面级AI摘要
- 不增加AI预测或处置建议
- 不使用无意义占位文字
- 不使用随机业务金额
- 不留下不可点击按钮
- 不把所有页面写在一个组件
- 不把所有状态放在一个字段
- 不隐藏控制台错误
- 不只实现总览
- 不停在“基本完成”

---

## 15. 分阶段执行

### 阶段1：资产和现状审计

完成：

- 读取 AGENTS
- Git 状态
- 原型全部 Hash 体验
- 参考截图清单
- 路由审计
- 公共组件审计
- 旧模块边界

先输出审计结论。

### 阶段2：新数据模型与组件边界

完成：

- 新 TypeScript 类型
- Mock 数据
- 数据来源标记
- formatter
- route model
- filter model
- component map

使用 `$vercel-react-best-practices` 检查。

### 阶段3：页面和流程实现

顺序：

1. 总览
2. 预警总览
3. 预警迁移
4. 重大预警列表和筛选
5. 预警客户和资产详情
6. 出险总览
7. 出险列表和筛选
8. 出险客户和资产详情
9. 跟踪
10. 报告
11. Copilot
12. 空和错误状态

### 阶段4：视觉精修

使用 `$impeccable`：

- 字体
- 基线
- 间距
- 卡片
- 标签
- 图表
- 弹层
- BottomAskBar
- 视口适配

### 阶段5：浏览器验收

使用 `$agent-browser` 同时打开：

- HTML 原型参考
- React 开发实现

在相同视口和对应路由逐页对照：

- 内容
- 顺序
- 交互
- 状态
- 视觉意图

不是机械像素比对，不复制原型偶发误差。

发现问题后继续修正并重新截图。

### 阶段6：构建检查

运行：

```bash
npm run build
git diff --check
```

启动开发服务器并给出 URL。

检查：

- HashRouter刷新
- 控制台错误和警告
- 关键路由直接访问

### 阶段7：最终总结

必须说明：

- 修改文件
- 新路由
- 新数据类型
- 复用和重写组件
- 完成页面
- 完成交互
- 浏览器验证视口
- 构建结果
- 与原型仍有差异
- 未完成项和原因

不得把未验证内容写成已完成。

---

## 16. 开发前应向用户发送的简短说明模板

```text
我已读取 AGENTS.md、DESIGN_SPEC.md 和 prototype/ 全部资产，并在浏览器中走查了全部 Hash。

本次会把 prototype/index.html 作为交互和布局参考，在现有 React + HashRouter 中模块化重建，不会嵌入或复制单文件原型，也不会为复用旧预警模块而妥协新设计。

预计修改范围：
1. 路由与旧入口切换
2. 新预警出险 feature 目录
3. 模块级类型、Mock 和格式化
4. 页面、弹层和图表组件
5. Global Copilot 的本模块结构化事实回答
6. 模块样式和必要的公共组件扩展

预计超过5个文件，因为页面、数据、组件和样式需要分离；不修改大户风险、集中度风险等无关模块。

实施顺序：资产审计 → 数据模型 → 页面流程 → 视觉精修 → 浏览器验收 → 构建检查。
```
