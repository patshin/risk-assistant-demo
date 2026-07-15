# 预警出险模块 Design Specification

- 文档版本：2.0（HTML 原型联动版）
- 模块：信用风险 / 预警与出险
- 适用仓库：`patshin/risk-assistant-demo`
- 主要视口：390 × 844
- 设计参考目录：`design-references/warning-default/`
- 可执行原型：`design-references/warning-default/prototype/index.html`
- 原型默认入口：`prototype/index.html#/credit/warning`
- 文档目的：将已确认的业务、页面、视觉和交互规则转换为可直接编码、测试和验收的生产实现规范

> 本文不重新设计产品。业务分类、字段、对象关系、状态关系、页面动线和 AI 边界均已确认。HTML 原型是可执行设计参考，不是生产代码模板。

---

## 1. Document Scope

### 1.1 覆盖范围

本规范覆盖“预警出险”模块的完整移动端体验：

- 模块入口与预警出险总览
- 本日 / 本月新增重大预警与新增出险
- 预警资产存量、等级结构和迁移
- 出险资产存量、当期新增和趋势
- 法人客户列表、搜索、筛选和排序
- 法人客户风险概览
- 单笔预警资产详情
- 单笔出险资产详情
- 状态变化和关键时间线
- 轻量重点跟踪创建与跟踪详情
- 更新跟踪进展
- 加入风险报告草稿
- 底部 AI 输入和全局 Copilot 结构化事实查询
- 返回、分享、弹层、Toast、加载、空数据、无结果和错误状态
- 375、390、393、414、430px 宽度下的稳定布局

### 1.2 目标设备和主要视口

基准视口：

- 390 × 844

必须稳定支持：

- 375 × 812
- 390 × 844
- 393 × 852
- 414 × 896
- 430 × 932

这是移动端管理产品，不得通过 `transform: scale()` 缩放整页，也不得按桌面看板缩小实现。

### 1.3 设计资产结构

推荐仓库内保持以下结构：

```text
design-references/warning-default/
├── DESIGN_SPEC.md
├── CODEX_BUILD_PROMPT.md
├── CODEX_ACCEPTANCE_PROMPT.md
└── prototype/
    ├── index.html
    ├── README.md
    ├── QA_REPORT.md
    ├── manifest.json
    ├── screenshots-contact.png
    └── screenshots/
```

### 1.4 HTML 原型的角色

`prototype/index.html` 是：

- 页面内容顺序的可执行参考
- Hash 路由和页面状态的可执行参考
- 点击、返回、筛选、排序、弹层和反馈行为的可执行参考
- 稳定布局、组件复用和响应式规则的参考
- 测试数据一致性的参考

`prototype/index.html` 不是：

- 可直接复制进生产项目的单文件实现
- 生产组件拆分范例
- 生产状态管理范例
- 生产数据访问层范例
- 应被 iframe 嵌入的页面
- 应替代 React 实现的静态资源

生产实现必须在现有 React 应用中按合理组件和数据边界重建，不得把原型整体复制、嵌入或包装成生产页面。

### 1.5 PNG 的角色

`prototype/screenshots/` 中的 PNG 均由 HTML 原型在真实浏览器中截取，仅用于：

- 页面和状态索引
- 快速视觉对照
- QA 证据

当 PNG 与 HTML 原型因滚动位置、字体渲染或截图裁切产生差异时：

- 交互和结构以 HTML 原型为准
- 稳定排版以本规范为准
- 已确认业务事实优先于二者

### 1.6 不覆盖内容

本规范不要求建设：

- 完整客户监控模块
- 完整预警规则引擎后台
- 完整证据材料中心
- 完整风险处置审批流
- 核销、损失确认和结案状态机
- 全量任务中心
- 完整报告编辑器
- AI 风险预测
- AI 自动确定预警等级
- AI 自动生成风险原因
- AI 自动制定处置方案
- 页面级 AI 摘要卡片
- 跨成员公司的权限模型

---

## 2. Source-of-Truth Priority

发生冲突时，严格按以下优先级处理：

1. 本窗口中最后确认的业务规则和系统性产品结论
2. `prototype/index.html` 中的已确认内容、页面结构、交互和 Hash 状态
3. 本 `DESIGN_SPEC.md`
4. `prototype/screenshots/` 中由 HTML 原型截取的视觉索引
5. 项目现有全局应用外壳、合适的设计 tokens 和基础交互
6. GitHub 仓库中的旧预警出险实现

### 2.1 旧模块不构成兼容约束

以下旧内容均可替换：

- 页面结构
- 组件边界
- 数据模型
- TypeScript 类型
- Mock 数据格式
- 局部状态管理
- CSS 类名和样式组织
- 旧页面路由内部组织
- 旧兼容分支

### 2.2 新 UI 不得为复用旧代码妥协

不得因为旧组件存在而：

- 将新增事件、法人客户和风险资产混成一个对象
- 将风险等级、出险状态、趋势和跟踪状态合并为一个 `status`
- 保留大量成员公司的长横向 Tab
- 删除新 UI 中的已确认字段
- 让新页面继续依赖旧巨型页面组件
- 使用旧 Mock 中不一致的数据
- 把“跟踪中”当作“处置中”
- 在本模块增加通用 AI 风险建议

### 2.3 原型中的生成或实现误差不构成设计要求

不得复制：

- 偶发字体基线偏移
- 相同层级字号不一致
- 随内容随机变化的卡片高度
- 标签内部换行
- 图表标签重叠
- 底部 AI 输入遮挡内容
- 视觉上存在但没有行为的按钮
- 截图中的滚动段说明文字

验收目标是：

> 业务内容和动线忠实，视觉规则统一，真实浏览器中稳定，所有主要操作可完成。

---

## 3. Screen Inventory

### 3.1 ID 命名

- `WD-xx`：主页面
- `WD-xxA / WD-xxB`：同一长页面的不同滚动位置
- `WD-xx-S1`：该页面上的弹层或交互状态
- `WD-AI-xx`：全局 Copilot 状态
- `WD-E-xx`：空状态、错误状态等异常状态

长页面的滚动截图不是独立路由，不得在正式 UI 中显示“续页”字样。

### 3.2 页面资产清单

| ID | 文件名 | 页面 | Hash / 流程节点 | 类型 | 上一页 | 下一页 | 关键业务内容 | 对应交互 |
|---|---|---|---|---|---|---|---|---|
| WD-01A | `01-warning-overview-top.png` / `WD-01A-overview-top.png` | 预警出险总览首屏 | `#/credit/warning` | 主页面 | 信用风险入口 | WD-01B、WD-02、WD-07 | 本日/本月；新增重大预警0.60亿元、5户；新增出险0.83亿元、7户；预警资产3,342亿元、964户；出险资产2,967亿元、731户；三级预警变化 | Tab、周期切换、口径说明、进入专题、分享、Copilot |
| WD-01B | `02-warning-overview-lists.png` / `WD-01B-overview-scroll.png` | 预警出险总览续页 | `#/credit/warning` 同页滚动 | 滚动续页 | WD-01A | WD-02、WD-04、WD-07、WD-08 | 预警等级结构；新增重大预警客户预览；新增出险客户预览 | 点击结构、点击客户、进入全部列表 |
| WD-01-S1 | 原型内状态 | 指标口径 | `#/credit/warning?sheet=metrics` | 弹层 | WD-01 | WD-01 | 客户按法人去重；资产按自身状态归类；数据日期和规模口径说明 | 关闭、遮罩、Esc、返回 |
| WD-02 | `03-prewarning-assets.png` | 预警资产总览 | `#/credit/warning/prewarnings` | 主页面 | WD-01 | WD-03、WD-04 | 预警资产3,342亿元、964户；重大/二级/一级结构；上月末与当前对比；成员公司选择 | 等级下钻、迁移明细、成员公司切换 |
| WD-02-E1 | `19-empty-state.png` 的相应状态 | 预警资产成员公司空状态 | `#/credit/warning/prewarnings?member=租赁` | 空状态 | WD-02 | WD-02 | 当前成员公司无匹配预警资产 | 重置成员公司 |
| WD-03 | `04-warning-migration.png` / `WD-03-migrations.png` | 预警迁移 | `#/credit/warning/prewarnings/migrations` | 主页面 | WD-02 | WD-04 | 进入重大0.60亿元；新增出险0.83亿元；重大净变化-9亿元；全部预警净变化-16亿元 | 月份、成员公司、排序、客户下钻 |
| WD-04 | `05-major-warning-customers.png` | 重大预警客户列表 | `#/credit/warning/prewarnings/customers` | 主页面 | WD-01B、WD-03 | WD-04-S1、WD-05 | 汇总0.60亿元、5户；搜索；条件；客户卡片 | 搜索、筛选、排序、客户下钻 |
| WD-04-S1 | `06-major-warning-filter.png` / `WD-04-S1-warning-filter.png` | 重大预警筛选 | `#/credit/warning/prewarnings/customers?sheet=filter` | 弹层 | WD-04 | WD-04 | 成员公司、时间范围、排序 | 草稿选择、重置、应用、关闭 |
| WD-04-E1 | `19-empty-state.png` | 重大预警无结果 | `#/credit/warning/prewarnings/customers?member=银行` | 无结果状态 | WD-04 | WD-04 | 当前条件无结果 | 重置筛选 |
| WD-04-E2 | `20-error-state.png` | 重大预警列表错误 | `#/credit/warning/prewarnings/customers?state=error` | 错误状态 | WD-04 | WD-04 | 列表加载失败 | 重试、返回 |
| WD-05 | `07-warning-customer-detail.png` | 法人客户风险概览—重大预警 | `#/credit/warning/customers/changning-shangyu` | 主页面 | WD-04 | WD-06、WD-10-S1 | 法人客户、所属集团、成员公司、重大预警资产0.25亿元；风险资产；状态记录 | 查看资产、加入跟踪、状态记录展开 |
| WD-06 | `08-warning-asset-detail.png` / `WD-06-warning-asset-detail.png` | 预警资产详情 | `#/credit/warning/assets/changning-shangyu-20260623` | 主页面 | WD-05 | WD-10-S1、WD-11-S1 | 重大预警0.25亿元；预警日期；成员公司；所属集团；暂无原因；状态变化 | 加入跟踪、加入报告、返回 |
| WD-07 | `09-default-assets.png` | 出险资产总览 | `#/credit/warning/defaults` | 主页面 | WD-01 | WD-08 | 出险资产2,967亿元、731户；本月新增0.83亿元、7户；本日0.05亿元、1户；成员公司；趋势演示 | 周期切换、成员公司、查看明细 |
| WD-08 | `10-default-customers.png` | 出险客户列表 | `#/credit/warning/defaults/customers` | 主页面 | WD-01B、WD-07 | WD-08-S1、WD-09 | 汇总0.83亿元、7户；搜索；筛选；出险客户卡片 | 搜索、筛选、排序、客户下钻 |
| WD-08-S1 | `11-default-filter.png` | 出险筛选 | `#/credit/warning/defaults/customers?sheet=filter` | 弹层 | WD-08 | WD-08 | 成员公司、出险日期、出险类别、排序 | 草稿选择、重置、应用、关闭 |
| WD-08-E1 | `20-error-state.png` | 出险列表错误 | `#/credit/warning/defaults/customers?state=error` | 错误状态 | WD-08 | WD-08 | 出险列表加载失败 | 重试、返回 |
| WD-09 | `12-default-customer-detail.png` / `WD-09-default-customer-detail.png` | 法人客户风险概览—出险 | `#/credit/warning/customers/guangxi-baise` | 主页面 | WD-08 | WD-10A、WD-10-S1 | 广西百色客户；所属集团；出险0.47亿元；租赁；逾期；本息实质逾期；关键日期；风险资产 | 查看资产、加入跟踪 |
| WD-10A | `13-default-asset-detail-top.png` / `WD-10A-default-asset-top.png` | 出险资产详情首屏 | `#/credit/warning/assets/guangxi-baise-047` | 主页面 | WD-09 | WD-10B、WD-10-S1 | 出险0.47亿元；出险日期；类别；逾期9天；到期日；业务类型；项目；资金来源 | 加入跟踪、查看完整字段 |
| WD-10B | `14-default-asset-detail-fields.png` / `WD-10B-default-asset-scroll.png` | 出险资产详情续页 | 同一 Hash 滚动 | 滚动续页 | WD-10A | WD-10-S1、WD-11-S1 | 投资组合、放款日、到期日、担保方、出险字段、关键时间线 | 加入报告、加入跟踪、返回顶部 |
| WD-10-S1 | `15-tracking-sheet.png` / `WD-10-S1-tracking-sheet.png` | 加入重点跟踪 | `#/credit/warning/assets/guangxi-baise-047?sheet=tracking&asset=guangxi-baise-047` | 弹层 | WD-10 | WD-11 | 跟踪主题、责任成员公司、责任人、截止日期、频率 | 校验、取消、创建、失败重试 |
| WD-11 | `16-tracking-detail.png` / `WD-11-tracking-detail.png` | 重点跟踪详情 | `#/watch/tracking/guangxi-baise-default` | 主页面 / 交互状态 | WD-10-S1 | WD-11-S1、WD-11-S2、WD-10 | 出险、跟踪中、重点跟踪；责任人、期限、频率、进展、记录 | 更新进展、查看原资产、加入报告 |
| WD-11-S2 | 原型内状态 | 更新跟踪进展 | `#/watch/tracking/guangxi-baise-default?sheet=progress` | 弹层 | WD-11 | WD-11 | 进展文本、来源、日期 | 提交、取消、错误重试 |
| WD-11-S1 | `17-report-sheet.png` / `WD-11-S1-report-sheet.png` | 加入风险报告 | `#/watch/tracking/guangxi-baise-default?sheet=report&asset=guangxi-baise-047` | 弹层 | WD-11 | WD-11 | 目标报告、包含内容、事实摘要预览 | 勾选、提交、成功/失败反馈 |
| WD-AI-01 | `18-copilot.png` / `WD-AI-01-copilot.png` | 全局 Copilot | `#/credit/warning?copilot=1` | 交互状态 | 任一支持页面 | 返回原页面 | 本月重大预警和出险结构化事实；重点事项；AI推断为无 | 查询、继续追问、关闭、返回上下文 |
| WD-R-375 | `RESP-375-overview.png` | 375px 总览响应式参考 | 同WD-01 | QA参考 | — | — | 375 × 812稳定布局 | 无横向溢出 |
| WD-R-414 | `RESP-414-report-sheet.png` | 414px 报告弹层参考 | 同WD-11-S1 | QA参考 | — | — | 414 × 896弹层布局 | Footer与安全区 |
| WD-R-430 | `RESP-430-default-asset.png` | 430px 出险资产参考 | 同WD-10 | QA参考 | — | — | 430 × 932详情布局 | 宽屏仍保持移动单列 |

### 3.3 原型路由恢复要求

以下 Hash 必须在刷新后可恢复：

```text
#/credit/warning
#/credit/warning?period=today
#/credit/warning?sheet=metrics
#/credit/warning/prewarnings
#/credit/warning/prewarnings?member=租赁
#/credit/warning/prewarnings/migrations
#/credit/warning/prewarnings/customers
#/credit/warning/prewarnings/customers?sheet=filter
#/credit/warning/prewarnings/customers?member=银行
#/credit/warning/prewarnings/customers?state=error
#/credit/warning/customers/changning-shangyu
#/credit/warning/assets/changning-shangyu-20260623
#/credit/warning/defaults
#/credit/warning/defaults/customers
#/credit/warning/defaults/customers?sheet=filter
#/credit/warning/defaults/customers?state=error
#/credit/warning/customers/guangxi-baise
#/credit/warning/assets/guangxi-baise-047
#/credit/warning/assets/guangxi-baise-047?sheet=tracking&asset=guangxi-baise-047
#/watch/tracking/guangxi-baise-default
#/watch/tracking/guangxi-baise-default?sheet=progress
#/watch/tracking/guangxi-baise-default?sheet=report&asset=guangxi-baise-047
#/credit/warning?copilot=1
```

---

## 4. User Flow

### 4.1 完整主流程

```text
信用风险入口
→ 预警出险总览
→ 预警资产 / 出险资产
→ 迁移或法人客户列表
→ 法人客户风险概览
→ 风险资产详情
→ 加入重点跟踪
→ 重点跟踪详情
→ 更新进展
→ 加入风险报告
```

### 4.2 重大预警路径

```text
#/credit/warning
→ #/credit/warning/prewarnings
→ #/credit/warning/prewarnings/migrations
→ #/credit/warning/prewarnings/customers
→ #/credit/warning/customers/changning-shangyu
→ #/credit/warning/assets/changning-shangyu-20260623
```

进入条件：用户点击预警存量、等级结构、迁移或新增重大预警客户。

用户目的：

- 判断重大预警规模和在全部预警中的位置
- 理解本月进入重大预警和存量净变化
- 找到贡献新增规模的法人客户
- 查看对应风险资产事实

主要操作：

- 本日 / 本月切换
- 月份和成员公司选择
- 搜索、筛选和排序
- 客户、资产下钻
- 需要时加入跟踪或报告

返回行为：

- 资产详情返回客户概览
- 客户概览返回原列表
- 列表返回原迁移或总览
- 返回后保留查询条件和滚动位置

### 4.3 出险路径

```text
#/credit/warning
→ #/credit/warning/defaults
→ #/credit/warning/defaults/customers
→ #/credit/warning/customers/guangxi-baise
→ #/credit/warning/assets/guangxi-baise-047
→ ?sheet=tracking
→ #/watch/tracking/guangxi-baise-default
→ ?sheet=progress / ?sheet=report
```

用户目的：

- 查看当前出险规模和本期新增
- 找到具体法人客户和风险资产
- 查看出险事实、业务字段和关键日期
- 需要时创建轻量跟踪
- 将已确认事实加入报告

### 4.4 Copilot 路径

```text
任一支持页面
→ 点击底部 AI 输入或“＋”
→ 打开全局 Copilot
→ 基于当前页面结构化数据查询
→ 继续追问或关闭
→ 返回原页面、原筛选和原滚动位置
```

Copilot 不自动：

- 改变风险状态
- 创建跟踪
- 加入报告
- 生成预测
- 生成处置建议

### 4.5 状态保留

返回后必须保留：

- 当前周期
- 当前成员公司
- 搜索词
- 已应用筛选
- 排序
- 列表滚动位置
- 资产详情滚动位置
- Copilot 关闭前的宿主页面

弹层关闭不提交草稿状态；只有“应用”或“确认”才提交。

---

## 5. Information Architecture

### 5.1 预警出险总览 WD-01

页面目标：回答本期新增风险规模、当前存量、三级预警结构和主要新增对象。

从上到下：

1. 页面 Header
   - 标题：信用风险
   - 返回
   - 分享
2. 信用风险三级 Tab
   - 大户风险
   - 集中度风险
   - 预警与出险
3. 新增风险规模
   - 本日 / 本月
   - 新增重大预警规模和法人客户数
   - 新增出险规模和法人客户数
4. 数据口径
   - 截至日期
   - 规模优先
   - 客户按法人去重
5. 存量风险
   - 预警资产和预警客户
   - 出险资产和出险客户
6. 本月主要变化
   - 重大、二级、一级金额和较上月末变化
7. 预警资产等级结构
   - 金额
   - 占比
8. 本月新增重大预警客户预览
9. 本月新增出险客户预览
10. 底部 AI 输入

折叠规则：

- 总览是一个连续页面
- 不出现“续页”标识
- 客户预览可显示前2项，“全部”进入完整列表

### 5.2 预警资产总览 WD-02

首屏问题：当前预警资产规模、客户数和等级结构是什么？

区块：

1. Header
2. 集团汇总 Hero
3. 三级预警卡
4. 上月末与当前结构对比图
5. 成员公司筛选
6. 迁移入口
7. 底部 AI 输入

成员公司无数据时：

- 保留当前筛选可见
- 显示无数据原因
- 提供“恢复集团汇总”

### 5.3 预警迁移 WD-03

首屏问题：本月进入重大预警多少，重大和全部预警净变化多少？

区块：

1. Header
2. 月份和成员公司
3. 4个迁移指标
4. 口径说明
5. 本月进入重大预警的客户列表
6. 底部 AI 输入

不得在无数据支持时拆解：

- 升级规模
- 降级规模
- 解除规模
- 重复进入规模

### 5.4 客户列表 WD-04 / WD-08

结构：

1. Header
2. 汇总指标
3. 搜索
4. 已应用快捷条件
5. 法人客户卡片列表
6. 加载 / 空结果 / 错误状态
7. 底部 AI 输入

列表行数据：

- 法人客户名称
- 所属集团
- 风险金额
- 风险标签
- 成员公司
- 日期

默认排序：规模从高到低。

### 5.5 法人客户风险概览 WD-05 / WD-09

页面目标：汇总一个法人客户与当前风险事项有关的事实和资产。

区块：

1. Header
2. 客户风险 Hero
   - 当前风险分类
   - 日期
   - 法人客户
   - 所属集团
   - 风险金额
   - 成员公司
3. 风险概况或结论
4. 风险资产列表
5. 状态记录或关键日期
6. 底部 AI 输入

业务边界：

- 客户按最高风险状态计数
- 资产金额按每笔资产自身状态归类
- 不得暗示出险客户名下所有资产均已出险

### 5.6 预警资产详情 WD-06

区块：

1. Header
2. 重大预警 Hero
3. 风险事实
4. 预警原因空值
5. 状态变化
6. 加入报告 / 加入跟踪
7. 底部 AI 输入

预警原因未提供时必须显示：

> 暂无可用触发原因明细

不得生成或推断原因。

### 5.7 出险资产总览 WD-07

区块：

1. Header
2. 出险存量 Hero
3. 本日 / 本月新增出险
4. 成员公司选择
5. 出险趋势
6. 明细入口
7. 底部 AI 输入

趋势历史值是演示数据，必须显示“趋势演示”。

### 5.8 出险资产详情 WD-10

首屏：

1. Header
2. 出险 Hero
3. 出险类别
4. 逾期时长
5. 到期日和出险日
6. 成员公司
7. 业务类型
8. 项目 / 产品名称
9. 资金来源
10. 加入跟踪 / 查看完整字段

续页：

1. 投资组合
2. 放款日
3. 到期日
4. 担保方
5. 出险类别
6. 出险日期
7. 出险规模
8. 关键时间线
9. 加入报告 / 加入跟踪

### 5.9 跟踪 WD-10-S1 / WD-11

创建跟踪字段：

- 跟踪主题
- 责任成员公司
- 责任人
- 截止日期
- 跟踪频率

跟踪详情：

- 风险状态
- 跟踪状态
- 跟踪优先级
- 关联资产
- 责任人
- 截止日期
- 频率
- 最新进展
- 跟踪记录
- 更新进展
- 查看原资产
- 加入报告

跟踪不改变风险分类。

### 5.10 报告 WD-11-S1

区块：

1. 目标报告
2. 包含内容
3. 事实摘要预览
4. 取消
5. 加入报告草稿

提交成功后：

- 关闭弹层
- 显示成功 Toast
- 不自动跳转报告编辑器

### 5.11 Copilot WD-AI-01

输出顺序：

1. 当前页面上下文
2. 用户问题
3. 业务事实
4. 数据日期
5. 重点新增事项
6. AI 推断：无
7. 边界说明
8. 继续追问

---

## 6. Design Tokens

### 6.1 原型中已稳定使用的全局 tokens

```css
:root {
  color-scheme: light;

  --font-sans: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;

  --font-size-page-title: 22px;
  --font-size-section: 17px;
  --font-size-card-title: 16px;
  --font-size-body: 14px;
  --font-size-secondary: 13px;
  --font-size-caption: 12px;
  --font-size-label: 11px;

  --line-page-title: 28px;
  --line-section: 24px;
  --line-card-title: 22px;
  --line-body: 21px;
  --line-secondary: 19px;
  --line-caption: 17px;

  --color-bg: #fff7ec;
  --color-bg-soft: #fdf7ef;
  --color-surface: #ffffff;
  --color-surface-warm: #fffcf7;
  --color-surface-muted: #fff8f0;
  --color-text: #1f1b16;
  --color-text-soft: #7a7168;
  --color-text-muted: #9a8f84;
  --color-border: #f3e3d1;
  --color-divider: rgba(226, 203, 177, .68);
  --color-orange: #ff6a00;
  --color-orange-strong: #f97316;
  --color-orange-soft: #ffe8d2;
  --color-orange-softer: #fff0de;
  --color-success: #719a4a;
  --color-success-soft: #edf5df;
  --color-warning: #d58a16;
  --color-warning-soft: #fff0c9;
  --color-danger: #e85c23;
  --color-danger-soft: #ffe5d7;
  --color-default: #c94631;
  --color-default-soft: #fbe5df;
  --color-major: #c6481d;
  --color-major-soft: #ffe5d7;
  --color-level2: #b75400;
  --color-level2-soft: #ffe8d2;
  --color-level1: #8c6200;
  --color-level1-soft: #fff0c9;
  --color-overlay: rgba(44, 35, 28, .34);
  --color-focus: #ff7a1a;

  --space-1: 4px;
  --space-2: 6px;
  --space-3: 8px;
  --space-4: 10px;
  --space-5: 12px;
  --space-6: 14px;
  --space-7: 16px;
  --space-8: 20px;
  --space-9: 24px;
  --space-10: 32px;

  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-pill: 999px;
  --radius-sheet: 26px;

  --shadow-card: 0 12px 30px rgba(116, 72, 26, .08);
  --shadow-soft: 0 18px 48px rgba(150, 92, 34, .12);
  --shadow-float: 0 20px 54px rgba(73, 45, 16, .18);

  --page-max: 430px;
  --page-padding: 16px;
  --header-height: 60px;
  --touch-target: 44px;
  --button-height: 48px;
  --bottom-ask-height: 60px;
  --bottom-reserve: 104px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

### 6.2 仓库 token 复用

仓库中以下 token 与原型一致时可直接复用：

- `--color-bg`
- `--color-bg-soft`
- `--color-surface`
- `--color-surface-warm`
- `--color-orange`
- `--color-orange-strong`
- `--color-orange-soft`
- `--color-orange-softer`
- `--color-text`
- `--color-text-soft`
- `--color-text-muted`
- `--color-border`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--shadow-soft`
- `--shadow-card`
- `--shadow-float`
- `--radius-*`
- `--space-*`
- `--touch-target`
- `--safe-bottom`

缺少的模块语义 token 应新增，不能用一个通用红色替代所有风险状态。

### 6.3 状态色使用原则

- 重大预警：红橙，不等于出险
- 二级预警：橙色
- 一级预警：琥珀色
- 出险：更深的砖红
- 风险规模下降：绿色，只表示趋势下降
- 跟踪中：绿色，只表示跟踪状态
- 主操作：品牌橙色
- 中性信息：暖灰

同一颜色不得表达两个相互冲突的业务概念而没有文字标签。

---

## 7. Typography Rules

### 7.1 字体栈

```css
font-family: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
```

不得依赖在线字体。

数字统一：

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1;
```

### 7.2 字体层级

| 用途 | 字号 | 字重 | 行高 | 最大行数 | 对齐 / 溢出 |
|---|---:|---:|---:|---:|---|
| 页面标题 | 22px | 700 | 28px | 1 | 居中，省略 |
| 顶部 Tab | 15px | 650 | 22px | 1 | 居中，不换行 |
| Section 标题 | 17px | 700 | 24px | 1 | 左对齐 |
| 卡片标题 | 16px | 650 | 22px | 2 | 自然换行 |
| 列表客户名 | 15px | 700 | 21px | 2 | 超出省略 |
| 详情客户名 | 20px | 700 | 28px | 2 | 不缩小 |
| 正文 | 14px | 500 | 21px | 按场景 | 左对齐 |
| 辅助正文 | 13px | 500 | 19px | 2 | 超出省略 |
| Caption | 12px | 500 | 17px | 1 | 日期、单位、来源 |
| 标签 | 11px | 700 | 16px | 1 | 内部不换行 |
| 按钮 | 14px | 650 | 20px | 1 | 居中 |
| 图表标签 | 11px | 500 | 14px | 2 | 防重叠 |
| Hero 指标 | 30px | 700 | 32px | 1 | 等宽数字 |
| 大指标 | 28px | 700 | 31px | 1 | 等宽数字 |
| 等级指标 | 22px | 700 | 25px | 1 | 375px下可20px |
| 列表金额 | 19px | 700 | 23px | 1 | 右对齐 |

### 7.3 中文和数字混排

- 金额数字和单位保持同一行
- 数字与单位视觉间距4px
- 页面主指标使用“亿元”
- 紧凑卡片可使用“亿”，同组件内不得混用
- 百分比保留2位小数
- 百分号不得换行
- 日期统一 `YYYY-MM-DD`
- 月份统一 `YYYY年M月`
- 客户计数统一使用“户”或“法人客户”
- 不使用“家”替代已确认口径

### 7.4 长文本规则

- 页面标题：1行省略
- 客户名称列表：最多2行
- 客户名称详情：最多2行
- 所属集团列表：1行省略
- 所属集团详情：最多2行
- 风险原因：默认最多4行，超过提供展开
- 担保方：允许完整多行，不截断关键主体
- 单个标签：禁止内部换行
- 多标签：容器可换行

### 7.5 大数字规则

- 使用千位分隔
- 不通过无限缩小字号容纳
- 主指标最小24px
- 大于等于10,000亿元可统一转换为万亿元
- 真实0显示 `0.00 亿元`
- 数据不可用显示 `—` 并配合“暂无数据”

---

## 8. Layout Rules

### 8.1 页面框架

- 宽度100%
- 最大宽度430px
- 不显示手机外壳
- 不显示假的系统状态栏
- 页面无横向滚动
- App Shell 自身纵向滚动

页面左右边距：

- 375px：14px
- 390 / 393px：16px
- 414 / 430px：18px

可使用：

```css
padding-inline: clamp(14px, 4vw, 18px);
```

### 8.2 Header

- 最小高度60px
- 返回和分享点击区44 × 44px
- 三列布局：44px / 1fr / 44px
- 标题真实视觉居中
- sticky top: 0
- z-index: 20

### 8.3 内容区

- Section gap：16px
- 大区块 gap：20px或24px
- 卡片内边距：14px或16px
- 禁止在同一组件随意使用13、15、17、19px间距

### 8.4 Grid

双列 KPI：

```css
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 10px;
```

三级预警：

```css
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: 8px;
```

事实网格：

- 2列
- gap 10px
- 长字段可跨2列
- 同一行等高

### 8.5 卡片最小高度

| 组件 | 最小高度 |
|---|---:|
| 新增风险指标卡 | 126px |
| 存量风险卡 | 126px |
| 等级卡 | 108px |
| 汇总 Hero | 146px |
| 客户列表项 | 100px |
| 客户概览 Hero | 198px |
| 风险资产卡 | 168px |
| 时间线区 | 126px |
| 预警结构图卡 | 220px |
| 出险趋势图卡 | 200px |
| 跟踪 Hero | 240px |

使用 `min-height`，长内容自然增高。禁止固定高度裁切正文。

### 8.6 底部 AI 输入

- fixed
- 高度60px
- 底部 `12px + safe-area`
- 宽度 `min(calc(100vw - 28px), 402px)`
- 内容区预留至少104px
- z-index 30
- 弹层打开时置于遮罩下或隐藏

### 8.7 Bottom Sheet

- 最大高度74dvh
- 顶部圆角26px
- Header固定
- Body滚动
- Footer固定
- 打开时锁定宿主滚动
- 关闭后恢复原滚动位置和焦点

---

## 9. Component Specifications

### 9.1 推荐生产组件边界

```text
WarningDefaultRoutes
WarningOverviewPage
PrewarningOverviewPage
WarningMigrationPage
RiskCustomerListPage
RiskCustomerDetailPage
RiskAssetDetailPage
DefaultOverviewPage
TrackingDetailPage

WarningDefaultHeader
CreditRiskTabs
PeriodSwitch
DataScopeRow
SummaryMetricCard
RiskGradeCard
RiskStructureBar
MemberCompanyPicker
RiskCustomerList
RiskCustomerListItem
SearchField
FilterChip
FilterSheet
CustomerRiskHero
RiskFactGrid
RiskAssetCard
KeyValueTable
RiskTimeline
ResponsiveStackedChart
ResponsiveLineChart
StickyActionGroup
TrackingSheet
ProgressSheet
ReportSheet
BottomAskBar
WarningDefaultCopilotView
ToastRegion
LoadingState
EmptyState
NoResultsState
ErrorState
```

### 9.2 原型到 React 的转换约束

- 原型内的 `DATA` 对象应拆为模块级类型和 Mock 数据
- 原型内的单文件 `render*` 函数应拆为页面和组件
- 原型 Hash 解析应改用现有 React Router / HashRouter
- 原型事件委托应改为 React 事件
- 原型本地状态可转换为 URL Query、页面状态或模块 Store
- 不复制原型中的大段 innerHTML 字符串
- 不把原型 `index.html` 作为 iframe 或静态页面路由

### 9.3 现有公共组件复用判断

| 现有组件 / 能力 | 结论 | 复用条件 |
|---|---|---|
| `AppShell` | 可复用 | 保持430px移动端壳和纵向滚动 |
| 全局 tokens | 可复用 | 值和语义符合本规范 |
| `PageHeader` | 可复用或扩展 | 标题真实居中、sticky、分享可用 |
| `BottomAskBar` | 复用交互基线 | 样式、底部预留和遮挡符合规范 |
| `GlobalCopilotProvider` | 复用打开/关闭基线 | 为本模块提供结构化事实回答 renderer |
| `BottomSheet` | 扩展后复用 | 增加滚动锁、焦点管理、sticky footer |
| `TabBar` | 不直接用于信用风险三级Tab | 现有胶囊样式不匹配 |
| `PillTag` | 可复用基础 | 语义 variant 必须明确 |
| `MetricCard` | 评估，不强行复用 | 结构需符合原型 |
| `RiskCard` | 不建议复用 | 对象和布局不匹配 |
| `AIInsightCard` | 不复用 | 本模块无页面级AI摘要 |

### 9.4 关键组件状态

所有实际组件至少支持：

- default
- active / selected
- disabled
- loading
- empty
- error
- long-content
- zero
- unavailable

### 9.5 FilterSheet

- 打开时从已应用条件复制 draft
- 关闭 / 遮罩 / Esc：丢弃 draft
- 应用：提交并关闭
- 重置：恢复页面默认，但仍需应用
- 应用后更新 URL Query
- 所有筛选必须真实改变结果

### 9.6 TrackingSheet

必填：

- 责任人
- 截止日期

默认：

- 跟踪主题预填
- 责任成员公司预填
- 频率每周

行为：

- 未完成必填时确认禁用
- 提交中防重复
- 成功进入跟踪详情
- 失败保留输入并可重试
- 不改变风险状态

### 9.7 ReportSheet

- 至少选择一项包含内容
- 未选择时提交禁用
- 摘要只使用已确认事实
- 成功关闭并 Toast
- 失败保留选择

### 9.8 CopilotPanel

支持：

- loading
- structured fact response
- error
- no data
- follow-up

不得渲染：

- 通用风险传导链
- 主要影响对象模板
- 推荐动作模板
- 预测或处置建议

---

## 10. Status Semantics

禁止单一 `status` 字段。

### 10.1 风险等级 `RiskLevel`

```ts
type RiskLevel = "normal" | "level1" | "level2" | "major";
```

| 值 | 文案 | 颜色 | 说明 |
|---|---|---|---|
| `normal` | 正常 | 中性 / 绿色 | 未进入预警或出险 |
| `level1` | 一级预警 | 琥珀 | 较低预警等级 |
| `level2` | 二级预警 | 橙色 | 中等级预警 |
| `major` | 重大预警 | 红橙 | 最高预警等级 |

出险不是第四级预警。

### 10.2 风险趋势 `RiskTrend`

```ts
type RiskTrend = "increasing" | "decreasing" | "stable" | "new";
```

- increasing：危险色 + 上箭头
- decreasing：绿色 + 下箭头
- stable：中性 + 横线
- new：品牌橙 + 新增

绿色只表示规模下降，不表示客户已正常。

### 10.3 预警状态 `WarningStatus`

```ts
type WarningStatus = "none" | "active" | "released" | "historical";
```

迁移类型独立：

```ts
type WarningTransitionType =
  | "entered"
  | "upgraded"
  | "downgraded"
  | "released"
  | "reentered"
  | "convertedToDefault";
```

### 10.4 出险状态 `DefaultStatus`

```ts
type DefaultStatus = "none" | "defaulted" | "historical";
```

当前出险与当前预警互斥。

### 10.5 限额状态 `LimitStatus`

```ts
type LimitStatus = "normal" | "warning" | "exceeded";
```

本模块当前不显示，但全局模型不得与风险等级合并。

### 10.6 管理策略 `ManagementStrategy`

```ts
type ManagementStrategy =
  | "monitorOnly"
  | "keyTracking"
  | "includeInReport";
```

这是动作选择，不是风险状态。

### 10.7 处置状态 `DispositionStatus`

当前版本未确认正式处置状态机：

```ts
type DispositionStatus = "notProvided";
```

默认不渲染。不得自行增加“待处置、处置中、已结案”。

### 10.8 跟踪状态和优先级

```ts
type TrackingStatus = "notTracking" | "creationPending" | "tracking";
type TrackingPriority = "normal" | "key";
```

“跟踪中”不等于“处置中”；“重点跟踪”不等于风险等级。

---

## 11. Data Contract

### 11.1 数据原则

- 新模块可彻底重建数据模型
- 页面组件只消费明确 ViewModel
- 原始实体、聚合指标、格式化和 UI 状态分离
- 已确认、派生和演示数据必须标记
- 不为兼容旧页面保留不合适字段

### 11.2 数据来源

```ts
type DataProvenance = "confirmed" | "derived" | "demo";

interface DataMeta {
  provenance: DataProvenance;
  sourceRef?: string;
  asOfDate?: string;
  note?: string;
}
```

### 11.3 金额和比例

```ts
interface MoneyAmount {
  value: number;
  currency: "CNY";
  displayUnit: "亿元";
}

interface PercentageValue {
  value: number;
  precision: 2;
}
```

### 11.4 风险状态

```ts
type RiskState =
  | {
      stateType: "normal";
      riskLevel: "normal";
      warningStatus: "none";
      defaultStatus: "none";
    }
  | {
      stateType: "warning";
      riskLevel: "level1" | "level2" | "major";
      warningStatus: "active";
      defaultStatus: "none";
    }
  | {
      stateType: "default";
      riskLevel: null;
      warningStatus: "none";
      defaultStatus: "defaulted";
    };
```

### 11.5 核心实体

```ts
interface MemberCompany {
  id: string;
  name: string;
  shortName: string;
  active: boolean;
  meta: DataMeta;
}

interface CorporateGroup {
  id: string;
  name: string;
  meta: DataMeta;
}

interface CorporateCustomer {
  id: string;
  legalName: string;
  groupId?: string;
  currentHighestState: RiskState;
  meta: DataMeta;
}

interface RiskAsset {
  id: string;
  customerId: string;
  memberCompanyId: string;
  assetName: string;
  businessType?: string;
  portfolioName?: string | null;
  fundingSource?: string | null;
  amount: MoneyAmount;
  currentState: RiskState;
  disbursementDate?: string;
  maturityDate?: string;
  guarantorNames: string[];
  warningSignalIds: string[];
  defaultEventId?: string;
  stateTransitionIds: string[];
  meta: DataMeta;
}

interface WarningSignal {
  id: string;
  assetId: string;
  signalDate: string;
  reasonText?: string | null;
  evidenceItems: WarningEvidence[];
  meta: DataMeta;
}

interface WarningEvidence {
  id: string;
  label: string;
  value?: string;
  source?: string;
  occurredAt?: string;
}

interface RiskStateTransition {
  id: string;
  assetId: string;
  occurredAt: string;
  fromState?: RiskState;
  toState: RiskState;
  transitionType?: WarningTransitionType;
  amountAtTransition: MoneyAmount;
  description?: string;
  meta: DataMeta;
}

interface DefaultEvent {
  id: string;
  assetId: string;
  defaultDate: string;
  category: string;
  reason: string;
  amount: MoneyAmount;
  maturityDate?: string;
  overdueDaysAtRecognition?: number;
  meta: DataMeta;
}
```

### 11.6 聚合指标

```ts
interface WarningGradeMetric {
  level: "major" | "level2" | "level1";
  amount: MoneyAmount;
  share: PercentageValue;
  changeFromPrevious: MoneyAmount;
  trend: RiskTrend;
  meta: DataMeta;
}

interface NewRiskMetric {
  type: "majorWarning" | "default";
  period: "today" | "month";
  amount: MoneyAmount;
  corporateCustomerCount: number;
  asOfDate: string;
  meta: DataMeta;
}

interface WarningDefaultSnapshot {
  asOfDate: string;
  warningAssetAmount: MoneyAmount;
  warningCustomerCount: number;
  defaultAssetAmount: MoneyAmount;
  defaultCustomerCount: number;
  warningGrades: WarningGradeMetric[];
  newMetrics: NewRiskMetric[];
  meta: DataMeta;
}
```

### 11.7 跟踪和报告

```ts
interface TrackingCase {
  id: string;
  subject: string;
  linkedCustomerId: string;
  linkedAssetId: string;
  memberCompanyId: string;
  priority: TrackingPriority;
  status: TrackingStatus;
  ownerName?: string;
  ownerDepartment?: string;
  dueDate?: string;
  frequency?: "daily" | "weekly" | "monthly";
  latestUpdateAt?: string;
  recordIds: string[];
  meta: DataMeta;
}

interface TrackingRecord {
  id: string;
  trackingCaseId: string;
  occurredAt: string;
  type: "created" | "progressUpdated" | "riskEvent";
  title: string;
  content?: string;
  author?: string;
  meta: DataMeta;
}

interface ReportInclusionDraft {
  reportId: string;
  linkedCustomerId: string;
  linkedAssetId: string;
  trackingCaseId?: string;
  includeRiskFacts: boolean;
  includeAssetFields: boolean;
  includeTrackingProgress: boolean;
  summaryPreview: string;
}
```

### 11.8 页面和弹层状态

```ts
interface RiskListQueryState {
  search: string;
  period: "today" | "month";
  memberCompanyId?: string;
  riskLevel?: "major" | "level2" | "level1";
  defaultCategory?: string;
  sort: "amountDesc" | "dateDesc";
}

type WarningDefaultSheet =
  | "metrics"
  | "filter"
  | "member"
  | "tracking"
  | "progress"
  | "report";
```

URL Query 是可恢复页面状态；弹层内未应用的 draft 不写入 URL。

### 11.9 已确认数据

- 数据日期：2026-06-24
- 本月新增重大预警：0.60亿元、5户
- 本月新增出险：0.83亿元、7户
- 本日新增重大预警：0.00亿元、0户
- 本日新增出险：0.05亿元、1户
- 预警资产：3,342亿元、964户
- 出险资产：2,967亿元、731户
- 重大：1,162亿元、34.77%、较上月末-9亿元
- 二级：1,320亿元、39.49%、较上月末-3亿元
- 一级：860亿元、25.74%、较上月末-4亿元
- 全部预警净变化：-16亿元
- 上月末预警资产：3,358亿元，派生

常宁市尚宇高级中学有限公司：

- 所属集团：湖南尚宇教育投资集团
- 成员公司：医保科技
- 预警日期：2026-06-23
- 规模：0.25亿元
- 状态：重大预警
- 原因：暂无可用触发原因明细

欧龙汽车贸易集团有限公司：

- 所属集团：欧龙汽车贸易集团
- 成员公司：租赁
- 预警日期：2026-06-15
- 规模：0.24亿元

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
- 担保方：广西百色开发投资集团有限公司；广西百色城市建设投资发展集团有限公司
- 出险类别：逾期（本息实质逾期）
- 出险日期：2026-06-01
- 出险认定时逾期：9天，派生

泰州盈润光伏科技有限公司：

- 所属集团：江苏长明新能源电力科技集团
- 成员公司：租赁
- 出险日期：2026-06-01
- 出险规模：0.13亿元

### 11.10 演示数据

必须标记：

- 出险历史趋势序列
- 跟踪责任人
- 跟踪截止日期
- 跟踪进展和更新时间
- 报告名称和加入报告流程状态

### 11.11 禁止开发者推断

不得自行补充：

- 未提供的预警原因
- 未提供的历史等级
- 正式处置状态
- 预计损失
- 担保覆盖率
- AI预测
- AI处置建议
- 未确认客户和金额
- 未确认成员公司排名
- 同一资产重复进入重大预警的统计去重规则
- 出险后的结案状态
- 将“—”解释为0

---

## 12. Chart Specifications

### 12.1 预警等级结构条

目的：快速表达重大、二级、一级占全部预警资产的比例。

- 高度12px
- 圆角999px
- 无段间空隙
- 下方显示金额和百分比
- 重大、二级、一级颜色与状态语义一致
- 百分比总和误差大于0.02个百分点时显示数据异常，不自行修改

### 12.2 上月末与当前结构对比

输入：

- 上月末：重大1171、二级1323、一级864，合计3358
- 当前：重大1162、二级1320、一级860，合计3342

规格：

- 两根垂直堆叠柱
- 柱宽54px
- 柱间距54px
- 绘图区150px
- 卡片最小220px
- X轴显示日期和合计
- 单位：亿元
- SVG响应式 `viewBox`
- 无数据时显示文本空状态

### 12.3 出险趋势

- 当前值2,967亿元是确认数据
- 历史序列为演示数据
- 必须显示“趋势演示”
- 单折线
- 绘图区110px
- 卡片最小200px
- 空数据只显示当前值和“暂无历史趋势”
- 单点数据不得伪造折线
- 375px不裁切，430px不过度拉伸

### 12.4 图表无障碍

每张图必须：

- 有 `aria-label`
- 有文本摘要
- 有屏幕阅读器可读数据
- 不只用颜色区分

---

## 13. Interaction Rules

### 13.1 点击

- 所有可点击视觉元素必须有真实行为
- 整卡可点击时不要只让箭头点击
- “全部、查看口径、查看完整字段、更新、＋、分享”不得是假按钮

### 13.2 返回

- 优先浏览器历史
- 无历史时回父级路由
- 返回列表保留 Query 和滚动位置
- 关闭弹层不离开宿主页面

### 13.3 Tab 与周期

- 信用风险三级 Tab 改变路由
- 本日 / 本月改变 Query 或页面状态
- 切换不重置无关条件

### 13.4 搜索、筛选和排序

- 搜索250ms防抖
- 搜索词写入 Query
- 筛选 draft 和 applied 分离
- 排序真实改变顺序
- 无结果显示条件和重置入口

### 13.5 展开

- 风险原因超过4行显示“展开全部”
- 状态记录“全部”显示完整时间线
- 查看完整字段平滑滚动到详情字段区，不新增重复页面

### 13.6 弹层

关闭方式：

- 关闭按钮
- 遮罩
- Esc
- 浏览器返回

有未保存表单时提示放弃。

### 13.7 跟踪创建

```text
打开弹层
→ 预填主题和成员公司
→ 选择责任人
→ 选择截止日期
→ 选择频率
→ 确认
→ 提交中
→ 成功进入跟踪详情
```

失败保留输入。

### 13.8 加入报告

```text
打开弹层
→ 选择目标报告
→ 勾选内容
→ 查看事实摘要
→ 加入草稿
→ 成功关闭并Toast
```

### 13.9 分享

- 优先 Web Share API
- 不支持时复制当前 Hash URL
- 显示成功或失败反馈

---

## 14. AI Presentation

### 14.1 确认能力

仅实现：

- 底部全局 AI 输入
- 全局 Copilot
- 基于当前页面和筛选的结构化事实查询
- 继续追问

### 14.2 输入上下文

可使用：

- 当前路由
- 当前页面
- 当前周期
- 当前成员公司
- 当前法人客户
- 当前风险资产
- 数据日期
- 已确认结构化指标

### 14.3 输出结构

1. 回答类型
2. 业务事实
3. 数据日期
4. 重点事项
5. AI推断
6. 边界说明

当前示例：

- 新增重大预警0.60亿元、5户
- 新增出险0.83亿元、7户
- 数据截至2026-06-24
- 广西百色出险0.47亿元
- 常宁尚宇重大预警0.25亿元
- AI推断：无

### 14.4 不允许

- 页面级 AI 摘要
- AI 原因补全
- AI 出险预测
- AI 风险等级判断
- AI 处置建议
- AI 自动创建跟踪
- AI 自动加入报告

---

## 15. Responsive and Overflow Rules

### 15.1 视口规则

375 × 812：

- 页面边距14px
- 三级卡 gap 6px或8px
- 等级数字可20px
- 弹层最大74dvh
- 页面可正常滚动

390 × 844：基准。

393 × 852：与390保持同布局，不因3px改变断点。

414 × 896 / 430 × 932：

- 页面边距18px
- 仍保持单列移动布局
- 字号不放大
- 图表适应容器

### 15.2 长内容压力

必须测试：

- 30个以上中文字符的客户名称
- 超长所属集团
- `12,345.67亿元`
- `123.45%`
- `12,345户`
- 4到8行风险原因
- 多个成员公司标签
- 多个担保方

要求：

- 无横向页面溢出
- 金额仍可见
- 标签内部不换行
- 卡片自然增高
- 后续内容不覆盖
- 图表不裁切

---

## 16. Accessibility

- 最小点击区44 × 44px
- 正文对比度至少4.5:1
- 大字至少3:1
- 可见 `:focus-visible`
- 图标按钮有 `aria-label`
- Tab 有 `role=tab` 和 `aria-selected`
- Dialog 有 `role=dialog`、`aria-modal=true`
- 弹层焦点锁定，关闭后返回触发控件
- 不只依赖颜色表达状态
- Toast 使用 `aria-live`
- 支持 `prefers-reduced-motion`
- 图表有文本替代
- 键盘可完成筛选、关闭、提交和返回

---

## 17. Acceptance Criteria

### 17.1 总览

必须显示：

- 本月0.60亿元、5户重大预警
- 本月0.83亿元、7户出险
- 3,342亿元、964户预警
- 2,967亿元、731户出险
- 三级预警金额、占比和变化
- 4个新增客户预览
- 底部AI输入

必须可用：

- 返回、分享、Tab、周期、口径、专题下钻、客户下钻、Copilot

不得：

- 显示“续页”
- 底部输入遮挡内容
- 增加AI摘要

### 17.2 预警总览和迁移

- 所有金额、占比和净变化一致
- 结构图不溢出
- 成员公司切换可用
- 月份和排序可用
- 不虚构迁移拆解

### 17.3 列表和筛选

- 搜索、筛选和排序真实工作
- 筛选弹层 draft 与 applied 分离
- 返回保留条件
- 长客户名称不挤压金额
- 无结果和错误状态可恢复

### 17.4 预警详情

- 常宁尚宇0.25亿元、医保科技、2026-06-23一致
- 原因缺失明确显示
- 不生成虚构历史

### 17.5 出险详情

必须完整显示：

- 广西百色0.47亿元
- 租赁
- 非标投资
- 一方资金
- 2022-05-23放款
- 2026-05-23到期
- 2026-06-01出险
- 逾期9天
- 两家担保方
- 投资组合`—`

### 17.6 跟踪和报告

- 跟踪创建有校验和失败状态
- 创建不改变风险状态
- 更新进展真实可用
- 报告勾选和提交真实可用
- 演示数据明确标记

### 17.7 Copilot

- 数字和数据日期准确
- AI推断为无
- 不出现预测和处置建议
- 关闭恢复原页面

### 17.8 浏览器完成标准

- 375、390、393、414、430px均无横向溢出
- 无文字重叠、乱码、裁切和遮挡
- 图表完整
- 弹层可滚动、关闭、聚焦
- HashRouter刷新可恢复
- 控制台无本任务引入的错误和警告
- 所有主要按钮有真实行为
- `npm run build`成功

---

## 18. Prototype-to-Production Implementation Notes

### 18.1 Codex 必须读取原型，但不得复制单文件架构

正确做法：

- 打开原型每个 Hash
- 记录页面内容和操作
- 对照 CSS tokens 和稳定组件规则
- 将数据、页面、组件、路由和弹层拆入 React 模块
- 使用生产路由、状态和公共组件

错误做法：

- 将 `prototype/index.html` 放进 `public/` 并 iframe
- 将原型 JS 原封不动复制进 React `useEffect`
- 通过 `dangerouslySetInnerHTML` 渲染原型
- 将生产页面做成单个巨大组件
- 修改参考原型以掩盖生产差异

### 18.2 参考资产不可在开发任务中被静默修改

Codex 默认只读：

- `prototype/index.html`
- `prototype/screenshots/`
- 本规范和两份 Prompt

如发现参考资产自身与已确认业务冲突，应记录问题并请求确认，不得直接修改参考文件作为“修复”。
