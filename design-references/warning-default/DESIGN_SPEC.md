<!-- DESIGN_SPEC.md -->

# 预警出险模块 Design Specification

- 文档版本：1.0
- 设计基线：已确认的“预警出险”系统性产品设计与 `design-references/warning-default/` 高保真 UI
- 主要视口：390 × 844
- 适用仓库：`patshin/risk-assistant-demo`
- 实施原则：忠实实现已确认内容、层级、状态和流程；修正参考图中的排版漂移，不复制生成图片中的视觉错误

---

## 1. Document Scope

### 1.1 本规范覆盖的模块

本规范覆盖信用风险模块下的“预警与出险”完整移动端体验，包括：

- 预警出险模块入口与总览
- 新增重大预警规模与新增出险规模
- 预警资产存量、等级结构与迁移
- 出险资产存量与变化趋势
- 重大预警法人客户列表
- 出险法人客户列表
- 搜索、筛选、排序与成员公司切换
- 法人客户风险概览
- 单笔预警资产详情
- 单笔出险资产详情
- 风险状态变化时间线
- 加入重点跟踪
- 重点跟踪详情
- 加入风险报告
- 全局 Copilot 结构化查询
- 返回、分享、弹层、操作反馈、加载、空状态与错误状态

### 1.2 目标设备与视口

主要设计视口：

- 390 × 844

必须稳定支持：

- 375 × 812
- 390 × 844
- 393 × 852
- 414 × 896
- 430 × 932

本模块是移动端 WebApp，不得按桌面看板缩放实现。

### 1.3 UI 参考文件夹

所有高保真 UI、说明文件与本规范位于：

`design-references/warning-default/`

开发前必须读取该目录内的全部文件，不得只查看第一张总览图。

### 1.4 业务与设计事实来源

事实来源按优先级为：

1. 已确认的新高保真 UI
2. 本窗口中最后确认的系统性产品设计
3. 已确认的业务字段、数据关系和状态规则
4. 本设计规范
5. 项目现有全局应用外壳、设计 tokens 与基础交互
6. 旧预警出险模块代码

### 1.5 本规范不覆盖的内容

本规范不重新设计或扩展：

- 完整客户监控模块
- 完整风险处置审批流程
- 核销、损失确认、结案等出险处置状态机
- AI 风险预测
- AI 自动确定预警等级
- AI 自动制定处置方案
- 页面级 AI 摘要卡片
- 跨成员公司的数据权限体系
- 预警规则引擎后台
- 预警信号采集后台
- 报告模块的完整编辑器
- 风险跟踪模块的完整任务中心

本模块只实现已确认的轻量跟踪和报告衔接。

---

## 2. Source-of-Truth Priority

实现冲突时严格使用以下优先级：

1. 已确认的新 UI 稿和系统性设计
2. 已确认的业务字段、数值、口径和产品动线
3. 本设计规范
4. 项目现有全局视觉语言
5. 旧模块代码

### 2.1 旧实现不构成兼容约束

下列旧内容均可被替换：

- 旧页面结构
- 旧路由内部组织
- 旧组件边界
- 旧数据类型
- 旧 Mock 数据结构
- 旧局部状态管理
- 旧 CSS 类名
- 旧预警与出险页面布局
- 为旧页面保留的兼容分支

### 2.2 禁止为了复用旧代码妥协新设计

不得因为已有组件存在而：

- 将新增事件、法人客户和风险资产混成同一层级
- 将风险等级、预警状态和出险状态合并成一个 `status`
- 保留不符合新 UI 的横向长 Tab
- 把新页面塞入旧大组件
- 删除新 UI 中的已确认字段
- 使用旧 Mock 中不一致的客户或金额数据
- 把全局 Copilot 的通用风险建议强行放入本模块
- 将跟踪状态错误地当成处置状态

### 2.3 参考图不是像素级错误源

参考图中的以下问题不得复制：

- 字体基线漂移
- 相同层级字号不一致
- 卡片因文案长度出现无规则高度差
- 标签意外换行
- 图表标签重叠
- 底部输入遮挡最后一项
- 页面间按钮高度变化
- 长页面截图中的“续页 2/2”等设计说明标记

验收标准是：

> 内容与动线忠实、视觉语义一致、浏览器布局稳定、状态可解释、交互可完成。

---

## 3. Screen Inventory

### 3.1 资产命名规则

- `WD-xx`：主页面
- `WD-xxA / WD-xxB`：同一长页面的不同滚动位置
- `WD-xx-S1`：该页面上的弹层或交互状态
- `WD-AI-xx`：全局 Copilot 状态

“滚动续页”不是独立路由，不得在产品页面显示“续页 2/2”。

### 3.2 UI 资产清单

| ID | 文件名 | 页面 | 路由或流程节点 | 类型 | 上一页 | 下一页 | 关键业务内容与交互 |
|---|---|---|---|---|---|---|---|
| WD-01A | `UI-01.png` | 预警出险总览首屏 | `/credit/warning` | 主页面 | 信用风险入口 | WD-01B、WD-02、WD-07 | 信用风险三级导航；本日/本月切换；新增重大预警0.60亿元、5户；新增出险0.83亿元、7户；预警资产3,342亿元、964户；出险资产2,967亿元、731户；三级预警较上月变化 |
| WD-01B | `UI-02.png` | 预警出险总览续页 | `/credit/warning` 同页滚动 | 滚动续页 | WD-01A | WD-02、WD-04、WD-07、WD-08 | 预警资产等级结构；本月新增重大预警客户预览；本月新增出险客户预览；进入列表或专题页 |
| WD-02 | `UI-03.png` | 预警资产总览 | `/credit/warning/prewarnings` | 主页面 | WD-01 | WD-03、WD-04 | 预警资产3,342亿元、964户；重大、二级、一级结构；上月末与当前结构对比；成员公司筛选 |
| WD-03 | `UI-04.png` | 预警迁移 | `/credit/warning/prewarnings/migrations` | 主页面 | WD-02 | WD-04 | 月份和成员公司筛选；进入重大预警0.60亿元；新增出险0.83亿元；重大预警净变化-9亿元；全部预警净变化-16亿元；进入重大预警客户列表 |
| WD-04 | `UI-05.png` | 重大预警客户 | `/credit/warning/prewarnings/customers` | 主页面 | WD-01B、WD-03 | WD-04-S1、WD-05 | 规模0.60亿元、法人客户5户；搜索；时间、成员公司、排序条件；客户卡片 |
| WD-04-S1 | `UI-06.png` | 重大预警筛选与排序 | `/credit/warning/prewarnings/customers?sheet=filter` | 弹层 | WD-04 | WD-04 | 成员公司、时间范围和排序；重置；应用筛选 |
| WD-05 | `UI-07.png` | 法人客户风险概览—重大预警 | `/credit/warning/customers/changning-shangyu` | 主页面 | WD-04 | WD-06、WD-10-S1 | 法人客户、所属集团、成员公司、重大预警资产0.25亿元；风险资产卡；状态记录；加入跟踪；查看资产 |
| WD-06 | `UI-08.png` | 预警资产详情 | `/credit/warning/assets/changning-shangyu-20260623` | 主页面 | WD-05 | WD-10-S1、WD-11-S1 | 重大预警资产规模0.25亿元；当前状态、预警日期、成员公司、所属集团；无可用预警原因；状态变化；加入报告、加入跟踪 |
| WD-07 | `UI-09.png` | 出险资产总览 | `/credit/warning/defaults` | 主页面 | WD-01 | WD-08 | 出险资产2,967亿元、731户；本月新增0.83亿元、7户；本日新增0.05亿元、1户；成员公司筛选；趋势演示 |
| WD-08 | `UI-10.png` | 出险客户 | `/credit/warning/defaults/customers` | 主页面 | WD-01B、WD-07 | WD-08-S1、WD-09 | 规模0.83亿元、法人客户7户；搜索；筛选；出险客户卡片 |
| WD-08-S1 | `UI-11.png` | 出险筛选与排序 | `/credit/warning/defaults/customers?sheet=filter` | 弹层 | WD-08 | WD-08 | 成员公司、出险日期、出险类别、排序；重置；应用筛选 |
| WD-09 | `UI-12.png` | 法人客户风险概览—出险 | `/credit/warning/customers/guangxi-baise` | 主页面 | WD-08 | WD-10A、WD-10-S1 | 法人客户、所属集团、出险规模0.47亿元、租赁；已出险、逾期、本息实质逾期；关键日期；风险资产卡 |
| WD-10A | `UI-13.png` | 出险资产详情首屏 | `/credit/warning/assets/guangxi-baise-047` | 主页面 | WD-09 | WD-10B、WD-10-S1 | 出险规模0.47亿元；出险日期；出险类别；逾期9天；到期日；业务类型；项目名称；资金来源 |
| WD-10B | `UI-13-2.png` | 出险资产详情续页 | `/credit/warning/assets/guangxi-baise-047` 同页滚动 | 滚动续页 | WD-10A | WD-10-S1、WD-11-S1 | 投资组合、放款日、到期日、担保方、出险类别、出险日期、出险规模；关键时间线；报告与跟踪入口 |
| WD-10-S1 | `UI-14.png` | 加入重点跟踪 | `/credit/warning/assets/guangxi-baise-047?sheet=tracking` | 弹层 | WD-10 | WD-11 | 跟踪主题、责任成员公司、责任人、截止日期、跟踪频率；校验；确认加入 |
| WD-11 | `UI-15.png` | 重点跟踪详情 | `/watch/tracking/guangxi-baise-default` | 交互状态/主页面 | WD-10-S1 | WD-11-S1、WD-10 | 出险、跟踪中、重点跟踪；责任人、期限、频率、最新更新；最新进展；跟踪记录；查看原资产；加入报告 |
| WD-11-S1 | `UI-16.png` | 加入风险报告 | `/watch/tracking/guangxi-baise-default?sheet=report` | 弹层/操作反馈 | WD-11 | WD-11、WD-AI-01 | 目标报告、包含内容、事实摘要预览；加入报告草稿；成功反馈 |
| WD-AI-01 | `UI-17.png` | 全局 Copilot 结构化查询 | 宿主路由 `/credit/warning` 上的全局弹层 | 交互状态 | 任一支持 Copilot 页面 | 返回原页面 | 查询本月新增重大预警和出险规模；只返回结构化业务事实、重点新增事项和“无AI推断”说明 |

### 3.3 路由兼容建议

推荐使用以上 canonical routes。

旧入口 `/credit?tab=warning` 可以：

- 重定向到 `/credit/warning`；或
- 作为 `/credit/warning` 的入口别名。

不得要求新模块继续受旧 `CreditRiskPage` 内部组件结构约束。

---

## 4. User Flow

### 4.1 完整主流程

    信用风险入口
    → 预警出险总览
    → 预警资产总览 / 出险资产总览
    → 预警迁移 / 风险客户列表
    → 法人客户风险概览
    → 风险资产详情
    → 加入重点跟踪
    → 重点跟踪详情
    → 加入风险报告
    → 返回总览或通过全局 Copilot 查询

### 4.2 重大预警流程

    /credit/warning
    → /credit/warning/prewarnings
    → /credit/warning/prewarnings/migrations
    → /credit/warning/prewarnings/customers
    → /credit/warning/customers/:customerId
    → /credit/warning/assets/:assetId

进入条件：

- 用户点击预警资产、预警等级结构、迁移明细或新增重大预警客户。

用户目的：

- 理解预警规模、等级结构和本月变化；
- 找到贡献新增规模的法人客户；
- 查看具体风险资产与状态变化。

主要操作：

- 切换月份或成员公司；
- 搜索客户；
- 筛选和排序；
- 查看客户；
- 查看资产；
- 加入跟踪或报告。

返回行为：

- 资产详情返回客户概览；
- 客户概览返回原列表；
- 列表返回原总览或迁移页；
- 返回后保留搜索、筛选、排序和列表滚动位置。

### 4.3 出险流程

    /credit/warning
    → /credit/warning/defaults
    → /credit/warning/defaults/customers
    → /credit/warning/customers/:customerId
    → /credit/warning/assets/:assetId
    → ?sheet=tracking
    → /watch/tracking/:trackingId
    → ?sheet=report

进入条件：

- 用户点击出险资产、本月新增出险或具体出险客户。

用户目的：

- 判断出险规模和对象；
- 查看出险资产的业务事实；
- 根据需要加入轻量跟踪；
- 将确认事实加入风险报告。

主要操作：

- 切换本日/本月；
- 筛选成员公司、日期和出险类别；
- 查看客户与资产；
- 创建跟踪；
- 更新跟踪；
- 加入报告。

返回行为：

- 关闭弹层回到触发页面；
- 跟踪详情返回原资产；
- 报告加入成功后保持在跟踪详情；
- 不丢失资产详情的滚动位置。

### 4.4 全局 Copilot 流程

    任一支持页面
    → 点击底部 AI 输入
    → 打开 Copilot
    → 输入或选择结构化查询
    → 返回基于当前页面数据的事实结果
    → 继续追问或关闭
    → 返回原页面原滚动位置

需要保留：

- 当前路由
- 当前页面上下文
- 当前成员公司和时间筛选
- 当前风险对象
- 当前滚动位置
- Copilot 会话内容

---

## 5. Information Architecture

## 5.1 WD-01 预警出险总览

### 页面目标

快速回答：

- 本月新增多少重大预警规模；
- 本月新增多少出险规模；
- 当前预警与出险存量多大；
- 预警等级结构如何；
- 哪些客户贡献了主要新增。

### 首屏核心问题

> 本期新增风险规模有多大，当前风险存量和等级结构是什么？

### 从上到下区块

1. `PageHeader`
   - 标题：信用风险
   - 左：返回
   - 右：分享

2. `CreditRiskTabs`
   - 大户风险
   - 集中度风险
   - 预警与出险，当前激活

3. `新增风险规模`
   - 本日/本月切换
   - 新增重大预警：0.60亿元，涉及5户法人客户
   - 新增出险：0.83亿元，涉及7户法人客户

4. 数据口径行
   - 数据截至2026-06-24
   - 规模优先 · 客户去重
   - “查看口径”打开指标口径弹层

5. `存量风险`
   - 预警资产3,342亿元，964户
   - 出险资产2,967亿元，731户

6. `本月主要变化`
   - 重大预警1,162亿元，较上月末下降9亿元
   - 二级预警1,320亿元，较上月末下降3亿元
   - 一级预警860亿元，较上月末下降4亿元

7. `预警资产结构`
   - 重大34.77%
   - 二级39.49%
   - 一级25.74%
   - 点击进入预警总览

8. `本月新增重大预警`
   - 汇总：5户、0.60亿元
   - 常宁市尚宇高级中学有限公司，0.25亿元
   - 欧龙汽车贸易集团有限公司，0.24亿元

9. `本月新增出险`
   - 汇总：7户、0.83亿元
   - 广西百色试验区发展集团有限公司，0.47亿元
   - 泰州盈润光伏科技有限公司，0.13亿元

10. `BottomAskBar`

### 主要操作

- 本日/本月切换
- 进入预警资产
- 进入出险资产
- 进入重大预警客户列表
- 进入出险客户列表
- 打开口径说明
- 打开全局 Copilot

### 折叠与展开

- WD-01A 与 WD-01B 是同一页面滚动内容。
- 不显示“续页2/2”。
- 顶部信用风险三级导航只在页面上部显示。
- 页面向下滚动后，顶部 Header 可保持 sticky，但不得重复出现第二个页面标题。

---

## 5.2 WD-02 预警资产总览

### 页面目标

回答当前预警资产规模、客户数、等级结构和成员公司分布。

### 区块顺序

1. PageHeader：预警资产
2. 汇总卡
   - 集团汇总
   - 数据截至2026-06-24
   - 预警资产3,342亿元
   - 预警客户964户
3. 预警等级结构
   - 重大1,162亿元，34.77%，较上月末-9亿元
   - 二级1,320亿元，39.49%，较上月末-3亿元
   - 一级860亿元，25.74%，较上月末-4亿元
4. 近期结构
   - 上月末3,358亿元
   - 当前3,342亿元
   - 按重大、二级、一级堆叠
5. 成员公司筛选
   - 集团汇总
   - 银行
   - 租赁
   - 寿险
   - 全部成员公司
6. BottomAskBar

### 下钻

- “查看迁移明细”进入WD-03。
- 点击等级卡进入对应过滤后的客户列表。
- 点击成员公司后更新本页数据，不新开页面。

---

## 5.3 WD-03 预警迁移

### 页面目标

解释本月新增重大预警和预警存量净变化。

### 区块顺序

1. PageHeader：预警迁移
2. 月份选择：2026年6月
3. 成员公司选择：集团汇总
4. 状态变化概览
   - 本月进入重大预警0.60亿元、5户
   - 本月新增出险0.83亿元、7户
   - 重大预警净变化-9亿元
   - 全部预警净变化-16亿元
5. 口径说明
   - 预警支持升级、降级、解除和重新进入
   - 当前仅展示已提供的新增规模和等级净变化
   - 不允许前端自行推断完整迁移勾稽
6. 本月进入重大预警列表
7. BottomAskBar

### 交互

- 月份和成员公司选择器必须可用。
- 排序默认按规模从高到低。
- 点击客户进入WD-05。
- 如后端没有完整迁移原因，不显示虚构拆解。

---

## 5.4 WD-04 / WD-08 风险客户列表

### 页面目标

从风险规模下钻到法人客户。

### 统一结构

1. PageHeader
2. 汇总卡
   - 风险规模
   - 法人客户数
3. 搜索行
   - 搜索法人客户或所属集团
   - 筛选按钮
4. 快捷筛选
   - 时间范围
   - 成员公司
   - 排序
5. 客户列表
6. 列表进度或空状态
7. BottomAskBar

### 客户卡片字段

- 法人客户名称，最多2行
- 所属集团，最多1行
- 风险金额，右侧对齐
- 风险状态标签
- 成员公司标签
- 日期
- 整卡可点击

### 重大预警列表默认值

- 时间：本月新增
- 成员公司：全部
- 排序：规模从高到低

### 出险列表默认值

- 时间：本月
- 成员公司：全部
- 出险类别：全部
- 排序：规模从高到低

---

## 5.5 WD-05 / WD-09 法人客户风险概览

### 页面目标

汇总一个法人客户与当前预警或出险相关的风险事实和资产。

### 区块顺序

1. PageHeader：客户风险概览
2. 客户风险 Hero
   - 当前风险标签
   - 状态进入或认定日期
   - 法人客户名称
   - 所属集团
   - 当前风险金额
   - 平安成员公司
3. 风险判断或风险概况
   - 重大预警页面：风险资产和状态记录
   - 出险页面：结论、原因、出险类别、影响规模和关键日期
4. 风险资产
   - 风险资产数量
   - 资产名称
   - 资产状态
   - 金额
   - 成员公司
   - 日期
   - 加入跟踪
   - 查看资产详情
5. 状态记录或时间线
6. BottomAskBar

### 业务规则

- 法人客户按最高风险状态计数。
- 同一法人客户存在出险资产时，只计入出险客户数。
- 客户名下其他未出险资产仍按自身状态计入预警资产金额。
- 页面不得暗示客户名下全部资产均已出险。

---

## 5.6 WD-06 预警资产详情

### 页面目标

展示单笔重大预警资产的已确认事实，不虚构触发原因。

### 区块顺序

1. PageHeader：预警资产详情
2. 资产 Hero
   - 重大预警
   - 数据截至2026-06-24
   - 重大预警资产规模0.25亿元
   - 法人客户名称
3. 风险事实
   - 当前状态：重大预警
   - 预警日期：2026-06-23
   - 成员公司：医保科技
   - 所属集团：湖南尚宇教育投资集团
   - 预警原因：暂无可用触发原因明细
4. 状态变化
   - 2026-06-23进入重大预警
   - 此前迁移记录：当前未提供
5. 底部操作
   - 加入风险报告
   - 加入重点跟踪
6. BottomAskBar

### 禁止事项

- 不生成AI预警原因。
- 不推断该资产此前为一级或二级预警。
- 不显示“处置中”等未确认状态。

---

## 5.7 WD-07 出险资产总览

### 页面目标

回答当前出险存量、本期新增和变化趋势。

### 区块顺序

1. PageHeader：出险资产
2. 汇总 Hero
   - 集团汇总
   - 数据截至2026-06-24
   - 出险资产2,967亿元
   - 出险客户731户
3. 新增出险
   - 本日/本月
   - 本月新增规模0.83亿元
   - 涉及法人客户7户
   - 本日新增0.05亿元、1户
4. 成员公司筛选
5. 出险资产变化趋势
   - 当前规模2,967亿元
   - 历史趋势明确标记“趋势演示”
6. BottomAskBar

### 交互

- 点击新增规模或“查看明细”进入WD-08。
- 成员公司筛选更新本页，不触发页面重载。
- 演示趋势不得伪装为真实历史数据。

---

## 5.8 WD-10 出险资产详情

### 页面目标

完整展示单笔出险资产的业务事实、关键日期和时间线。

### 首屏顺序

1. PageHeader：出险资产详情
2. 出险 Hero
   - 出险
   - 出险日期2026-06-01
   - 出险规模0.47亿元
   - 法人客户名称
3. 关键风险事实
   - 出险类别：逾期（本息实质逾期）
   - 逾期时长：9天
   - 到期日：2026-05-23
   - 出险日期：2026-06-01
4. 业务信息
   - 成员公司：租赁
   - 业务类型：非标投资
   - 项目/产品名称：广西百色试验区发展集团有限公司
   - 资金来源：一方资金
5. 操作
   - 加入重点跟踪
   - 查看完整字段

### 续页顺序

1. 完整业务字段
   - 投资组合：—
   - 放款日：2022-05-23
   - 到期日：2026-05-23
   - 担保方名称：
     - 广西百色开发投资集团有限公司
     - 广西百色城市建设投资发展集团有限公司
   - 出险类别：逾期（本息实质逾期）
   - 出险日期：2026-06-01
   - 出险规模：0.47亿元
2. 关键时间线
   - 2022-05-23 放款
   - 2026-05-23 资产到期
   - 2026-06-01 出险认定
3. 操作
   - 加入风险报告
   - 加入重点跟踪
4. BottomAskBar

### 计算规则

`逾期时长9天`为：

`出险日期 2026-06-01 - 到期日 2026-05-23`

这是派生值，必须显示为业务计算结果，不得使用当前日期重新计算。

---

## 5.9 WD-10-S1 加入重点跟踪

### 页面目标

轻量连接风险跟踪，不修改风险状态。

### 字段

- 跟踪主题，默认预填
- 责任成员公司，默认预填且只读或可选择
- 责任人，必填
- 截止日期，必填
- 跟踪频率，默认每周

### 校验

- 责任人和截止日期未填写时，“确认加入”禁用。
- 创建跟踪不会改变预警或出险状态。
- 创建成功后进入WD-11并显示成功 Toast。

### 弹层操作

- 关闭
- 取消
- 确认加入

---

## 5.10 WD-11 重点跟踪详情

### 页面目标

查看轻量跟踪责任、期限和最新进展。

### 区块顺序

1. PageHeader：重点跟踪
2. 跟踪 Hero
   - 出险
   - 跟踪中
   - 已加入重点跟踪 Toast
   - 演示数据标签
   - 主题
   - 关联资产
   - 责任人
   - 截止日期
   - 跟踪频率
   - 最近更新
3. 最新进展
   - 进展标题
   - 进展正文
   - 来源和日期
   - 更新入口
4. 跟踪记录
   - 06-20 更新进展
   - 06-02 加入重点跟踪
   - 06-01 资产出险
5. 操作
   - 查看原资产
   - 加入风险报告

### 演示字段

以下内容必须标记为演示数据：

- 责任人：租赁风险管理部 · 李明
- 截止日期：2026-06-30
- 最近更新：2026-06-20
- 跟踪进展正文

---

## 5.11 WD-11-S1 加入风险报告

### 页面目标

将已确认事实和跟踪进展加入现有报告草稿。

### 内容

- 目标报告：2026年6月集团风险周报，演示流程
- 可选择包含：
  - 风险事实与出险规模
  - 完整资产字段
  - 重点跟踪进展
- 事实摘要预览：
  - 广西百色试验区发展集团有限公司0.47亿元非标投资资产于2026-06-01因本息实质逾期出险
- 取消
- 加入报告草稿

### 成功反馈

- 关闭弹层
- 在宿主页面显示“报告内容已准备”Toast
- 不自动跳转到报告编辑器
- 用户可后续通过报告模块查看草稿

---

## 5.12 WD-AI-01 全局 Copilot

### 页面目标

回答当前模块内的结构化事实查询。

### 当前示例查询

“本月新增重大预警和出险规模分别是多少？”

### 输出顺序

1. 用户问题
2. “基于当前页面结构化数据查询”
3. 业务事实
   - 新增重大预警0.60亿元，5户
   - 新增出险0.83亿元，7户
   - 数据截至2026-06-24
4. 已确认的重点新增事项
   - 广西百色试验区发展集团有限公司出险0.47亿元
   - 常宁市尚宇高级中学有限公司重大预警0.25亿元
5. 结论类型
   - AI推断：无
   - 本回答仅汇总已确认结构化事实
   - 不进行风险预测或处置建议
6. 继续追问输入

---

## 6. Design Tokens

## 6.1 可复用的项目全局 tokens

以下现有 token 与新 UI 一致，可直接复用：

| Token | 值 | 用途 |
|---|---:|---|
| `--color-bg` | `#fff7ec` | 页面主背景 |
| `--color-bg-soft` | `#fdf7ef` | 次级背景 |
| `--color-surface` | `#ffffff` | 强表面 |
| `--color-surface-warm` | `#fffcf7` | 暖白卡片 |
| `--color-orange` | `#ff6a00` | 主强调、主按钮 |
| `--color-orange-strong` | `#f97316` | 强调渐变 |
| `--color-orange-soft` | `#ffe8d2` | 强调浅底 |
| `--color-orange-softer` | `#fff0de` | 更浅强调底 |
| `--color-text` | `#1f1b16` | 主文字 |
| `--color-text-soft` | `#7a7168` | 次级文字 |
| `--color-text-muted` | `#9a8f84` | 辅助文字 |
| `--color-border` | `#f3e3d1` | 边框 |
| `--color-success` | `#719a4a` | 风险下降、跟踪中 |
| `--color-warning` | `#d58a16` | 一级预警 |
| `--color-danger` | `#e85c23` | 重大预警、风险上升 |
| `--shadow-soft` | `0 18px 48px rgba(150,92,34,.12)` | 浮层阴影 |
| `--shadow-card` | `0 12px 30px rgba(116,72,26,.08)` | 卡片阴影 |
| `--shadow-float` | `0 20px 54px rgba(73,45,16,.18)` | 弹层阴影 |
| `--radius-sm` | `12px` | 小控件 |
| `--radius-md` | `18px` | 输入框、小卡片 |
| `--radius-lg` | `22px` | 标准卡片 |
| `--radius-xl` | `28px` | 大容器 |
| `--radius-card` | `22px` | 卡片 |
| `--space-page` | `16px` | 页面边距 |
| `--space-section` | `16px` | 区块间距 |
| `--space-section-lg` | `20px` | 大区块间距 |
| `--space-card` | `16px` | 卡片内边距 |
| `--space-card-compact` | `14px` | 紧凑卡片 |
| `--space-card-gap` | `10px` | 卡片间距 |
| `--touch-target` | `44px` | 最小点击区 |
| `--touch-target-lg` | `48px` | 主要按钮点击区 |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | 底部安全区 |

## 6.2 模块级新增 tokens

建议增加：

| Token | 值 | 用途 |
|---|---:|---|
| `--wd-page-bg` | `var(--color-bg)` | 模块页面背景 |
| `--wd-surface` | `rgba(255,252,247,.94)` | 标准卡片背景 |
| `--wd-surface-strong` | `#fffdf9` | Hero、重要卡片 |
| `--wd-surface-muted` | `#fff8f0` | 事实网格小块 |
| `--wd-divider` | `rgba(226,203,177,.68)` | 行分隔 |
| `--wd-overlay` | `rgba(44,35,28,.30)` | 弹层遮罩 |
| `--wd-default-strong` | `#c94631` | 出险主色 |
| `--wd-default-text` | `#ad3828` | 出险标签文字 |
| `--wd-default-soft` | `#fbe5df` | 出险标签背景 |
| `--wd-major-text` | `#c6481d` | 重大预警文字 |
| `--wd-major-soft` | `#ffe5d7` | 重大预警背景 |
| `--wd-level2-text` | `#b75400` | 二级预警文字 |
| `--wd-level2-soft` | `#ffe8d2` | 二级预警背景 |
| `--wd-level1-text` | `#8c6200` | 一级预警文字 |
| `--wd-level1-soft` | `#fff0c9` | 一级预警背景 |
| `--wd-tracking-text` | `#4f712b` | 跟踪中 |
| `--wd-tracking-soft` | `#edf5df` | 跟踪中背景 |
| `--wd-neutral-soft` | `#f6eee4` | 中性标签 |
| `--wd-focus-ring` | `#ff7a1a` | 键盘焦点 |
| `--wd-bottom-bar-height` | `60px` | 底部 AI 输入高度 |
| `--wd-bottom-reserve` | `96px` | 页面底部预留 |
| `--wd-sheet-radius` | `26px` | Bottom Sheet 顶部圆角 |
| `--wd-sheet-max-height` | `72dvh` | 标准弹层最大高度 |

## 6.3 间距阶梯

仅使用以下间距：

- 4px
- 6px
- 8px
- 10px
- 12px
- 14px
- 16px
- 20px
- 24px
- 32px

禁止在相同组件中混用无规律的13px、15px、17px、19px等间距。

## 6.4 边框与阴影

标准卡片：

- 边框：`1px solid rgba(243,227,209,.92)`
- 背景：`var(--wd-surface)`
- 圆角：22px
- 阴影：`var(--shadow-card)`

列表卡片：

- 圆角：18px
- 阴影可以弱于标准卡片
- 相邻列表项之间保持10px间距

输入框：

- 边框：`1px solid var(--color-border)`
- 圆角：999px或16px
- 高度不低于44px

---

## 7. Typography Rules

## 7.1 字体家族

统一使用：

`"Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

数字启用：

- `font-variant-numeric: tabular-nums`
- `font-feature-settings: "tnum" 1`

不得通过引入新字体依赖解决参考图字体差异。

## 7.2 字体层级

| 用途 | 字号 | 字重 | 行高 | 最大行数 | 规则 |
|---|---:|---:|---:|---:|---|
| 页面标题 | 22px | 700 | 28px | 1 | 居中，超长省略 |
| 顶部一级 Tab | 15px | 650 | 22px | 1 | 不换行 |
| Section 标题 | 17px | 700 | 24px | 1 | 左对齐 |
| 卡片标题 | 16px | 650 | 22px | 2 | 允许中文自然换行 |
| 客户名称—列表 | 15px | 700 | 21px | 2 | 超出省略 |
| 客户名称—详情 | 20px | 700 | 28px | 2 | 不缩小字体 |
| 正文 | 14px | 500 | 21px | 按场景 | 不使用全粗体 |
| 辅助正文 | 13px | 500 | 19px | 2 | 超出省略 |
| Caption | 12px | 500 | 17px | 1 | 日期、单位、来源 |
| 标签 | 11px | 700 | 16px | 1 | 不允许换行 |
| 按钮 | 14px | 650 | 20px | 1 | 居中 |
| 图表标签 | 11px | 500 | 14px | 2 | 防重叠 |
| 超大指标 | 34px | 700 | 36px | 1 | 规模Hero |
| 大指标 | 28px | 700 | 31px | 1 | 主要卡片 |
| 中指标 | 22px | 700 | 25px | 1 | 等级卡片 |
| 小指标 | 18px | 700 | 22px | 1 | 次级数字 |

## 7.3 中文与数字混排

金额：

- 数字与单位之间保留4px视觉间距。
- UI 文案使用“亿元”或“亿”，同一组件内必须统一。
- 总览与详情主指标优先使用“亿元”。
- 小卡片可使用“亿”，但不得同卡混用。
- 示例：`3,342 亿元`、`0.60 亿元`。

百分比：

- 保留2位小数：`34.77%`。
- 百分号与数字不换行。
- 使用等宽数字。

日期：

- 统一使用 `YYYY-MM-DD`。
- 月份选择器使用 `YYYY年M月`。
- 日期不换行。

客户数：

- 文案统一使用“法人客户”或“户”。
- 总览卡使用“964 法人客户”。
- 紧凑卡片使用“5 户”。
- 不使用“家”替代已确认的“户”。

## 7.4 超长文本

客户名称：

- 列表最多2行。
- 详情页最多2行。
- 不减小字号。
- 超出显示省略号。
- 完整名称通过详情或可访问名称读取。

所属集团：

- 列表最多1行。
- 详情允许2行。

风险原因：

- 列表摘要最多2行。
- 详情默认最多4行。
- 超过4行提供“展开全部”。
- 未提供时明确显示“暂无可用触发原因明细”。

担保方：

- 不截断为不可辨识文本。
- 允许自然换行。
- 多个担保方分行显示。

标签：

- 单个标签不换行。
- 多个标签整体可换到下一行。
- 不允许标签内部断字。

## 7.5 金额极值

- 数值使用千位分隔符。
- 0到9,999.99亿元保持“亿元”。
- 超过或等于10,000亿元时，可按统一 formatter 显示为“1.23万亿元”。
- 禁止通过无限缩小字号容纳大金额。
- 主指标最小不得低于24px。
- 金额与单位必须始终同一行。

---

## 8. Layout Rules

## 8.1 页面框架

- 页面宽度：100%
- 内容最大宽度：430px
- 主要视口：390px
- 不渲染手机外壳
- 不渲染假的系统状态栏
- 页面背景：`var(--wd-page-bg)`

页面左右边距：

- 375px：14px
- 390px：16px
- 393px：16px
- 414px：18px
- 430px：18px

可使用：

`padding-inline: clamp(14px, 4vw, 18px)`

## 8.2 PageHeader

- 最小高度：60px
- 返回和分享按钮：44 × 44px
- 标题居中
- 左右操作区等宽，保证视觉中心不偏移
- sticky top: 0
- z-index: 20
- 背景使用从实色到透明的渐变，避免滚动内容穿透文字

## 8.3 内容滚动

- 页面本体纵向滚动。
- 禁止主页面横向滚动。
- 仅成员公司 Chip 行允许局部横向滚动。
- 页面底部必须预留：
  `calc(var(--wd-bottom-reserve) + var(--safe-bottom))`

## 8.4 Grid

双列 KPI：

- `grid-template-columns: repeat(2, minmax(0, 1fr))`
- gap: 10px
- 同一行卡片等高
- 使用最小高度，不使用强制固定高度

三级预警卡：

- 375px及以上保持3列
- gap: 8px
- 卡片内边距：12px
- 数字使用22px，375px下可降至20px
- 文字不得横向溢出

事实网格：

- 2列
- gap: 10px
- 字段值长时允许卡片增高
- 不同卡片不强求整页统一高度，只保证同一行等高

## 8.5 卡片高度

不得依赖文字“刚好放下”。

建议最小高度：

| 组件 | 最小高度 |
|---|---:|
| 新增风险指标卡 | 126px |
| 存量风险卡 | 124px |
| 等级指标卡 | 108px |
| 汇总 Hero | 146px |
| 客户列表项 | 100px |
| 客户概览 Hero | 198px |
| 资产卡 | 168px |
| 事实信息卡 | 92px |
| 时间线卡 | 126px |
| 趋势图卡 | 220px |

长内容使卡片自然增高，不允许溢出遮挡。

## 8.6 底部 AI 输入

- fixed 于应用 Shell 底部
- 左右间距与页面一致
- 高度：60px
- 距底部：
  `12px + var(--safe-bottom)`
- z-index：30
- 页面底部预留至少96px
- 弹层打开时隐藏或置于遮罩下
- 不得遮挡最后一张卡片或底部操作按钮

## 8.7 Bottom Sheet

- 宽度：100%
- 最大高度：72dvh
- 小内容允许自适应，但不低于320px
- 顶部圆角：26px
- Handle：36 × 4px
- Header固定
- Body可滚动
- Footer固定
- 遮罩覆盖应用内容
- 打开时锁定宿主页面滚动
- 关闭后恢复原滚动位置

---

## 9. Component Specifications

## 9.1 推荐模块组件边界

建议模块目录按功能拆分，不绑定旧页面结构：

    warning-default/
      pages/
      components/
      charts/
      data/
      types/
      hooks/
      utils/
      styles/

页面不得同时承担：

- Mock 数据定义
- 业务聚合
- 格式化
- 路由状态
- 弹层状态
- 复杂渲染

## 9.2 现有公共组件复用判断

| 现有能力 | 建议 | 条件 |
|---|---|---|
| `AppShell` | 可复用 | 保持430px最大宽度与移动端滚动 |
| `PageHeader` | 可复用或小幅扩展 | 必须保证标题真实居中、支持分享、sticky |
| `BottomAskBar` | 可复用结构，重写模块样式 | 必须满足底部预留、不会遮挡 |
| `GlobalCopilotProvider` | 复用交互基线，重写本模块响应结构 | 不得强制显示通用传导链、建议动作 |
| `BottomSheet` | 仅作为基线 | 必须增加焦点管理、滚动锁、sticky footer |
| `TabBar` | 不直接复用顶部信用风险导航 | 现有胶囊样式不符合下划线Tab |
| `PillTag` | 可复用基础结构 | 必须新增明确语义，而非泛化variant |
| `MetricCard` | 不建议强行复用 | 新稿结构与信息密度不同 |
| `RiskCard` | 不建议复用 | 旧卡片不是法人客户/风险资产结构 |
| `AIInsightCard` | 不复用 | 当前模块无页面级AI摘要 |
| `MiniLineChart` | 评估后复用 | 必须满足图表规范和空状态 |
| `DonutChart` | 当前不需要 | 不引入未出现图表 |

## 9.3 PageHeader

输入：

- `title`
- `onBack`
- `sharePayload`
- `sticky`
- `contextLabel?`

状态：

- 默认
- sticky
- 分享成功
- 分享失败
- 返回不可用时使用父级 fallback route

交互：

- 返回按钮必须可点击
- 分享优先调用 Web Share API
- 不支持时复制当前链接并显示Toast

## 9.4 CreditRiskTabs

输入：

- `activeKey`
- `items`
- `onChange`

规格：

- 高度48px
- 三等分
- 无胶囊容器
- 激活项橙色
- 激活下划线：36 × 3px
- 不允许横向滚动

交互：

- 大户风险、集中度风险、预警与出险均需有真实路由
- 当前模块只修改“预警与出险”实现，不破坏其他Tab

## 9.5 PeriodSegmentedControl

用途：

- 本日/本月

规格：

- 高度40px
- 圆角999px
- 选中项橙色实底、白字
- 非选中透明或暖白
- 最小宽度64px

状态：

- 默认
- 选中
- 禁用
- 加载

## 9.6 SummaryMetricCard

输入：

- `label`
- `amount`
- `customerCount?`
- `trend?`
- `tone`
- `onClick?`

结构：

1. 图标与标签
2. 金额
3. 客户数或辅助说明

状态：

- 默认
- 可点击
- loading
- empty
- error
- zero

零值：

- 真实零显示`0.00 亿元`和`0 户`
- 数据不可用显示`—`和“暂无数据”
- 不允许用`—`表示真实零

## 9.7 RiskGradeCard

输入：

- `grade`
- `amount`
- `share`
- `changeFromPrevious`

视觉：

- 重大：红橙
- 二级：橙
- 一级：琥珀
- 风险下降：绿色变化值
- 风险上升：危险色变化值

点击：

- 进入带等级筛选的客户列表

## 9.8 RiskStructureBar

结构：

- 单条水平分段条
- 下方三级数据
- 分段宽度按占比
- 最小可见宽度6px

状态：

- 完整数据
- 单等级100%
- 空数据
- 百分比和不为100时显示数据异常提示，不自行归一化掩盖错误

## 9.9 RiskCustomerListItem

输入：

- `customer`
- `group`
- `amount`
- `riskClassification`
- `memberCompany`
- `eventDate`
- `onOpen`

结构：

- 左：名称、所属集团、标签、日期
- 右：金额、单位
- 整卡可点击

状态：

- 默认
- pressed
- loading skeleton
- disabled不可使用；如无权限应有明确提示
- 长名称
- 缺少集团
- 缺少日期

## 9.10 SearchField

- 高度44px
- 圆角999px
- 左侧搜索图标
- 清除按钮只在有值时出现
- 250ms防抖
- 搜索状态保存在URL Query
- 返回列表后保留

## 9.11 FilterChip

- 高度34px
- 单行
- 不允许标签内部换行
- 激活：橙色文字、浅橙底、橙色边框
- 未激活：暖白底、中性文字
- 多个Chip容器可换行或局部横向滚动

## 9.12 FilterSheet

输入：

- 当前已应用值
- 可选项
- draft状态
- reset
- apply

行为：

- 打开时复制已应用值到draft
- 点击关闭或遮罩：丢弃draft
- 点击应用：提交draft并关闭
- 点击重置：恢复页面默认值，但需点击应用才提交
- 所有按钮真实可用

## 9.13 CustomerRiskHero

字段：

- 当前风险标签
- 进入/认定日期
- 法人客户名称
- 所属集团
- 风险金额
- 成员公司

规格：

- 允许客户名称2行
- 两个关键事实卡同一行
- 长所属集团不挤压金额
- `min-width: 0`

## 9.14 RiskFactGrid

- 2列
- 每项包含label和value
- value允许2行
- 长字段项可跨2列
- `预警原因`、`关键事实`应跨全宽

## 9.15 RiskAssetCard

字段：

- 资产名称
- 当前风险标签
- 业务摘要
- 金额
- 成员公司
- 日期
- 操作按钮

按钮：

- 加入跟踪
- 查看资产详情

按钮在375px仍保持双列；文字不得换行。

## 9.16 KeyValueTable

用于完整业务字段。

规格：

- label列宽：112px
- value列自适应
- 行最小高度44px
- 长value自然换行
- 行分隔线
- 空值显示`—`
- 不得用空字符串造成布局坍塌

## 9.17 Timeline

输入：

- 日期
- 标题
- 描述
- tone
- provenance

规格：

- 日期列：74px
- 轴线列：16px
- 内容列：自适应
- 圆点直径8px
- 当前事件突出
- 时间顺序必须明确
- 支持升序或降序，但同页统一

## 9.18 StickyActionBar

- 两个按钮时1:1
- 高度48px
- gap: 10px
- 主按钮橙色实底
- 次按钮白底橙色边框
- 如页面同时显示BottomAskBar，ActionBar必须位于内容流中，不固定遮挡

## 9.19 TrackingSheet

字段组件必须真实可操作：

- 跟踪主题：文本或预填只读
- 责任成员公司：选择器
- 责任人：选择器
- 截止日期：日期选择
- 跟踪频率：选择器

状态：

- 默认
- partially complete
- valid
- submitting
- success
- failure

失败时：

- 保留用户输入
- 显示明确错误
- 可重试

## 9.20 TrackingDetail

字段：

- trackingPriority
- trackingStatus
- linkedAsset
- owner
- dueDate
- frequency
- latestUpdate
- progress
- records

“更新”交互：

- 打开进展更新弹层
- 输入进展文本
- 提交后追加记录并刷新最近更新时间
- 不得留下不可点击的“更新”

## 9.21 ReportSheet

输入：

- 可选目标报告
- 可包含内容
- 摘要预览
- 关联风险对象

行为：

- 至少选择一个内容项
- 未选择时主按钮禁用
- 提交成功后关闭并Toast
- 提交失败保留选择

## 9.22 BottomAskBar

输入：

- placeholder
- pageContext
- onOpen

规格：

- 高度60px
- 左侧Bot图标
- 中间文案
- 麦克风图标
- 右侧加号
- 输入区域和加号均可点击
- 加号不得是无行为假按钮；打开全局Copilot的附加操作入口

## 9.23 CopilotPanel

结构：

- Header
- 当前上下文
- 用户问题
- 回答分类
- 业务事实
- 关键事项
- 结论类型
- 继续追问

状态：

- loading
- streaming或完整回答
- error
- no-data
- follow-up

当前模块不得出现：

- 风险预测
- 自动处置建议
- 无证据原因分析
- 通用风险传导模板

## 9.24 Toast

规格：

- 高度至少44px
- 顶部居中
- 自动消失3秒
- 成功、失败和信息三种
- `aria-live="polite"`
- 不遮挡PageHeader标题
- 不使用Toast替代必要的表单错误

---

## 10. Status Semantics

不得使用单一笼统 `status` 字段。

## 10.1 风险等级 `RiskLevel`

| 值 | 业务含义 | 文案 | 颜色 | 图标 | 可操作 |
|---|---|---|---|---|---|
| `normal` | 未进入预警或出险 | 正常 | 中性/绿色 | ShieldCheck | 否 |
| `level1` | 一级预警 | 一级预警 | `--wd-level1-*` | AlertTriangle或圆点 | 仅筛选 |
| `level2` | 二级预警 | 二级预警 | `--wd-level2-*` | AlertTriangle | 仅筛选 |
| `major` | 重大预警 | 重大预警 | `--wd-major-*` | ShieldAlert | 仅筛选 |

出险不属于 `RiskLevel`。

## 10.2 风险趋势 `RiskTrend`

| 值 | 含义 | 文案 | 颜色 | 图标 |
|---|---|---|---|---|
| `increasing` | 风险规模上升 | `↑ x亿元` | danger | ArrowUp |
| `decreasing` | 风险规模下降 | `↓ x亿元` | success | ArrowDown |
| `stable` | 无变化 | `持平` | neutral | Minus |
| `new` | 本期首次纳入统计 | `本期新增` | orange | Plus |

风险下降使用绿色，不代表资产“正常”，只表示变化方向。

## 10.3 预警状态 `WarningStatus`

| 值 | 含义 | 文案 | 样式 |
|---|---|---|---|
| `none` | 当前非预警资产 | 不显示 | 隐藏 |
| `active` | 当前处于某一级预警 | 由RiskLevel显示 | 等级标签 |
| `released` | 已解除预警 | 已解除 | 中性/绿色 |
| `historical` | 仅历史上曾预警 | 历史预警 | 中性 |

迁移类型单独使用 `WarningTransitionType`：

- `entered`
- `upgraded`
- `downgraded`
- `released`
- `reentered`
- `convertedToDefault`

## 10.4 出险状态 `DefaultStatus`

| 值 | 含义 | 文案 | 颜色 | 图标 |
|---|---|---|---|---|
| `none` | 当前未出险 | 不显示 | 隐藏 | — |
| `defaulted` | 当前资产已出险 | 出险 | `--wd-default-*` | ShieldAlert |
| `historical` | 历史出险记录 | 历史出险 | 中性 | History |

出险与当前预警状态互斥。

## 10.5 限额状态 `LimitStatus`

本模块当前不展示限额状态，但全局模型必须与风险状态分离。

| 值 | 文案 | 颜色 | 当前模块 |
|---|---|---|---|
| `normal` | 限额正常 | success/neutral | 不渲染 |
| `warning` | 限额预警 | warning | 不渲染 |
| `exceeded` | 已超限 | danger | 不渲染 |

禁止用限额状态替代预警等级。

## 10.6 管理策略 `ManagementStrategy`

管理策略是动作选择，可多选，不是风险事实。

| 值 | 文案 | 视觉 | 行为 |
|---|---|---|---|
| `monitorOnly` | 持续监测 | 中性Chip | 不创建跟踪 |
| `keyTracking` | 重点跟踪 | 橙色描边/重点标签 | 创建轻量跟踪 |
| `includeInReport` | 纳入风险报告 | 橙色操作 | 加入报告草稿 |

## 10.7 处置状态 `DispositionStatus`

当前已确认设计没有完整处置生命周期。

当前版本只允许：

- `undefined`
- `notProvided`

显示规则：

- 默认不渲染。
- 如接口明确返回“暂无处置数据”，可显示中性辅助文案。
- 禁止开发者自行增加“待处置、处置中、已结案”等状态。
- 禁止把“跟踪中”映射为“处置中”。

## 10.8 跟踪状态 `TrackingStatus`

| 值 | 文案 | 颜色 | 图标 |
|---|---|---|---|
| `notTracking` | 未跟踪 | 中性 | Bookmark |
| `tracking` | 跟踪中 | 绿色 | CheckCircle |
| `creationPending` | 创建中 | 中性/加载 | Loader |

当前UI不定义跟踪关闭或结案。

## 10.9 跟踪优先级 `TrackingPriority`

| 值 | 文案 | 颜色 |
|---|---|---|
| `normal` | 普通跟踪 | 中性 |
| `key` | 重点跟踪 | 橙色或深色强调 |

优先级与跟踪状态必须分开。

---

## 11. Data Contract

## 11.1 数据原则

- 新模块可彻底重建类型。
- 禁止为兼容旧页面沿用不适合的旧接口。
- 页面组件只消费明确的ViewModel。
- 原始实体、聚合指标、显示格式和UI状态分离。
- 所有演示数据必须可识别。
- 前端不得自行推断未确认业务口径。

## 11.2 数据来源标记

~~~ts
type DataProvenance = "confirmed" | "derived" | "demo";

interface DataMeta {
  provenance: DataProvenance;
  sourceRef?: string;
  asOfDate?: string;
  note?: string;
}
~~~

含义：

- `confirmed`：来源于已确认截图或业务规则
- `derived`：由确认数据按明确公式计算
- `demo`：仅用于流程和视觉演示

## 11.3 基础值类型

~~~ts
type EntityId = string;
type ISODate = string;

interface MoneyAmount {
  value: number;
  currency: "CNY";
  displayUnit: "亿元";
}

interface PercentageValue {
  value: number;
  precision: 2;
}
~~~

## 11.4 状态类型

~~~ts
type RiskLevel = "normal" | "level1" | "level2" | "major";
type RiskTrend = "increasing" | "decreasing" | "stable" | "new";
type WarningStatus = "none" | "active" | "released" | "historical";
type DefaultStatus = "none" | "defaulted" | "historical";
type LimitStatus = "normal" | "warning" | "exceeded";
type ManagementStrategy =
  | "monitorOnly"
  | "keyTracking"
  | "includeInReport";
type DispositionStatus = "notProvided";
type TrackingStatus = "notTracking" | "tracking" | "creationPending";
type TrackingPriority = "normal" | "key";

type WarningTransitionType =
  | "entered"
  | "upgraded"
  | "downgraded"
  | "released"
  | "reentered"
  | "convertedToDefault";

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
~~~

## 11.5 成员公司

~~~ts
interface MemberCompany {
  id: EntityId;
  name: string;
  shortName: string;
  active: boolean;
  meta: DataMeta;
}
~~~

确认示例：

- 医保科技
- 租赁
- 银行
- 不动产
- 信托
- 寿险
- 资产管理
- 产险
- 海外控股
- 基金
- 健康保险
- 理财子
- 证券
- 陆金所
- 养老险
- 普惠金融
- 平安资本
- 陆基金
- 方正证券

所有成员公司处于同一筛选层级。

## 11.6 法人客户与所属集团

~~~ts
interface CorporateGroup {
  id: EntityId;
  name: string;
  meta: DataMeta;
}

interface CorporateCustomer {
  id: EntityId;
  legalName: string;
  groupId?: EntityId;
  currentHighestState: RiskState;
  meta: DataMeta;
}
~~~

业务规则：

- 客户户数按法人公司去重。
- 法人客户可有一个所属集团名称。
- 所属集团不是客户数计数对象。
- 若法人客户存在任一出险资产，则客户只计入出险客户数。
- 资产金额仍按每笔资产自身状态归类。

## 11.7 风险资产

~~~ts
interface RiskAsset {
  id: EntityId;
  customerId: EntityId;
  memberCompanyId: EntityId;

  assetName: string;
  businessType?: string;
  portfolioName?: string | null;
  fundingSource?: string | null;

  amount: MoneyAmount;
  currentState: RiskState;

  disbursementDate?: ISODate;
  maturityDate?: ISODate;
  guarantorNames: string[];

  warningSignalIds: EntityId[];
  defaultEventId?: EntityId;
  stateTransitionIds: EntityId[];

  meta: DataMeta;
}
~~~

## 11.8 预警信号

~~~ts
interface WarningSignal {
  id: EntityId;
  assetId: EntityId;
  signalDate: ISODate;
  reasonText?: string | null;
  evidenceItems: WarningEvidence[];
  meta: DataMeta;
}

interface WarningEvidence {
  id: EntityId;
  label: string;
  value?: string;
  source?: string;
  occurredAt?: ISODate;
}
~~~

当前常宁市尚宇高级中学案例：

- `reasonText = null`
- 页面显示“暂无可用触发原因明细”
- 不允许AI补全

## 11.9 状态迁移

~~~ts
interface RiskStateTransition {
  id: EntityId;
  assetId: EntityId;
  occurredAt: ISODate;
  fromState?: RiskState;
  toState: RiskState;
  transitionType?: WarningTransitionType;
  amountAtTransition: MoneyAmount;
  description?: string;
  meta: DataMeta;
}
~~~

UI不得基于缺失记录自行生成“此前为二级预警”等历史。

## 11.10 出险事件

~~~ts
interface DefaultEvent {
  id: EntityId;
  assetId: EntityId;
  defaultDate: ISODate;
  category: string;
  reason: string;
  amount: MoneyAmount;
  maturityDate?: ISODate;
  overdueDaysAtRecognition?: number;
  meta: DataMeta;
}
~~~

广西百色案例：

- category：逾期
- reason：本息实质逾期
- amount：0.47亿元
- defaultDate：2026-06-01
- maturityDate：2026-05-23
- overdueDaysAtRecognition：9，derived

## 11.11 聚合指标

~~~ts
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
  asOfDate: ISODate;
  meta: DataMeta;
}

interface WarningDefaultSnapshot {
  asOfDate: ISODate;
  warningAssetAmount: MoneyAmount;
  warningCustomerCount: number;
  defaultAssetAmount: MoneyAmount;
  defaultCustomerCount: number;
  warningGrades: WarningGradeMetric[];
  newMetrics: NewRiskMetric[];
  meta: DataMeta;
}
~~~

前端聚合规则：

- 优先消费后端或Mock提供的聚合结果。
- 如需从事件计算，必须使用明确的 `includedInMetric` 或 `countingKey`。
- 不得自行发明同一资产重复进入重大预警时的去重逻辑。

## 11.12 跟踪

~~~ts
interface TrackingCase {
  id: EntityId;
  subject: string;
  linkedCustomerId: EntityId;
  linkedAssetId: EntityId;
  memberCompanyId: EntityId;

  priority: TrackingPriority;
  status: TrackingStatus;

  ownerName?: string;
  ownerDepartment?: string;
  dueDate?: ISODate;
  frequency?: "daily" | "weekly" | "monthly";

  latestUpdateAt?: ISODate;
  recordIds: EntityId[];

  meta: DataMeta;
}

interface TrackingRecord {
  id: EntityId;
  trackingCaseId: EntityId;
  occurredAt: ISODate;
  type: "created" | "progressUpdated" | "riskEvent";
  title: string;
  content?: string;
  author?: string;
  meta: DataMeta;
}
~~~

跟踪数据与风险状态分离。

## 11.13 报告衔接

~~~ts
interface ReportDraftOption {
  id: EntityId;
  title: string;
  periodLabel: string;
  meta: DataMeta;
}

interface ReportInclusionDraft {
  reportId: EntityId;
  linkedCustomerId: EntityId;
  linkedAssetId: EntityId;
  trackingCaseId?: EntityId;
  includeRiskFacts: boolean;
  includeAssetFields: boolean;
  includeTrackingProgress: boolean;
  summaryPreview: string;
}
~~~

## 11.14 Copilot

~~~ts
interface CopilotPageContext {
  route: string;
  asOfDate?: ISODate;
  memberCompanyId?: EntityId;
  period?: "today" | "month";
  customerId?: EntityId;
  assetId?: EntityId;
}

interface CopilotFact {
  label: string;
  value: string;
  sourceLabel: string;
  asOfDate?: ISODate;
}

interface CopilotFactResponse {
  answerType: "structuredFacts";
  facts: CopilotFact[];
  keyItems: string[];
  aiInference: "none";
  disclaimer: string;
}
~~~

## 11.15 已确认数据与演示数据

### 已确认

- 数据日期：2026-06-24
- 本月新增重大预警：0.60亿元、5户
- 本月新增出险：0.83亿元、7户
- 预警资产：3,342亿元、964户
- 出险资产：2,967亿元、731户
- 重大预警：1,162亿元、34.77%、-9亿元
- 二级预警：1,320亿元、39.49%、-3亿元
- 一级预警：860亿元、25.74%、-4亿元
- 本月全部预警净变化：-16亿元
- 客户与资产案例字段
- 广西百色出险资产完整字段

### 派生

- 上月末预警资产总额3,358亿元
- 广西百色出险认定时逾期9天

### 演示

- 出险资产历史趋势序列
- 跟踪责任人
- 跟踪截止日期
- 跟踪进展
- 报告名称与报告流程状态

演示内容必须显示“演示数据”或“演示流程”。

## 11.16 不允许开发者自行推断

不得自行补充：

- 未提供的预警原因
- 未提供的历史迁移等级
- 处置状态
- 预计损失
- 担保覆盖率
- AI预测
- AI处置建议
- 额外客户或资产金额
- 未确认的成员公司排名
- 同一资产重复进入重大预警的去重口径
- 出险后的结案状态
- 法人客户名下所有资产统一归为出险
- 将“—”解释为0

---

## 12. Chart Specifications

## 12.1 预警资产结构对比图

页面：WD-02

目的：

- 对比上月末与当前预警资产总量和三级结构。

输入：

- 上月末：
  - 重大1,171亿元
  - 二级1,323亿元
  - 一级864亿元
  - 合计3,358亿元
- 当前：
  - 重大1,162亿元
  - 二级1,320亿元
  - 一级860亿元
  - 合计3,342亿元

图形：

- 两根垂直堆叠柱
- 公共Y轴范围
- 柱宽54px
- 柱间距54px
- 图表绘图区高度140px
- 卡片总高度不低于220px

颜色：

- 重大：`--wd-major-text`
- 二级：`--color-orange`
- 一级：`--color-warning`

标签：

- X轴两行：
  - `05月末`
  - `3,358`
- `06-24`
- `3,342`

单位：

- 右上角Chip“单位：亿元”

空数据：

- 不绘制0高度假柱
- 显示“暂无结构数据”

极值：

- Y轴最大值为最大合计值的1.1倍
- 最小非零分段可视高度4px
- 不因极小分段隐藏图例

## 12.2 预警资产结构条

页面：WD-01B

目的：

- 快速表达三级预警占比。

规格：

- 高度12px
- 圆角999px
- 三段无间隙
- 下方展示金额和百分比
- 总和误差小于0.02个百分点可按原值显示
- 超过误差显示数据异常，不自动改数

## 12.3 出险资产变化趋势

页面：WD-07

目的：

- 表达出险资产历史走势。

数据性质：

- 当前历史序列为演示数据。
- 页面必须显示“趋势演示”。
- 当前值2,967亿元为确认数据。

图形：

- 单折线
- 不使用面积填充或只使用极浅填充
- 绘图区高度110px
- 卡片总高度不低于200px
- 左右内边距16px
- 线宽3px
- 拐点可省略，避免移动端拥挤

坐标：

- X轴首尾至少显示2026-01、2026-06
- Y轴可隐藏刻度，但必须有辅助网格
- 使用自动domain并保留10%上下空间

空数据：

- 当前值仍展示
- 图表区显示“暂无历史趋势”

单点：

- 显示水平基准点和日期
- 不伪造折线

不同视口：

- 图表宽度100%
- SVG使用`viewBox`
- 不允许固定像素宽度造成裁切

## 12.4 图表可访问替代

每张图必须提供：

- `aria-label`
- 屏幕阅读器可读取的文本摘要
- 可选的隐藏数据列表
- 不只依靠颜色区分序列

---

## 13. Interaction Rules

## 13.1 点击

- 所有视觉上可点击元素必须有真实行为。
- 卡片可点击时整卡点击，不只点击小箭头。
- 按钮不得仅显示Hover而无事件。
- 加号、分享、更新、全部、查看口径均必须实现。

## 13.2 返回

- 优先浏览器历史返回。
- 无历史记录时使用定义的父级路由。
- 返回列表后保留：
  - 搜索词
  - 已应用筛选
  - 排序
  - 时间范围
  - 成员公司
  - 列表滚动位置

## 13.3 Tab

- 信用风险顶部Tab改变路由。
- 本日/本月切换只改变当前页查询状态。
- Tab切换不得重置无关全局状态。
- 当前激活状态必须有`aria-selected`。

## 13.4 筛选

- 弹层内使用draft状态。
- 关闭不提交。
- 应用后写入URL Query。
- 重置后需点击应用。
- 筛选结果为0时显示无结果状态和重置入口。

## 13.5 排序

重大预警：

- 规模从高到低
- 最近进入重大

出险：

- 规模从高到低
- 最近出险

排序项必须真正改变列表顺序。

## 13.6 展开与折叠

- 风险原因超过4行可展开。
- 状态记录“全部”切换完整时间线。
- “查看完整字段”平滑滚动至WD-10B对应区块。
- 不创建无必要的新页面。

## 13.7 弹层

关闭方式：

- 关闭按钮
- 遮罩点击
- Escape
- 浏览器返回

表单未提交时：

- 简单筛选可直接关闭并丢弃draft。
- 已输入跟踪或进展表单时，关闭前提示是否放弃。

## 13.8 创建跟踪

流程：

1. 打开跟踪弹层
2. 预填主题和成员公司
3. 选择责任人
4. 选择截止日期
5. 选择频率
6. 确认
7. 显示提交中
8. 成功进入跟踪详情
9. 显示“已加入重点跟踪”

失败：

- 不丢失表单
- 显示失败原因
- 允许重试

## 13.9 加入报告

流程：

1. 打开报告弹层
2. 选择目标报告
3. 勾选内容
4. 查看摘要预览
5. 加入报告草稿
6. 成功关闭
7. 显示“报告内容已准备”

## 13.10 操作反馈

- 成功Toast：3秒
- 失败Toast：需用户关闭或5秒
- 表单错误：字段附近显示
- 网络错误：保留数据并提供重试
- Loading不得用空白页面代替

---

## 14. AI Presentation

## 14.1 已确认AI范围

本模块仅实现：

- 底部全局AI输入
- 全局Copilot
- 基于当前页面结构化数据的事实查询
- 继续追问

不实现：

- 页面级AI卡片
- AI风险预测
- AI预警原因生成
- AI处置建议
- AI自动跟踪
- AI自动报告结论
- 主动提醒卡片

## 14.2 输入上下文

Copilot可使用：

- 当前页面
- 当前时间范围
- 当前成员公司
- 当前法人客户
- 当前风险资产
- 数据日期
- 当前结构化指标
- 用户当前筛选

## 14.3 输出结构

固定为：

1. 回答类型
2. 业务事实
3. 数据日期
4. 已确认的重点事项
5. 是否包含AI推断
6. 边界声明

## 14.4 事实与推断

- `业务事实`使用绿色标签。
- `AI推断：无`必须明确显示。
- 如未来存在推断，必须另行定义并经业务确认，本规范不授权实现。
- 不得将推断写成业务事实。

## 14.5 证据

当前Copilot证据来自：

- 页面结构化指标
- 当前客户和资产字段
- 已确认的数据日期

每个回答至少显示数据日期或来源范围。

## 14.6 后续行动

当前允许：

- 继续追问
- 关闭
- 返回原页面

不允许通过Copilot自动：

- 修改风险状态
- 创建跟踪
- 加入报告
- 生成处置建议

---

## 15. Responsive and Overflow Rules

## 15.1 375 × 812

- 页面边距14px
- 双列KPI gap 8px
- 三级等级卡保持3列
- 等级数字可由22px降至20px
- BottomAskBar高度保持60px
- 页面内容必须可滚动
- Bottom Sheet最大高度74dvh
- 不允许横向滚动页面

## 15.2 390 × 844

- 使用基准尺寸
- 页面边距16px
- 组件按规范默认值

## 15.3 393 × 852

- 与390px保持相同布局
- 不因3px宽度变化切换布局模式

## 15.4 414 × 896

- 页面边距18px
- 卡片不无限拉宽
- 字号不放大
- 图表按容器宽度扩展

## 15.5 430 × 932

- 内容最大宽度430px
- 页面边距18px
- 保持单列移动端结构
- 不切换为平板或桌面布局

## 15.6 长标题

- 页面标题：1行省略
- 客户名称：最多2行
- 资产名称：最多2行
- 弹层标题：最多1行
- 完整内容在详情或辅助文本中提供

## 15.7 长客户与资产名称

测试至少覆盖：

- 30个以上中文字符
- 中英文数字混排
- 括号和连接符

不得：

- 挤压金额列至不可见
- 使标签脱离卡片
- 造成按钮位移

## 15.8 大金额和多位数字

必须测试：

- `12,345.67 亿元`
- `9,999 法人客户`
- `123.45%`
- `-1,234.56 亿元`

处理：

- 使用千位分隔
- 金额不换行
- 卡片允许值区增宽
- 必要时使用统一单位转换，不缩到不可读

## 15.9 多行风险原因

- 默认4行
- 展开后完整显示
- 卡片自然增高
- 后续区块整体下移
- 禁止绝对定位导致覆盖

## 15.10 标签过多

- 状态标签和业务标签分组
- 容器可换行
- 单个标签不换行
- 最多首屏显示3个次要标签，多余使用“更多”
- “更多”必须可点击展开

## 15.11 图例过长

- 图例可换行
- 单项不可截断到无法辨识
- 图例与图表至少8px间距
- 不覆盖坐标轴

---

## 16. Accessibility

## 16.1 点击区域

- 所有交互元素最小44 × 44px
- 小图标可视觉上小于44px，但点击容器不得小于44px

## 16.2 对比度

- 正文文字至少4.5:1
- 大文字至少3:1
- 浅色标签文字必须使用足够深的对应色
- 禁止浅橙文字直接放白底作为正文

## 16.3 焦点

键盘焦点：

- 2px `--wd-focus-ring`
- offset 2px
- 不得只依赖浏览器默认不明显焦点

## 16.4 按钮语义

- 使用真实`button`
- 链接导航使用真实路由链接
- 图标按钮必须有`aria-label`
- 禁用按钮必须设置`disabled`

## 16.5 弹层焦点管理

打开：

- 焦点进入弹层标题或首个交互控件
- 锁定焦点于弹层内

关闭：

- 焦点返回触发按钮
- 恢复宿主滚动

## 16.6 状态表达

状态不得只依靠颜色。

必须同时使用：

- 文案
- 可选图标
- 颜色

## 16.7 Reduced Motion

在`prefers-reduced-motion: reduce`时：

- 禁用大幅弹层滑动
- 关闭复杂图表动画
- 保留必要状态变化
- Toast使用淡入淡出或无动画

## 16.8 图表替代

- 图表提供文本摘要
- 数据点可通过隐藏列表读取
- 空图表明确说明原因

---

## 17. Acceptance Criteria

## 17.1 WD-01A / WD-01B

必须展示：

- 信用风险标题和三级Tab
- 本日/本月
- 0.60亿元、5户
- 0.83亿元、7户
- 3,342亿元、964户
- 2,967亿元、731户
- 三级预警金额与变化
- 等级占比
- 四个客户预览
- 底部AI输入

必须可用：

- 返回
- 分享
- Tab
- 本日/本月
- 查看口径
- 进入预警
- 进入出险
- 客户卡片
- Copilot

不得出现：

- “续页2/2”
- 卡片高度无规则跳动
- AI摘要卡
- 底部输入遮挡客户列表

## 17.2 WD-02

必须展示：

- 3,342亿元
- 964户
- 三级金额、占比和变化
- 上月末3,358亿元与当前3,342亿元
- 成员公司筛选

必须可用：

- 查看迁移明细
- 等级卡下钻
- 成员公司切换

不得出现：

- 堆叠图溢出
- 图例重叠
- 将净变化显示为新增规模

## 17.3 WD-03

必须展示：

- 月份
- 集团汇总
- 0.60、0.83、-9、-16
- 口径说明
- 两个重大预警客户

必须可用：

- 月份选择
- 成员公司选择
- 排序
- 客户下钻

不得自行补全迁移来源。

## 17.4 WD-04 / WD-08

必须展示：

- 汇总金额
- 法人客户数
- 搜索
- 快捷筛选
- 客户卡片

必须可用：

- 搜索
- 打开筛选
- 应用和重置
- 排序
- 点击客户
- 返回后保持状态

不得：

- 将所属集团当作客户数对象
- 让金额换行
- 让标签内部换行

## 17.5 WD-04-S1 / WD-08-S1

必须：

- 有遮罩
- 有Handle
- 可滚动
- 有关闭、重置和应用
- draft与已应用状态分离
- Escape可关闭
- 焦点锁定

不得：

- 被底部AI输入覆盖
- 应用前修改列表状态
- 关闭后丢失已应用条件

## 17.6 WD-05

必须展示：

- 常宁市尚宇高级中学有限公司
- 湖南尚宇教育投资集团
- 0.25亿元
- 医保科技
- 2026-06-23
- 1笔风险资产
- 进入重大预警记录

必须可用：

- 加入跟踪
- 查看资产详情
- 状态记录全部

## 17.7 WD-06

必须展示：

- 重大预警
- 0.25亿元
- 数据日期
- 当前状态
- 预警日期
- 成员公司
- 所属集团
- 暂无预警原因
- 状态时间线

不得出现虚构原因或历史等级。

## 17.8 WD-07

必须展示：

- 2,967亿元
- 731户
- 0.83亿元
- 7户
- 本日0.05亿元、1户
- 成员公司筛选
- 趋势演示标记

必须可用：

- 本日/本月
- 查看明细
- 成员公司切换

趋势数据不得伪装为确认数据。

## 17.9 WD-09

必须展示：

- 广西百色试验区发展集团有限公司
- 广西百色城市产业发展集团
- 出险0.47亿元
- 租赁
- 逾期
- 本息实质逾期
- 到期日和出险日
- 风险资产卡

不得暗示该客户全部资产均出险。

## 17.10 WD-10A / WD-10B

必须完整展示：

- 所有D-03确认字段
- 逾期9天
- 两家担保方
- 三个关键时间节点
- 加入跟踪
- 加入报告
- 查看完整字段

必须保持：

- 字段顺序稳定
- 长担保方可完整换行
- 投资组合`—`不解释为0

## 17.11 WD-10-S1

必须：

- 预填主题和成员公司
- 责任人、截止日期必填
- 未完成时禁用确认
- 创建中防重复提交
- 成功进入跟踪详情
- 失败保留输入

不得改变风险状态。

## 17.12 WD-11

必须展示：

- 出险
- 跟踪中
- 重点跟踪
- 演示数据
- 责任人、期限、频率、最近更新
- 最新进展
- 三条记录
- 查看原资产
- 加入风险报告

“更新”必须真实可用。

## 17.13 WD-11-S1

必须：

- 可选择目标报告
- 可勾选包含内容
- 显示事实摘要
- 至少选择一项
- 成功反馈
- 失败保留选择

## 17.14 WD-AI-01

必须：

- 使用当前页面上下文
- 返回0.60亿元、5户、0.83亿元、7户
- 显示数据日期
- 显示两个确认事项
- 明确AI推断为无
- 可继续追问和关闭

不得：

- 生成预测
- 生成处置建议
- 修改风险状态
- 输出与页面不一致的数字

## 17.15 跨页面数据一致性

同一对象在所有页面中必须一致：

常宁市尚宇高级中学有限公司：

- 0.25亿元
- 医保科技
- 湖南尚宇教育投资集团
- 2026-06-23
- 重大预警

广西百色试验区发展集团有限公司：

- 0.47亿元
- 租赁
- 广西百色城市产业发展集团
- 2026-06-01
- 逾期（本息实质逾期）

## 17.16 浏览器与视口完成条件

所有页面必须：

- 在375、390、393、414、430px宽度无横向溢出
- 中文无乱码
- 图标与文字垂直对齐
- 卡片不重叠
- 图表不裁切
- 底部AI输入不遮挡内容
- 弹层可滚动和关闭
- 控制台无错误与React警告
- HashRouter刷新后页面可访问
- 所有主要按钮有真实行为
- `npm run build`成功

完成标准不是“基本接近”，而是所有关键页面、状态与动线均通过真实浏览器验证。