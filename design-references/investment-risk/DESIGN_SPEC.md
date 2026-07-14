# 投资风险模块 DESIGN_SPEC

> 适用仓库：`patshin/risk-assistant-demo`  
> 参考资产目录：`design-references/investment-risk/`  
> 主设计视口：`390 × 844`  
> 文档用途：作为投资风险模块全量重建的产品、视觉、交互、数据和前端实现规范。

---

## 0. 文档优先级

开发和验收时按以下优先级处理冲突：

1. 本文档
2. `design-references/investment-risk/` 中的高保真参考图
3. 已确认的投资风险系统性产品方案
4. 仓库 `AGENTS.md`
5. 仓库现有全局设计 tokens、应用外壳、公共基础组件和全局 Copilot 基线
6. 旧 `src/pages/InvestmentRiskPage.tsx` 及旧投资风险 mock、样式和交互

旧 `InvestmentRiskPage` 不构成兼容约束。不得为了复用旧页签、旧数据结构、旧 CSS 或旧 AI 卡片而改变本规范。

参考图中的业务分类、页面动线和内容层级是正确的；参考图中可能存在的字体漂移、像素偏差、数值重复、跨页示例数据不一致、标签错位和图表拥挤不应逐像素复刻。实现必须以稳定、统一、可验证为准。

---

## 1. 产品定位

### 1.1 一句话定位

投资风险模块是集团管理层的投资风险判断入口：

> 基于最新可用的复核数据，快速判断集团投资风险是否升温、风险主要来自哪里、是否接近限额，以及哪些事项需要继续跟踪或纳入汇报。

### 1.2 核心用户

1. 集团董事长、总经理等高层管理者
2. 首席风险官或集团风险管理负责人

次要用户：

3. 投资风险、市场风险等专业条线负责人
4. 负责分析、跟踪和报告的风险经理

### 1.3 核心任务

用户进入模块后，应能依次完成：

1. 确认数据周期、数据范围和复核状态
2. 在 10 秒内判断整体风险状态
3. 识别本期最重要的变化
4. 查看变化的关键数据和影响范围
5. 下钻成员公司或资产类别
6. 判断是否需要进一步跟踪或纳入汇报
7. 使用全局 Copilot 对当前对象继续比较、归纳和追问
8. 查看跟踪基线、后续观察指标和汇报草稿

### 1.4 非目标

本轮不得建设或恢复以下旧原型能力：

- 统一投资风险评分
- 固定的“中等偏高”“配置较均衡”等模糊等级
- 最大回撤
- 预期收益
- VaR 95% 旧口径
- 压力测试中心
- 自定义压力情景
- 风险贡献比例
- 久期结构
- 信用评级结构
- 单只股票、债券、基金、产品、发行人或投资项目详情
- 自动调仓或投资配置建议
- 页面内重复的 AI 建议卡片
- 页面内独立聊天入口
- 没有真实行为的按钮或链接
- 将绝对 VaR 数值直接等同于风险严重程度

未来如果获得持仓、组合、发行人、市场事件或交易数据，再单独评估上述能力。

---

## 2. 参考图与实现对象对应关系

参考图应按编号识别。文件名后缀如有轻微差异，以 `INV-UI-XX` 编号为准。

| 编号 | 参考图 | 实现对象 | 路由或状态 | 说明 |
|---|---|---|---|---|
| INV-UI-01 | 首页投资风险入口 | 现有首页的投资风险入口状态 | `/` | 不创建新的首页路由 |
| INV-UI-02 | 投资风险总览首屏 | 投资风险总览的首屏滚动位置 | `/investment` | 与 INV-UI-03 是同一页面 |
| INV-UI-03 | 投资风险总览续页 | 投资风险总览的下半段 | `/investment` | 不得复制 INV-UI-02 中已经出现的内容 |
| INV-UI-04 | 重点变化列表 | 全部投资风险变化列表 | `/investment/changes` | 支持筛选和状态保留 |
| INV-UI-05 | 重点变化筛选弹层 | 列表筛选 Bottom Sheet | `/investment/changes` 的覆盖状态 | 不单独注册路由 |
| INV-UI-06 | 关注事项详情 | 单个重点变化详情 | `/investment/changes/:changeId` | 支持跟踪、汇报和继续追问 |
| INV-UI-07 | VaR 风险首屏 | VaR 风险页首屏 | `/investment/var` | 与 INV-UI-08 是同一页面 |
| INV-UI-08 | VaR 风险续页 | VaR 风险页下半段 | `/investment/var` | 成员公司和风险因子分布 |
| INV-UI-09 | 收益与风险 | 收益专题页 | `/investment/performance` | 当前范围为四家险资公司 |
| INV-UI-10 | 规模与结构 | 投资规模与资产结构页 | `/investment/structure` | 支持成员公司和资产类别下钻 |
| INV-UI-11 | 成员公司详情—养老险 | 通用成员公司详情模板 | `/investment/member/:memberId` | 养老险只是参考实例 |
| INV-UI-12 | 资产类别详情—权益类 | 通用资产类别详情模板 | `/investment/asset/:assetClassId` | 权益类只是参考实例 |
| INV-UI-13 | 全局 Copilot 分析状态 | 全局 Copilot 的投资风险上下文状态 | 覆盖当前路由 | 不创建投资风险专属聊天页面 |
| INV-UI-14 | 加入重点跟踪成功 | 创建跟踪任务后的成功 Bottom Sheet | 覆盖事项详情或 Copilot | 支持进入跟踪详情 |
| INV-UI-15 | 重点跟踪详情 | 投资风险来源的跟踪详情 | `/watch/tracking/:trackingId` | 与现有风险跟踪模块连接 |
| INV-UI-16 | 投资风险汇报预览 | 投资风险汇报草稿和人工确认 | `/report/investment/:draftId` | 确认后进入现有报告流程 |
| INV-UI-17 | 指标范围说明弹层 | 指标范围、数据状态与 VaR 定义 Bottom Sheet | 覆盖总览或指标页 | 不单独注册路由 |

### 2.1 参考图中不属于应用内容的元素

参考图中的系统时间、信号、电量等系统状态栏仅用于展示画布比例，不应在 WebApp 中绘制一套假的操作系统状态栏。

应用页面应使用：

```css
padding-top: max(12px, env(safe-area-inset-top));
```

并沿用现有 `AppShell`、`.phone-shell` 和浏览器安全区行为。

---

## 3. 完整用户流程

### 3.1 主流程

```text
首页
  ↓ 点击“投资风险”
投资风险总览
  ↓ 查看本期需关注
重点变化列表
  ↓ 选择或筛选事项
关注事项详情
  ├─ 查看证据和判断边界
  ├─ 打开全局 Copilot
  ├─ 加入重点跟踪
  │    ↓
  │  跟踪成功
  │    ↓
  │  重点跟踪详情
  └─ 纳入汇报
       ↓
     投资风险汇报预览
       ↓ 人工确认
     进入本期报告
```

### 3.2 专题分析流程

```text
投资风险总览
  ├─ 查看 VaR
  │    ↓
  │  VaR 风险
  │    └─ 成员公司详情
  │
  ├─ 查看收益
  │    ↓
  │  收益与风险
  │    └─ 成员公司详情
  │
  └─ 查看规模
       ↓
     规模与结构
       ├─ 成员公司详情
       └─ 资产类别详情
             └─ 成员公司详情
```

### 3.3 主动提醒流程

首页主动提醒中的投资风险事项应直接进入对应事项详情，例如：

```text
首页主动提醒
  “投资月 CII 收益率转负，建议查看”
       ↓
/investment/changes/cii-monthly-negative
```

进入详情时通过 `location.state.returnTo` 或明确的 fallback 保证返回首页。

### 3.4 返回规则

- 从首页进入总览：返回首页。
- 从总览进入重点变化：返回总览。
- 从列表进入事项详情：返回列表，并保留筛选条件和滚动位置。
- 从 VaR、收益或结构页进入成员公司：返回来源页。
- 从资产类别进入成员公司：返回资产类别。
- 从跟踪成功进入跟踪详情：返回原事项详情。
- 直接访问或刷新详情路由时，返回按钮使用稳定 fallback，而不是依赖空的浏览器历史。

推荐：

```ts
type ReturnState = {
  returnTo?: string;
  returnSearch?: string;
  returnScrollKey?: string;
};
```

---

## 4. 路由规范

项目使用 `HashRouter`，以下路径均为 React Router path，不包含 `#`。

```text
/
├─ /investment
├─ /investment/changes
├─ /investment/changes/:changeId
├─ /investment/var
├─ /investment/performance
├─ /investment/structure
├─ /investment/member/:memberId
├─ /investment/asset/:assetClassId
├─ /watch/tracking/:trackingId
└─ /report/investment/:draftId
```

### 4.1 查询参数

投资风险总览和专题页共享：

```text
period=2026-06
dataStatus=reviewed
compare=previousMonth
```

允许值：

```ts
type InvestmentPeriod = `${number}-${string}`;
type InvestmentDataStatus = "reviewed" | "latest";
type CompareBasis = "previousMonth" | "yearStart";
```

重点变化列表额外支持：

```text
category=all|var|return|scale
level=all|attention|decision|normal
verification=all|confirmed|pending
members=life,pension
tracking=all|untracked|tracking
```

规则：

- URL 是筛选状态的事实来源。
- 返回列表时不得丢失筛选。
- 无效参数回退到默认值，不抛出页面错误。
- 查询参数不得改变未在产品方案中定义的页面结构。

---

## 5. 页面内容规范

---

## 5.1 INV-UI-01：首页投资风险入口

### 页面职责

在集团风险首页中让管理层发现投资风险状态，并进入投资风险模块。

### 内容顺序

沿用现有首页整体顺序：

1. 全局顶部操作
2. 问候
3. 今日风险简报
4. 风险模块入口网格
5. 主动提醒
6. 底部全局 AI 输入

### 投资风险入口卡内容

```text
标题：投资风险
副标题：规模 / 收益 / VaR
状态：需关注
视觉：资产结构环图或简化环形图
```

不得继续使用旧文案：

```text
组合风险 / 压力测试
```

### 主动提醒

默认演示提醒：

```text
投资月 CII 收益率转负，建议查看
```

点击进入：

```text
/investment/changes/cii-monthly-negative
```

### 交互

- 整张投资风险卡可点击。
- 卡片右上角箭头不是单独按钮。
- 主动提醒整行可点击。
- 不在首页增加新的投资风险 AI 入口。

---

## 5.2 INV-UI-02、INV-UI-03：投资风险总览

### 页面职责

在 10 秒内回答：

1. 当前数据是否正式、是什么周期
2. 整体投资风险是否需要关注
3. 最重要的变化是什么
4. VaR 是否仍在限额内
5. 风险主要来自哪些因子和成员公司
6. 可以继续查看什么

### 顶部

```text
标题：投资风险
副标题：截至 2026-06 · 已复核
```

右侧使用统一的信息按钮，打开 INV-UI-17。

标题下方使用两个上下文标签：

```text
较上月
集团视角
```

规则：

- `较上月` 是可交互比较基准按钮，可选择“较上月 / 较年初”。
- `集团视角` 是当前范围标签，不在本期增加复杂的集团/成员公司快速切换器。
- 不要在不同滚动位置把右侧按钮从信息图标变成筛选图标。

### 内容顺序

#### A. 整体风险摘要

内容：

```text
状态：需关注
结论：收益表现转弱，VaR 仍在集团限额内
主要关注：月 CII 收益率转负；养老险 VaR 规模居前
```

关键指标：

```text
集团 VaR：426 亿
限额使用率：53.3%
月 CII：-2.47%
```

辅助数据：

```text
集团 VaR 较上月 -72 亿
集团限额 800 亿
月 CII 较上月 -70bp
```

视觉规则：

- 左侧 5px 橙色强调条。
- 结论比指标更先被看到。
- “需关注”是管理状态，不是 AI 生成标签。
- 绿色只表达“限额内”或有利变化，不表达风险类别。

#### B. 本期需关注

默认演示事项：

1. 月 CII 收益率降至 `-2.47%`
2. 养老险 VaR 规模为 `608 亿元`

第一项：

```text
类别：收益
状态：需关注
标题：月 CII 收益率降至 -2.47%
摘要：较上月下降 70bp，涉及四家险资公司
辅助：年 CII 66.15% · 集团 VaR 426 亿（限额内）
操作：查看证据、加入跟踪
```

第二项：

```text
类别：VaR
状态：待核验
标题：养老险 VaR 规模为 608 亿元
摘要：成员公司中绝对值居前；暂无独立限额，不能直接判定为高风险
操作：查看养老险
```

规则：

- 第二张卡在 INV-UI-02 和 INV-UI-03 中只是滚动位置重叠，不得在 DOM 中重复。
- 首页最多展示 2～3 项。
- 没有关注事项时显示明确空状态，不制造风险。

#### C. 管理摘要

三项并列：

```text
投资规模：25,996 亿
数据范围：集团全部投资
变化：+1.8%

年 CII：66.15%
数据范围：四家险资
变化：+62bp

整体 VaR：426 亿
数据范围：VaR 计量资产
变化：-72 亿
```

每项分别进入：

```text
投资规模 → /investment/structure
年 CII → /investment/performance
整体 VaR → /investment/var
```

三个指标必须明确显示不同的数据范围，不得暗示它们属于完全相同的资产池。

#### D. 主要风险来源

固定顺序：

```text
利率 VaR：451 亿，较上月 -93 亿
权益 VaR：71 亿，较上月 -17 亿
汇率 VaR：3 亿，较上月 -4 亿
```

规则：

- 风险因子 VaR 为独立测算结果，不要求相加等于集团整体 VaR。
- 不得使用“贡献合计”。
- 点击模块进入 `/investment/var`。

#### E. 重点成员公司

默认按当前 VaR 绝对值排序：

```text
1. 养老险：608 亿，绝对值居前
2. 健康险：227 亿，较上月回落
3. 产险：145 亿，保持稳定
```

规则：

- “绝对值居前”不等同于“高风险”。
- 点击成员公司进入 `/investment/member/:memberId`。
- `查看全部`进入 VaR 页面中的完整成员公司分布，而不是创建第二套成员公司列表页。

### 底部 AI 输入

占位文案可根据页面上下文变化：

```text
问本期最重要的投资风险…
比较成员公司、资产类别或生成汇报…
```

点击打开全局 Copilot，并传入当前周期、数据状态和总览上下文。

---

## 5.3 INV-UI-04：重点变化列表

### 页面职责

按管理重要性浏览本期所有投资风险变化。

### 顶部

```text
标题：重点变化
副标题：4 项 · 截至 2026-06
```

### 一级分类

单行横向滚动或等宽 Segmented Control：

```text
全部
VaR
收益
规模
```

默认 `全部`。

### 状态摘要

```text
需关注 2
趋稳 2
```

状态摘要不是筛选器的唯一入口，点击可快速追加状态筛选。

### 默认事项

#### 事项 1

```text
类别：收益
风险等级：需关注
标题：月 CII 收益率转负
主值：-2.47%
说明：较上月 -70bp · 四家险资
```

#### 事项 2

```text
类别：VaR
核验状态：待核验
标题：养老险 VaR 规模居前
主值：608 亿
说明：暂无独立限额，需结合规模判断
```

#### 事项 3

```text
类别：VaR
事件状态：趋稳
标题：集团整体 VaR 回落
主值：426 亿
说明：较上月 -72 亿 · 限额使用率 53.3%
```

#### 事项 4

```text
类别：规模
事件状态：观察
标题：集团投资规模小幅上升
主值：25,996 亿
说明：较上月 +1.8% · 固收占比 54.5%
```

### 排序

默认顺序：

1. 需决策
2. 需关注
3. 待核验
4. 跟踪中
5. 观察
6. 趋稳
7. 已缓解

同级再按：

1. 风险金额或指标绝对变化
2. 变化幅度
3. 涉及成员公司数量
4. 更新时间

不得对用户展示未经业务确认的综合风险分。

### 交互

- 整张事项卡可点击进入详情。
- 只在有明确行为时显示“查看详情”。
- 顶部筛选按钮打开 INV-UI-05。
- 切换分类或筛选后更新 URL。
- 返回页面时恢复筛选和滚动位置。

---

## 5.4 INV-UI-05：重点变化筛选 Bottom Sheet

### 结构

1. 拖拽提示条
2. 标题“筛选重点变化”
3. 关闭按钮
4. 状态
5. 成员公司
6. 内容类型
7. 跟踪状态
8. 固定底部操作

### 筛选项

#### 状态

```text
全部
需关注
待核验
趋稳
观察
```

如数据存在，可增加：

```text
需决策
已缓解
```

#### 成员公司

```text
全部
寿险
产险
养老险
健康险
银行
证券
方正证券
```

#### 内容类型

```text
全部
VaR
收益
规模
```

#### 跟踪状态

```text
全部
未跟踪
跟踪中
```

### 选择规则

- 状态：单选
- 内容类型：单选
- 跟踪状态：单选
- 成员公司：可多选
- 选择结果立即在底部按钮显示：

```text
查看 2 项结果
```

### 底部操作

```text
重置
查看 N 项结果
```

### 交互要求

- 打开时锁定背景滚动。
- 弹层内容过高时，只有弹层内部滚动。
- 底部操作始终可见。
- 关闭但未应用时恢复原筛选。
- 应用后更新 URL 并关闭弹层。
- 支持点击遮罩和关闭按钮关闭。
- 必须具有焦点管理和可访问名称。

---

## 5.5 INV-UI-06：关注事项详情

### 页面职责

完整展示一个变化事项的结论、证据、影响范围、判断边界和可执行动作。

### 顶部

```text
标题：关注事项
副标题：收益变化 · 2026-06 已复核
```

### 内容顺序

#### A. 事项结论

```text
风险等级：需关注
类别：收益
标题：月 CII 收益率降至 -2.47%
摘要：较上月下降 70bp，影响范围为集团四家险资公司
```

#### B. 关键证据

```text
月 CII 额：8,859 亿，较上月 +5,291 亿
月 CII 收益率：-2.47%，较上月 -70bp
年 CII：66.15%，较上月 +62bp
```

下方使用一条简化趋势线。

规则：

- 趋势线最后一点必须与 `-2.47%` 一致。
- 前一比较点必须与 `-70bp` 的变化关系一致。
- 图表没有足够历史点时不得伪造复杂走势。

#### C. 影响范围

四家险资公司：

```text
寿险：39.15%
产险：82.62%
养老险：75.43%
健康险：57.84%
```

成员公司项可点击进入对应成员公司详情。

#### D. 判断边界

分成两条：

```text
已知结论：
本月收益表现转弱；集团整体 VaR 仍在限额内。

当前无法确认：
现有汇总数据不足以判断由持仓调整还是市场价格变化导致。
```

规则：

- “已知结论”使用绿色文本或图标，但不是“风险已解决”。
- “当前无法确认”使用橙色或黄色，不得被写成确定事实。
- 不得让 AI 自动补全具体原因。

### 固定底部操作

```text
加入跟踪
纳入汇报
继续追问
```

行为：

- `加入跟踪` → INV-UI-14
- `纳入汇报` → INV-UI-16
- `继续追问` → INV-UI-13

底部栏必须为页面内容预留安全间距，不得遮挡“判断边界”。

---

## 5.6 INV-UI-07、INV-UI-08：VaR 风险

### 页面职责

回答：

1. 集团当前 VaR 是多少
2. 与集团限额相比还有多少空间
3. VaR 是上升还是回落
4. 主要风险因子是什么
5. 哪些成员公司的绝对 VaR 居前
6. 不同成员公司风险因子如何分布

### 顶部

```text
标题：VaR 风险
副标题：VaR 计量资产 · 2026-06 已复核
```

右侧信息按钮打开 VaR 范围和定义说明。

### 内容顺序

#### A. 集团整体 VaR

```text
集团整体 VaR：426 亿
集团限额：800 亿
限额使用率：53.3%
较上月：-72 亿
剩余额度：374 亿
状态：限额内
```

关系必须由数据计算：

```ts
limitUsage = totalVar / groupLimit;
remainingLimit = groupLimit - totalVar;
```

不得分别硬编码三个不一致的数字。

#### B. 近 6 个月趋势

图表：

- 当前 VaR 面积或折线
- 集团限额虚线
- 6 个月横轴
- 最后一点突出显示

规则：

- 最后一点必须是 `426 亿`。
- 前一个月必须支持“较上月 -72 亿”的结论。
- 集团限额线固定为 `800 亿`。
- 图表不得通过缩窄 Y 轴夸大轻微变化。
- 图表需有无障碍摘要。

#### C. 风险因子

```text
利率 VaR：451 亿，较上月 -93 亿
权益 VaR：71 亿，较上月 -17 亿
汇率 VaR：3 亿，较上月 -4 亿
```

颜色固定：

- 利率：橙
- 权益：蓝
- 汇率：紫

说明：

- 风险因子 VaR 是独立测算。
- 不应强制相加得到集团整体 VaR。
- 不显示未经确认的“贡献比例”。

#### D. 成员公司 VaR 规模

默认排序：

```text
养老险：608 亿，较上月 +46 亿
健康险：227 亿，较上月 -18 亿
产险：145 亿，较上月 -12 亿
寿险：121 亿，较上月 +8 亿
方正证券：4 亿，较上月 0
证券：3 亿，较上月 0
```

规则：

- 数值编码为条形长度。
- 非零最小条长度为 4px，零值显示空轨道或圆点。
- 条形只表达绝对值大小，不表达是否超限。
- 没有成员公司独立限额时，不显示“高风险”。
- 点击成员公司进入详情。

#### E. 风险因子分布

以四家险资公司为主要移动矩阵：

| 成员公司 | 利率 | 权益 | 汇率 |
|---|---:|---:|---:|
| 养老险 | 768 | 622 | 864 |
| 健康险 | 294 | 291 | 192 |
| 产险 | 197 | 112 | 194 |
| 寿险 | 377 | 265 | 562 |

规则：

- 单位统一为亿元。
- 色阶表达该行或该矩阵中的数值强弱，不表达风险等级。
- 图例必须标注“VaR 数值大小”。
- 不使用绿色代表安全、红色代表危险的误导性语义。
- 每个单元格必须显示数字。
- 不在 390px 内强行塞入 7 个成员公司列。
- 证券主体可在矩阵下方使用第二组紧凑表格，或仅在排行中展示。
- 具体布局不得横向溢出。

#### F. 数据范围提示

```text
不同成员公司的 VaR 纳入资产范围存在差异。
查看 VaR 定义与口径
```

点击打开指标说明 Bottom Sheet。

---

## 5.7 INV-UI-09：收益与风险

### 页面职责

回答：

1. 当前收益表现如何
2. 哪些险资公司收益率较高或变化较大
3. 当前月度收益转弱是否同时伴随整体 VaR 上升
4. 当前数据可以和不可以得出哪些结论

### 顶部

```text
标题：收益与风险
副标题：四家险资 · 2026-06 已复核
```

### 内容顺序

#### A. 年 CII 收益率

```text
年 CII 收益率：66.15%
较上月：+62bp
年 CII 额：14,550 亿
月 CII 收益率：-2.47%
月 CII 较上月：-70bp
```

#### B. 关注提示

```text
本月收益转负，建议持续观察
集团整体 VaR 同期回落，暂无超限信号
```

提示是基于确定指标的规则化结论，不增加原因推断。

#### C. 成员公司年 CII 收益率

```text
产险：82.62%，+78bp
养老险：75.43%，+69bp
健康险：57.84%，+54bp
寿险：39.15%，+35bp
```

规则：

- 默认按当前收益率或变化幅度排序，在数据模型中明确排序字段。
- 成员公司行可点击进入详情。
- 如果所有成员公司已经完整显示，不渲染无实际目标的“查看详情”空按钮。
- 不得默认跳到某一家成员公司。

#### D. 收益与风险对照

```text
月 CII 收益率：-2.47%，较上月 -70bp
整体 VaR：426 亿，较上月 -72 亿
```

底部说明：

```text
当前只能确认收益转弱、VaR 回落；不可据此推断具体原因。
```

只有数据范围可比较时才形成并列结论；页面必须显示：

```text
收益范围：四家险资
VaR 范围：VaR 计量资产
```

---

## 5.8 INV-UI-10：规模与结构

### 页面职责

回答：

1. 集团投资总规模是多少
2. 固收、权益、另类和其他资产分别有多少
3. 哪些成员公司的投资规模最大
4. 可以从资产类别或成员公司继续下钻到哪里

### 顶部

```text
标题：规模与结构
副标题：集团全部投资 · 2026-06 已复核
```

### 内容顺序

#### A. 集团投资规模

```text
集团投资规模：25,996 亿
较上月：+1.8%
较年初：+8.6%
```

#### B. 资产类别结构

```text
固收：14,160 亿，54.5%
权益：4,307 亿，16.6%
另类：2,557 亿，9.8%
其他：4,972 亿，19.1%
```

关系必须由同一数据源计算：

```ts
share = amount / groupInvestmentScale;
```

所有分项金额之和必须等于集团投资规模。

“其他”是当前演示中的临时业务名称，页面需保留说明：

```text
“其他”用于补齐总规模，正式名称待业务口径确认。
```

不得把“其他”隐藏后仍绘制一个合计为 100% 的环图。

#### C. 成员公司规模分布

成员公司排序示例：

```text
银行
寿险
养老险
产险
健康险
证券
方正证券
```

规则：

- 参考图中的成员公司数值可能存在跨页示例错位。
- 实现必须使用一份 canonical mock 数据。
- 成员公司总额与集团总规模如声明为同一范围，应可勾稽。
- 如果 mock 数据暂时不是完整勾稽口径，必须显式给数据集增加不同 `scopeId`，不得假装属于同一范围。
- 每行可点击进入成员公司详情。
- 资产类别图例项可点击进入资产类别详情。
- 不渲染没有明确行为的“筛选资产类别”装饰性链接。

---

## 5.9 INV-UI-11：成员公司详情

### 页面职责

回答：

1. 单个成员公司的投资规模、收益和 VaR 是多少
2. 资产结构如何
3. 风险主要体现在哪些 VaR 因子
4. 与集团相比处于什么位置
5. 哪些判断仍受数据范围限制

### 通用路由

```text
/investment/member/:memberId
```

参考实例为：

```text
memberId=pension
标题：养老险
```

### 顶部

```text
标题：养老险
副标题：成员公司详情 · 2026-06 已复核
```

### 内容顺序

#### A. 成员公司摘要

状态：

```text
需关注
VaR 规模居前
```

核心指标：

```text
投资规模
整体 VaR
年 CII 收益率
```

参考实例：

```text
投资规模：3,914 亿
整体 VaR：608 亿
年 CII 收益率：75.43%
```

结论：

```text
VaR 绝对值居前，但集团尚未提供成员公司独立限额。
```

#### B. 资产结构

使用成员公司的资产金额计算占比。

规则：

- 不硬编码百分比。
- 参考图中“养老险总规模 3,914 亿”“资产结构 52/31/17”与权益类详情中的养老险权益金额可能无法同时成立。
- 实现必须选择一份 canonical mock 数据并从金额派生占比。
- 成员详情和资产类别详情中，同一成员公司、同一资产类别、同一周期的数据必须一致。
- 不得为了复制参考图而保留算术矛盾。

#### C. VaR 风险因子

示例：

```text
利率 VaR：768 亿
权益 VaR：622 亿
汇率 VaR：864 亿
```

说明：

```text
各因子 VaR 为独立测算，不能直接相加。
```

#### D. 与集团对比

示例维度：

```text
规模占比
VaR 规模排名
CII 高于或低于集团
```

不得计算或展示未经确认的综合风险排名。

### 底部 AI 输入

示例：

```text
比较养老险与集团、解释 VaR 差异…
```

---

## 5.10 INV-UI-12：资产类别详情

### 页面职责

回答：

1. 单个资产类别在集团中的规模和占比
2. 哪些成员公司持有该资产类别
3. 该资产类别的收益和 VaR 表现
4. 当前能得出什么观察结论
5. 哪些原因无法由现有汇总数据确认

### 通用路由

```text
/investment/asset/:assetClassId
```

参考实例：

```text
assetClassId=equity
标题：权益类
```

### 顶部

```text
标题：权益类
副标题：资产类别详情 · 2026-06 已复核
```

### 内容顺序

#### A. 资产类别摘要

```text
集团权益投资规模：4,307 亿
集团投资占比：16.6%
权益 VaR：71 亿
权益 VaR 较上月：-17 亿
```

#### B. 成员公司分布

参考数据：

```text
养老险：1,801 亿
寿险：809 亿
产险：805 亿
健康险：613 亿
证券：214 亿
方正证券：65 亿
```

参考数据之和为 `4,307 亿`。

规则：

- 该分布和集团权益规模必须严格相等。
- 每行可点击进入成员公司详情。
- 如果 canonical 数据调整，所有相关页面同时更新。

#### C. 收益与风险

```text
权益年收益率：26.91%
较上年同期：+1,314bp
权益 VaR：71 亿
较上月：-17 亿
```

#### D. 观察结论

```text
权益规模集中在养老险，收益改善且 VaR 回落。
```

限制：

```text
现有数据未显示需要管理层立即处置的信号。
```

不应进一步推断具体市场、行业或持仓原因。

---

## 5.11 INV-UI-13：全局 Copilot 投资风险状态

### 定位

复用全局 Copilot，不创建页面内独立 AI。

### 打开上下文

Copilot 至少接收：

```ts
interface InvestmentCopilotContext {
  module: "investment-risk";
  route: string;
  snapshotId: string;
  period: string;
  dataStatus: InvestmentDataStatus;
  compareBasis: CompareBasis;
  changeId?: string;
  memberId?: InvestmentMemberId;
  assetClassId?: InvestmentAssetClassId;
  metricIds: string[];
}
```

### 参考状态内容

用户问题：

```text
本期最重要的投资风险是什么？
```

结论：

```text
本期主要关注月 CII 收益率转负。
集团整体 VaR 为 426 亿元，限额使用率 53.3%，仍在限额内。
```

关键证据：

```text
月 CII 收益率：-2.47%，较上月 -70bp
集团整体 VaR：426 亿，限额 800 亿
养老险 VaR：608 亿，绝对值居前
```

不确定性：

```text
缺少持仓与市场变动明细，暂不能判断收益下降的具体原因。
```

操作：

```text
加入跟踪
生成汇报
查看养老险
```

### AI 表达规则

AI 输出必须明确区分：

- 原始业务事实
- 规则计算结果
- AI 归纳
- 不确定性
- 建议动作
- 人工确认状态

禁止：

- 将持仓变化或市场原因写成确定事实
- 自动生成调仓建议
- 自动生成投资决策
- 使用与当前页面无关的地产链、授信或信用客户证据
- 在每个普通卡片上添加 AI 标识

### Copilot 状态

需要支持：

```text
关闭
加载中
完成
错误
继续追问
```

加载中必须显示真实的等待状态，不能先展示固定答案。

---

## 5.12 INV-UI-14：加入重点跟踪成功

### 触发

从关注事项详情或 Copilot 点击“加入跟踪”。

### 内容

```text
标题：已加入重点跟踪
说明：跟踪事项绑定本期数据快照

跟踪主题：月 CII 收益率转负
当前基线：-2.47% · 较上月 -70bp
下次更新：下一期复核数据发布
状态：待确认
```

### 操作

```text
完成
查看跟踪事项
```

行为：

- `完成`关闭弹层，返回原页面。
- `查看跟踪事项`进入 `/watch/tracking/:trackingId`。
- 重复加入同一事项时不得创建重复任务，应显示“已在跟踪中”。

---

## 5.13 INV-UI-15：重点跟踪详情

### 顶部

```text
标题：重点跟踪
副标题：来源：投资风险 · 2026-06
```

### 内容顺序

#### A. 跟踪主题

```text
状态：跟踪中
标题：月 CII 收益率转负
说明：已跟踪 1 天，下一期复核数据发布后自动更新
```

#### B. 当前基线

```text
月 CII：-2.47%，-70bp
年 CII：66.15%，+62bp
集团 VaR：426 亿，限额内
```

#### C. 下一观察指标

```text
月 CII 收益率：下一期是否回正
年 CII 收益率：是否继续改善
集团整体 VaR：是否保持限额内
```

#### D. 跟踪记录

示例：

```text
07-13 已加入重点跟踪
07-31 等待下一期复核数据
```

#### E. 汇报连接

```text
已同步到本期投资风险汇报素材
```

点击进入对应汇报草稿。

### 状态

支持：

```text
待确认
跟踪中
升温
趋稳
已缓解
已关闭
```

这些状态是跟踪状态，不得复用风险类别颜色。

---

## 5.14 INV-UI-16：投资风险汇报预览

### 顶部

```text
标题：投资风险汇报
副标题：AI 草稿 · 待人工确认
```

### 内容顺序

#### A. 一句话汇报口径

```text
本月集团投资收益表现转弱，月 CII 收益率降至 -2.47%；
集团整体 VaR 为 426 亿元，限额使用率 53.3%，仍在限额内。
```

证据周期：

```text
数据：2026-06 已复核
```

#### B. 关键事实

```text
1. 月 CII 收益率：-2.47%，较上月 -70bp
2. 集团整体 VaR：426 亿，限额 800 亿
3. 养老险 VaR：608 亿，绝对值居前，待结合限额判断
```

#### C. 管理建议

只允许已确认方案中的管理动作：

```text
持续观察下一期月 CII 收益率是否回正。
补充养老险 VaR 独立限额或规模口径后再判断风险等级。
将收益变化与 VaR 变化纳入下一期跟踪更新。
```

不得出现：

- 降低权益仓位
- 缩短久期
- 调整具体资产配置
- 买卖任何投资品种

#### D. 证据来源

```text
投资风险看板 · 2026-06 · 已复核数据
指标范围：四家险资 / VaR 计量资产
```

### 固定底部操作

```text
确认纳入本期汇报
继续追问
```

规则：

- 确认前必须保留“AI 草稿 · 待人工确认”。
- 确认后保存状态并跳转到现有报告流程或显示成功反馈。
- 不得把 AI 草稿自动视为正式报告。

---

## 5.15 INV-UI-17：指标范围与数据状态 Bottom Sheet

### 触发

- 投资风险总览信息按钮
- VaR 页信息按钮
- 收益页信息按钮
- 规模页信息按钮

### 总览版本内容

#### 投资规模

```text
值：25,996 亿
数据范围：集团全部投资
周期：2026-06
状态：已复核
```

#### CII 收益

```text
值：66.15%
数据范围：四家险资公司
周期：2026-06
状态：已复核
```

#### 整体 VaR

```text
值：426 亿
数据范围：VaR 计量资产
周期：2026-06
状态：已复核
```

提示：

```text
不同指标的数据范围不同，不应直接将规模、收益和 VaR 视为同一资产池。
```

#### VaR 定义

默认折叠，点击“展开”显示：

```text
VaR 指投资组合未来一年在 10 天内 99% 不会超过的损失。
```

并显示范围说明：

```text
覆盖固收、权益、另类及金融衍生品。
不同成员公司的纳入资产范围存在差异。
```

---

## 6. 视觉系统

---

## 6.1 颜色

优先复用仓库现有 tokens。允许在投资风险样式文件中增加语义别名，但不得复制一套互相冲突的颜色系统。

### 基础颜色

```css
--investment-bg: var(--color-bg);                 /* #fff7ec */
--investment-bg-soft: var(--color-bg-soft);       /* #fdf7ef */
--investment-surface: var(--color-surface);       /* #ffffff */
--investment-surface-warm: var(--color-surface-warm); /* #fffcf7 */
--investment-text: var(--color-text);             /* #1f1b16 */
--investment-text-soft: var(--color-text-soft);   /* #7a7168 */
--investment-text-muted: var(--color-text-muted); /* #9a8f84 */
--investment-border: var(--color-border);         /* #f3e3d1 */
--investment-primary: var(--color-orange);        /* #ff6a00 */
--investment-primary-strong: var(--color-orange-strong);
--investment-primary-soft: var(--color-orange-soft);
--investment-primary-softer: var(--color-orange-softer);
--investment-success: var(--color-success);
--investment-warning: var(--color-warning);
--investment-danger: var(--color-danger);
```

### 图表颜色

```css
--investment-chart-interest: #ff6a00;
--investment-chart-equity: #4f94bd;
--investment-chart-fx: #8064b1;
--investment-chart-alternative: #8eb984;
--investment-chart-other: #d4c3ab;
--investment-chart-track: #f4e6d7;
```

### 类别标签

```text
VaR：蓝色浅底
收益：紫色浅底
规模：暖灰浅底
```

类别颜色只表达内容类型，不表达风险等级。

### 风险等级

```text
正常：绿色
需关注：橙色
需决策：危险红橙
```

### 核验状态

```text
已确认：绿色或中性
待核验：黄色
```

### 跟踪状态

```text
未跟踪：暖灰描边
待确认：黄色
跟踪中：橙色
升温：危险红橙
趋稳：绿色浅底
已缓解：绿色
已关闭：灰色
```

### 重要规则

不得只依赖颜色表达状态。所有状态必须同时有文字、图标或数值方向。

---

## 6.2 字体

不增加字体依赖。沿用：

```css
font-family:
  "Avenir Next",
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  sans-serif;
```

### 字号体系

| 用途 | 字号 | 行高 | 字重 |
|---|---:|---:|---:|
| 页面标题 | 22px | 1.22 | 700 |
| 页面主结论 | 20px | 1.38 | 700 |
| 区块标题 | 18px | 1.32 | 700 |
| 卡片标题 | 16px | 1.42 | 700 |
| 正文 | 14px | 1.55 | 500 |
| 强调正文 | 15px | 1.5 | 650 |
| 次级文字 | 13px | 1.45 | 500 |
| 标签与说明 | 12px | 1.4 | 650 |
| 图表微标签 | 11px | 1.35 | 500 |
| 主指标 | 32～38px | 1.05 | 750 |
| 二级指标 | 22～28px | 1.1 | 700 |
| 按钮 | 14px | 1 | 650 |

使用：

```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" 1, "lnum" 1;
```

数字规则：

- 大数字允许 `letter-spacing: -0.02em`
- 中文正文 `letter-spacing: 0`
- 不得通过压缩字体宽度解决溢出
- 不得把核心数字字号降到 20px 以下
- 超长金额应优先调整单位，而不是截断数字

---

## 6.3 数字格式

### 金额

```text
426 亿
25,996 亿
```

使用千分位和不换行空格：

```ts
"25,996\u00A0亿"
```

### 百分比

```text
53.3%
-2.47%
66.15%
```

### 基点

```text
+62bp
-70bp
```

### 变化值

必须同时携带：

```ts
direction: "up" | "down" | "flat";
impact: "favorable" | "adverse" | "neutral";
```

不能简单认为：

- 正数一定绿色
- 负数一定红色

例如：

- VaR 下降：负数，但属于有利变化
- 收益率下降：负数，属于不利变化
- 投资规模上升：正数，但默认中性观察

---

## 6.4 页面布局

### 主视口

```text
390 × 844
```

### 页面宽度

```css
width: 100%;
max-width: 430px;
```

### 水平边距

```text
16px
```

### 顶部安全区

```css
padding-top: max(12px, env(safe-area-inset-top));
```

### 底部安全区

普通页面：

```css
padding-bottom: calc(96px + env(safe-area-inset-bottom));
```

有固定操作栏页面：

```css
padding-bottom: calc(104px + env(safe-area-inset-bottom));
```

### 间距体系

```text
4 / 8 / 10 / 12 / 16 / 20 / 24 / 32
```

推荐：

- 页面区块间距：24px
- 卡片间距：12px
- 卡片内元素间距：8～16px
- 页面标题与首卡：12px
- 区块标题与内容：10px

### 滚动

- 页面使用单一纵向文档滚动。
- 不嵌套独立卡片滚动。
- Bottom Sheet 可拥有自己的内部滚动。
- 禁止整页横向滚动。
- 横向 Segmented Control 允许自身横向滚动且隐藏滚动条。
- INV-UI-02/03、INV-UI-07/08 是同一页面的连续滚动，不是两个组件副本。

---

## 6.5 页面头部

建议复用或扩展现有 `PageHeader`。

结构：

```text
44px 返回按钮 | 自适应居中标题 | 44px 右侧操作
```

规则：

- 返回按钮和右侧按钮最小点击区域 44×44。
- 标题最多一行，超长时省略。
- 副标题位于标题下方，不挤压左右按钮。
- 头部建议 sticky。
- sticky 背景使用从高不透明暖色到透明的渐变。
- 同一页面滚动过程中右侧操作图标不得变化。

---

## 6.6 卡片

### 标准卡片

```css
border: 1px solid rgba(243, 227, 209, 0.9);
border-radius: 20px;
padding: 16px;
background: rgba(255, 252, 247, 0.94);
box-shadow: var(--shadow-card);
```

### 主结论卡

```text
圆角：22px
内边距：16px
左侧强调线：5px
最小高度：190px
```

内容增加时允许纵向增长，不固定高度。

### 重点事项卡

```text
最小高度：128px
内边距：16px
```

列表摘要最多两行；详情页不得截断。

### 指标小卡

```text
最小高度：104px
内边距：14px
```

### 列表行

```text
最小高度：56px
复杂行最小高度：72px
```

### 稳定性

- 图表区域必须预留固定高度，避免加载后布局跳动。
- 卡片不得使用绝对定位承载主要文字。
- 不使用硬编码固定高度截断动态中文。
- `min-height` 优先于 `height`。
- 列表卡标题和主值之间使用 Grid，主值不得被长标题挤出屏幕。

---

## 6.7 标签

### 类别标签

```text
VaR
收益
规模
```

仅表示内容类型。

### 风险等级标签

```text
正常
需关注
需决策
```

### 核验标签

```text
已确认
待核验
```

### 事件趋势标签

```text
升温
趋稳
观察
```

### 跟踪标签

```text
未跟踪
待确认
跟踪中
已缓解
已关闭
```

这些标签应使用独立组件属性，不得把所有语义塞入一个自由字符串 variant。

推荐：

```ts
<CategoryBadge category="var" />
<RiskLevelBadge level="attention" />
<VerificationBadge state="pending" />
<TrackingStatusBadge status="tracking" />
```

---

## 6.8 按钮

### 主按钮

- 橙色实心
- 高度 48px
- 圆角 999px
- 用于“查看结果”“加入跟踪”“确认纳入本期汇报”

### 次按钮

- 橙色描边或暖色浅底
- 高度 44～48px

### 文本按钮

- 只用于低优先级导航
- 必须具有真实目标
- 不得保留无行为的“查看详情”

### 按钮文字

- 默认单行
- 不允许英文和中文挤成两行
- 最小水平 padding 16px
- 三按钮固定栏可使用等宽 Grid
- 375px 下文字仍不得裁切

---

## 6.9 底部 AI 输入

复用现有 `BottomAskBar` 和全局 Copilot。

布局：

```text
输入区 1fr + 48px 圆形加号按钮
```

要求：

- 固定在 `.phone-shell` 底部，而非视口外层。
- 左右 16px。
- 不遮挡页面最后内容。
- 输入占位文案随页面上下文变化。
- 加号按钮继续保持全局行为，不增加投资风险私有悬浮菜单。
- 页面打开 Bottom Sheet 或 Copilot 时隐藏或被遮罩覆盖。
- Report Preview 的固定确认操作替代 AI 输入。

---

## 6.10 Bottom Sheet

适用于：

- 重点变化筛选
- 指标范围说明
- 加入跟踪成功
- 全局 Copilot

规范：

```text
顶部圆角：28px
最大高度：88dvh
最小高度：按内容
顶部拖拽条：36×5px
内边距：20～24px
```

要求：

- 背景遮罩 `rgba(31, 27, 22, 0.38)`。
- 锁定背景滚动。
- 支持 Esc、遮罩、关闭按钮。
- 打开时聚焦标题或首个控件。
- 关闭后恢复触发控件焦点。
- 内容滚动和底部操作分离。
- 不要求实现真实拖拽手势，但拖拽条可作为视觉提示。

---

## 7. 溢出与动态内容规则

### 7.1 页面标题

- 单行
- `text-overflow: ellipsis`
- 不允许挤压返回按钮和右侧操作

### 7.2 卡片标题

列表卡：

```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

详情页：

- 不截断
- 允许自然换行

### 7.3 成员公司和资产名称

- 列表中最多两行
- 图表轴标签优先一行
- 超长名称使用省略号，并提供 `title` 或可访问全称
- 不允许缩小到 10px 以下

### 7.4 指标

- 数字与单位不可拆行
- 主指标使用 `white-space: nowrap`
- 三列指标中，长值使用 `clamp(26px, 7vw, 36px)`
- 超大金额优先切换为“万亿”格式
- 百分比保留最多两位小数
- 变化值和主值不得重叠

### 7.5 标签

- 单个标签不换行
- 筛选标签可在容器内换行
- 顶部一级分类保持单行横向滚动
- 不允许标签把卡片主标题挤到不可读区域

---

## 8. 图表规范

所有图表使用响应式 SVG、CSS 或现有无依赖组件实现。不得引入图表库，除非事先获得批准。

---

## 8.1 总览风险来源条形图

输入：

```ts
interface FactorBarDatum {
  factor: InvestmentVarFactorId;
  label: string;
  value: number | null;
  unit: "亿元";
  delta: number | null;
}
```

尺寸：

```text
容器高度：126～142px
单行：34～40px
条形高度：6px
```

规则：

- 条长按本列表最大值归一化。
- 非零最短 4px。
- 数值放右侧。
- 变化放在数值下方或旁侧。
- 颜色使用固定因子色。
- 不显示无意义坐标轴。

---

## 8.2 关键证据微趋势

输入：

```ts
interface TimeSeriesPoint {
  period: string;
  value: number | null;
}
```

尺寸：

```text
高度：52～64px
```

规则：

- 只展示走势，不显示密集轴标签。
- 最后一点必须与主指标一致。
- 单点数据只显示一个点和“仅有一期数据”。
- 空数据显示“暂无趋势数据”。
- 不对 null 值使用 0 补齐。

---

## 8.3 VaR 限额仪表

输入：

```ts
interface VarLimitMetric {
  value: number;
  limit: number;
}
```

计算：

```ts
usage = Math.min(Math.max(value / limit, 0), 1);
remaining = Math.max(limit - value, 0);
```

尺寸：

```text
SVG：124×88px
轨道宽度：12px
```

规则：

- 使用半环。
- 中心显示 `53.3%`。
- 下方显示“限额使用率”。
- 超过 100% 时仍显示实际百分比，视觉弧线封顶，并用“已超限”文本补充。
- `limit <= 0` 时不绘制比例，显示“限额未配置”。

---

## 8.4 VaR 六个月趋势

输入：

```ts
interface VarTrendPoint {
  period: string;
  value: number | null;
  limit: number | null;
}
```

尺寸：

```text
图表高度：178～196px
绘图区高度：128～144px
```

规则：

- 当前 VaR 使用橙色折线或面积。
- 集团限额使用橙红虚线。
- 最后一点明确标记。
- 横轴最多 6 个点。
- Y 轴可省略刻度，但必须保留单位和范围的可访问说明。
- Y 轴底部应包含 0 或合理基线，避免夸大。
- 空数据、单点和极值均有专门状态。
- 图表容器固定最小高度，避免布局抖动。

---

## 8.5 成员公司 VaR 排行

输入：

```ts
interface MemberVarDatum {
  memberId: InvestmentMemberId;
  value: number | null;
  delta: number | null;
}
```

尺寸：

```text
每行 42～46px
标签列 64px
数值列 58px
```

规则：

- 条形根据最大值归一化。
- 主值不参与条形区域布局计算，避免被覆盖。
- 正向或负向变化根据业务影响显示颜色。
- 0 和无数据严格区分。
- 点击整行进入成员公司详情。

---

## 8.6 VaR 风险因子矩阵

输入：

```ts
interface MemberVarFactorDatum {
  memberId: InvestmentMemberId;
  interestRate: number | null;
  equity: number | null;
  fx: number | null;
}
```

布局：

```text
第一列：成员公司
后续三列：利率 / 权益 / 汇率
```

规则：

- 390px 下最多显示 4～5 个成员公司行，不限制行数。
- 每个数值单元格至少 44×32px。
- 色阶按数值强弱计算。
- 色阶不等于风险等级。
- 提供文本图例。
- 不允许单元格数字被截断。
- null 显示 `—`，不参与色阶计算。
- 极值不应造成文字对比不足。

---

## 8.7 CII 成员公司横向条形图

输入：

```ts
interface MemberReturnDatum {
  memberId: InvestmentMemberId;
  value: number | null;
  deltaBp: number | null;
}
```

规则：

- 条形值为当前收益率。
- 变化值独立显示。
- 负收益率不绘制负向溢出条；使用零基线或明确负值状态。
- 如果全为负数，图表使用可解释的范围，不隐藏负号。
- 行可点击。

---

## 8.8 资产结构环图

输入：

```ts
interface AssetAllocationDatum {
  assetClassId: InvestmentAssetClassId;
  amount: number;
}
```

尺寸：

```text
390px：132～140px
430px：144～152px
```

规则：

- 中心显示总额。
- 图例显示资产类别、金额和占比。
- 分项金额必须与中心总额一致。
- 占比由金额计算，不硬编码。
- 资产类别图例可点击。
- 不允许图例与环图在 375px 下互相挤压。
- 375px 下推荐 132px 环图 + 自适应图例。
- 320～374px 可改为环图居中、图例下置。

---

## 8.9 成员公司资产分布

规则同成员公司 VaR 排行，但条形表达投资规模，不使用风险状态色。

---

## 9. 页面状态

---

## 9.1 加载

### 页面级加载

- 显示页面头部。
- 卡片使用与最终布局相同的 Skeleton。
- 图表预留固定高度。
- 不使用旋转图标占据整个页面。

### 局部加载

- 某个专题数据加载时，只替换该区块。
- 其他已经成功的数据仍可查看。

---

## 9.2 无数据

### 指标无数据

显示：

```text
—
暂无复核数据
```

不得显示：

```text
0
```

除非数据明确为真实零。

### 趋势无数据

显示：

```text
暂无趋势数据
当前仅有本期数据
```

### 重点变化为空

显示：

```text
本期未发现需要管理层处理的重大变化
可继续查看 VaR、收益和规模详情
```

### 筛选无结果

显示：

```text
没有符合当前筛选条件的变化
```

操作：

```text
重置筛选
```

---

## 9.3 错误

### 区块错误

```text
数据加载失败
重新加载
```

### 页面错误

保留返回按钮，并显示：

```text
暂时无法获取投资风险数据
```

所有重试按钮必须真实触发重新加载。

---

## 9.4 操作反馈

- 加入跟踪：使用 INV-UI-14 成功 Bottom Sheet。
- 已经跟踪：显示“已在跟踪中”，提供“查看跟踪事项”。
- 纳入汇报：显示成功 Toast 或进入汇报预览。
- 确认汇报：按钮变为“已纳入本期汇报”或跳转现有报告页。
- 失败操作：显示明确错误，不假装成功。
- 反馈区域使用 `aria-live="polite"`。

---

## 10. 响应式规范

必须验证：

```text
375 × 812
390 × 844
393 × 852
430 × 932
```

同时不破坏项目现有 `320px` 最小宽度。

### 10.1 375～393px

- 使用 16px 页面边距。
- 三项指标允许三列，但每列必须 `min-width: 0`。
- 主指标字号使用 `clamp()`。
- 图例和标签不得超过内容宽度。
- 固定底部三按钮使用等宽 Grid，按钮文字保持单行。

### 10.2 430px

- 不切换为桌面双栏看板。
- 仍保持单列管理流程。
- 允许图表和卡片获得更宽绘图区。
- 内容最大宽度不超过 `.phone-shell`。

### 10.3 320～374px

- 三列指标必要时改为一主两次的布局，或纵向堆叠。
- 环图与图例可改为上下布局。
- 不允许字体小于规范最小字号。
- 不允许页面横向滚动。

### 10.4 安全区

底部 AI 输入、固定操作栏、Bottom Sheet footer 均使用：

```css
padding-bottom: max(12px, env(safe-area-inset-bottom));
```

---

## 11. 组件清单与推荐边界

建议目录：

```text
src/
├─ pages/
│  └─ investment/
│     ├─ InvestmentRiskOverviewPage.tsx
│     ├─ InvestmentChangesPage.tsx
│     ├─ InvestmentChangeDetailPage.tsx
│     ├─ InvestmentVarPage.tsx
│     ├─ InvestmentPerformancePage.tsx
│     ├─ InvestmentStructurePage.tsx
│     ├─ InvestmentMemberDetailPage.tsx
│     ├─ InvestmentAssetClassDetailPage.tsx
│     ├─ InvestmentTrackingDetailPage.tsx
│     └─ InvestmentReportPreviewPage.tsx
│
├─ components/
│  └─ investment/
│     ├─ InvestmentPageLayout.tsx
│     ├─ InvestmentPageHeader.tsx
│     ├─ InvestmentBadges.tsx
│     ├─ InvestmentMetric.tsx
│     ├─ InvestmentRiskSummaryCard.tsx
│     ├─ InvestmentAttentionCard.tsx
│     ├─ InvestmentChangeCard.tsx
│     ├─ InvestmentFilterSheet.tsx
│     ├─ InvestmentScopeSheet.tsx
│     ├─ InvestmentTrackingSuccessSheet.tsx
│     ├─ VarGauge.tsx
│     ├─ VarTrendChart.tsx
│     ├─ InvestmentBarList.tsx
│     ├─ InvestmentDonutChart.tsx
│     ├─ VarFactorMatrix.tsx
│     ├─ InvestmentStickyActions.tsx
│     └─ index.ts
│
├─ data/
│  ├─ investmentRisk.ts
│  └─ investmentRiskFixtures.ts
│
├─ lib/
│  ├─ investmentRiskSelectors.ts
│  ├─ investmentRiskFormatters.ts
│  └─ investmentRiskDemoStore.ts
│
└─ styles/
   └─ investment-risk.css
```

文件数量和拆分可根据实现调整，但必须保持：

- 页面负责页面组合和路由
- 组件负责可复用视觉单元
- 数据文件负责 canonical mock
- selector 负责派生值和一致性
- formatter 负责金额、百分比和 bp
- demo store 负责跟踪和报告的演示持久化
- 不把全部页面塞入一个超长 TSX

### 11.1 不应过度抽象

不要为了“通用”创建：

- 任意 JSON 驱动页面生成器
- 通用 Dashboard 组件系统
- 复杂表单引擎
- 图表 DSL
- 新的全局状态库

现有 React state、URL search params、Context 和纯函数 selector 足够。

---

## 12. 现有组件复用与重写

### 12.1 可直接复用

- `AppShell`
- `PageHeader` 的基础返回、标题、右侧操作模式
- `BottomAskBar`
- `GlobalCopilotProvider`
- `useCopilot`
- `BottomSheet`，前提是支持焦点、滚动和固定 footer
- `PillTag` 的基础尺寸逻辑，前提是语义 variant 可扩展
- `lucide-react` 图标
- `tokens.css`
- `HashRouter`
- 构建、部署和滚动恢复机制

### 12.2 可作为底层复用，但需要投资风险包装

- `DonutChart`
- `MiniLineChart`
- `MetricCard`
- `RiskCard`

不得直接使用旧组件的固定尺寸或旧数据文案。推荐增加投资风险 wrapper。

### 12.3 必须重写

- `src/pages/InvestmentRiskPage.tsx` 的页面结构
- 旧四页签
- 页面内旧常量数据
- `AIAdvice`
- 旧压力测试模块
- 旧风险评分
- 旧风险贡献
- 旧因子联动
- 旧资产配置建议
- 所有只为旧页面服务的投资风险 CSS
- 与旧页面强绑定的数据结构

### 12.4 需要扩展但保持向后兼容

#### Global Copilot

可以为 `openCopilot` 增加可选的 typed payload：

```ts
type OpenCopilotOptions = {
  intent?: CopilotIntent;
  context?: string;
  sourceContext?: {
    module: "investment-risk";
    snapshotId: string;
    route: string;
    changeId?: string;
    memberId?: InvestmentMemberId;
    assetClassId?: InvestmentAssetClassId;
    metricIds?: string[];
  };
};
```

其他模块现有调用不应被破坏。

#### HomePage / RiskCard

需要支持：

- 投资风险状态
- 投资风险副标题
- 主动提醒跳转

不得重做其他首页模块。

#### Watch / Report

只增加投资风险所需的详情和入口，不重写无关列表或报告页面。

---

## 13. TypeScript 数据模型

以下模型是推荐合同。可拆分文件，但语义不得退化为大量无类型字符串。

```ts
export type InvestmentDataStatus = "reviewed" | "latest";
export type CompareBasis = "previousMonth" | "yearStart";

export type InvestmentMetricScopeId =
  | "group-all-investments"
  | "four-insurance-companies"
  | "var-measured-assets";

export type InvestmentRiskCategory = "var" | "return" | "scale";

export type InvestmentRiskLevel =
  | "normal"
  | "attention"
  | "decision";

export type InvestmentVerificationState =
  | "confirmed"
  | "pending";

export type InvestmentEventState =
  | "observe"
  | "warming"
  | "improving"
  | "stable"
  | "mitigated";

export type InvestmentTrackingState =
  | "untracked"
  | "pending"
  | "tracking"
  | "warming"
  | "improving"
  | "mitigated"
  | "closed";

export type InvestmentReportState =
  | "notIncluded"
  | "draft"
  | "included";

export type TrendDirection = "up" | "down" | "flat";
export type TrendImpact = "favorable" | "adverse" | "neutral";

export type InvestmentMemberId =
  | "life"
  | "property"
  | "pension"
  | "health"
  | "bank"
  | "securities"
  | "founderSecurities";

export type InvestmentAssetClassId =
  | "fixedIncome"
  | "equity"
  | "alternative"
  | "other";

export type InvestmentVarFactorId =
  | "interestRate"
  | "equity"
  | "fx";

export type InvestmentUnit =
  | "亿元"
  | "%"
  | "bp";

export type DataOrigin =
  | "reference-confirmed"
  | "demo-consistent"
  | "provisional-label";

export interface InvestmentMetricDelta {
  value: number;
  unit: InvestmentUnit;
  direction: TrendDirection;
  impact: TrendImpact;
  comparison: CompareBasis | "previousYear";
}

export interface InvestmentMetric {
  id: string;
  label: string;
  value: number | null;
  unit: InvestmentUnit;
  scopeId: InvestmentMetricScopeId;
  period: string;
  dataStatus: InvestmentDataStatus;
  delta?: InvestmentMetricDelta;
  origin: DataOrigin;
}

export interface InvestmentMetricScope {
  id: InvestmentMetricScopeId;
  label: string;
  description: string;
}

export interface InvestmentMember {
  id: InvestmentMemberId;
  name: string;
  shortName: string;
  supportsReturnData: boolean;
  supportsVarData: boolean;
}

export interface InvestmentAssetClass {
  id: InvestmentAssetClassId;
  name: string;
  shortName: string;
  isProvisionalLabel?: boolean;
}

export interface InvestmentVarFactor {
  id: InvestmentVarFactorId;
  name: string;
  colorToken: string;
}

export interface InvestmentTimePoint {
  period: string;
  value: number | null;
}

export interface InvestmentVarSnapshot {
  total: InvestmentMetric;
  groupLimit: InvestmentMetric;
  limitUsage: InvestmentMetric;
  remainingLimit: InvestmentMetric;
  trend: Array<{
    period: string;
    value: number | null;
    limit: number | null;
  }>;
  factors: Record<InvestmentVarFactorId, InvestmentMetric>;
  memberValues: Array<{
    memberId: InvestmentMemberId;
    metric: InvestmentMetric;
  }>;
  memberFactorValues: Array<{
    memberId: InvestmentMemberId;
    values: Record<InvestmentVarFactorId, number | null>;
  }>;
}

export interface InvestmentReturnSnapshot {
  annualCiiRate: InvestmentMetric;
  annualCiiAmount: InvestmentMetric;
  monthlyCiiRate: InvestmentMetric;
  monthlyCiiAmount: InvestmentMetric;
  memberAnnualRates: Array<{
    memberId: InvestmentMemberId;
    metric: InvestmentMetric;
  }>;
  assetClassAnnualRates: Array<{
    assetClassId: InvestmentAssetClassId;
    metric: InvestmentMetric;
  }>;
}

export interface InvestmentScaleSnapshot {
  groupTotal: InvestmentMetric;
  assetClasses: Array<{
    assetClassId: InvestmentAssetClassId;
    amount: InvestmentMetric;
  }>;
  members: Array<{
    memberId: InvestmentMemberId;
    amount: InvestmentMetric;
  }>;
  memberAssetAmounts: Array<{
    memberId: InvestmentMemberId;
    assetClassId: InvestmentAssetClassId;
    amount: InvestmentMetric;
  }>;
}

export interface InvestmentRiskEvidence {
  id: string;
  metricId: string;
  label: string;
  description?: string;
}

export interface InvestmentRiskChange {
  id: string;
  category: InvestmentRiskCategory;
  level: InvestmentRiskLevel;
  verification: InvestmentVerificationState;
  eventState: InvestmentEventState;
  trackingState: InvestmentTrackingState;
  reportState: InvestmentReportState;
  title: string;
  summary: string;
  period: string;
  dataStatus: InvestmentDataStatus;
  primaryMetricId: string;
  evidenceIds: string[];
  memberIds: InvestmentMemberId[];
  assetClassIds: InvestmentAssetClassId[];
  factorIds: InvestmentVarFactorId[];
  knownConclusion: string;
  uncertainty?: string;
  triggerDescription: string;
  trackingTaskId?: string;
  reportDraftId?: string;
}

export interface InvestmentRiskSnapshot {
  id: string;
  period: string;
  dataStatus: InvestmentDataStatus;
  generatedAt: string;
  scopes: InvestmentMetricScope[];
  overallLevel: InvestmentRiskLevel;
  overallConclusion: string;
  overallAttentionText: string;
  scale: InvestmentScaleSnapshot;
  returns: InvestmentReturnSnapshot;
  var: InvestmentVarSnapshot;
  evidences: InvestmentRiskEvidence[];
  changes: InvestmentRiskChange[];
}

export interface InvestmentTrackingTask {
  id: string;
  sourceModule: "investment-risk";
  sourceChangeId: string;
  sourceSnapshotId: string;
  title: string;
  status: InvestmentTrackingState;
  createdAt: string;
  baselineMetricIds: string[];
  nextObservationMetricIds: string[];
  nextUpdateDescription: string;
  reportDraftId?: string;
  timeline: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
  }>;
}

export interface InvestmentReportDraft {
  id: string;
  sourceSnapshotId: string;
  sourceChangeIds: string[];
  status: InvestmentReportState;
  title: string;
  oneSentenceSummary: string;
  factEvidenceIds: string[];
  managementSuggestions: string[];
  uncertainty?: string;
  createdAt: string;
  confirmedAt?: string;
}
```

---

## 14. 数据关系

### 14.1 单一快照

所有页面必须从同一个 `InvestmentRiskSnapshot` 读取同一周期的数据。

禁止在以下页面分别复制数字：

- 总览
- 重点变化
- 事项详情
- VaR 页
- 收益页
- 规模页
- 成员公司详情
- 资产类别详情
- Copilot
- 跟踪
- 汇报

### 14.2 事项关系

```text
InvestmentRiskSnapshot
  └─ InvestmentRiskChange
       ├─ evidenceIds → InvestmentRiskEvidence
       ├─ memberIds → InvestmentMember
       ├─ assetClassIds → InvestmentAssetClass
       ├─ trackingTaskId → InvestmentTrackingTask
       └─ reportDraftId → InvestmentReportDraft
```

### 14.3 跟踪关系

跟踪任务保存的是创建时的数据快照引用和指标基线，不是只保存 AI 文案。

### 14.4 报告关系

汇报草稿必须引用：

- 数据快照
- 变化事项
- 关键证据
- 数据范围
- 人工确认状态

---

## 15. 数据一致性规则

### 15.1 派生值必须计算

以下值不得独立硬编码：

```text
限额使用率
剩余额度
资产类别占比
成员公司占比
较上月变化
较年初变化
图表最后一点
列表主值
报告关键事实
Copilot 证据
```

### 15.2 同一指标全局一致

例如：

```text
集团整体 VaR = 426 亿
```

必须在以下位置一致：

- 投资风险总览
- 重点变化列表
- 关注事项详情
- VaR 风险页
- 收益与风险对照
- Copilot
- 跟踪基线
- 报告草稿

### 15.3 图表与摘要一致

- 图表最后一点等于页面主指标。
- 排行第一名等于成员公司详情中的同一指标。
- 资产类别分布之和等于资产类别总额。
- 环图占比由分项金额计算。
- 限额仪表由 VaR 和限额计算。
- 报告事实来自同一 evidence，而不是另写文本数字。

### 15.4 VaR 不可加性

以下值不要求相加等于总 VaR：

- 利率 VaR
- 权益 VaR
- 汇率 VaR
- 单个成员公司的不同风险因子 VaR

页面必须显示“独立测算，不可直接相加”的说明。

### 15.5 无数据与零

```ts
null = 无数据
0 = 真实零
```

不得使用 `value || 0`。

---

## 16. 已确认数据与演示数据

### 16.1 已确认参考锚点

以下数据作为当前演示的稳定锚点：

```text
集团投资规模：25,996 亿
固收：14,160 亿
权益：4,307 亿
另类：2,557 亿
其他：4,972 亿

年 CII 收益率：66.15%
年 CII 额：14,550 亿
月 CII 收益率：-2.47%
月 CII 额：8,859 亿
月 CII 较上月：-70bp

集团整体 VaR：426 亿
集团限额：800 亿
限额使用率：53.3%
剩余额度：374 亿
集团 VaR 较上月：-72 亿

利率 VaR：451 亿
权益 VaR：71 亿
汇率 VaR：3 亿

养老险 VaR：608 亿
健康险 VaR：227 亿
产险 VaR：145 亿
寿险 VaR：121 亿

产险年 CII 收益率：82.62%
养老险年 CII 收益率：75.43%
健康险年 CII 收益率：57.84%
寿险年 CII 收益率：39.15%

权益类规模：4,307 亿
权益类 VaR：71 亿
权益类年收益率：26.91%
```

### 16.2 演示派生数据

以下内容可以为保证画面完整而使用演示数据，但必须集中在 canonical mock 中：

- 六个月历史序列中的中间月份
- 某些成员公司较上月变化
- 资产类别的成员公司分布
- 跟踪时间线日期
- 报告草稿生成时间

演示数据要求：

- 算术一致
- 跨页一致
- 不改变业务分类
- 不引入新指标
- 在数据文件注释中标明 `demo-consistent`

### 16.3 临时业务标签

```text
其他
```

必须标记：

```ts
origin: "provisional-label";
isProvisionalLabel: true;
```

页面保留口径说明。

---

## 17. 已知参考图矛盾与修正规则

### 17.1 成员公司规模错位

参考图中“养老险 / 产险”规模示例可能在不同画面中出现错位。

处理：

- 不逐图复制。
- 建立一份 canonical member scale 数据。
- 总览、规模页、成员详情均从该数据派生。

### 17.2 养老险资产结构与权益类分布

参考图中的养老险总规模、资产结构百分比和权益类金额可能无法同时勾稽。

处理：

- 资产结构百分比必须由成员公司的资产金额计算。
- 成员详情与权益类详情必须一致。
- 允许对参考图中的示例百分比进行算术修正。
- 不允许保留硬编码矛盾。

### 17.3 总览右侧图标

参考图在不同滚动段出现信息或筛选图标不一致。

处理：

- 总览统一使用信息按钮。
- 重点变化列表使用筛选按钮。

### 17.4 系统状态栏

不在应用内绘制假状态栏。

### 17.5 参考图中的拥挤和错位

允许修正：

- 中文基线不齐
- 指标与单位错位
- 图表标签重叠
- 标签过宽
- 卡片高度不一致
- 边距不统一
- 图例被裁切
- Bottom Sheet footer 抖动

不允许改变：

- 页面顺序
- 内容分类
- 业务动线
- 已确认操作
- 数据范围说明
- AI 与全局 Copilot 的分工

---

## 18. QA 开发夹具

为验证空状态、极值和响应式，可在开发环境支持查询参数：

```text
fixture=default
fixture=empty
fixture=singlePoint
fixture=extreme
fixture=longText
fixture=error
```

要求：

- 仅 `import.meta.env.DEV` 生效。
- 不在产品 UI 中暴露切换器。
- production build 忽略该参数或始终使用 default。
- 所有 fixture 使用相同 TypeScript 合同。

场景：

### empty

- 无重点变化
- 某些指标 null
- 图表无点

### singlePoint

- 趋势只有一期

### extreme

- 大金额
- VaR 超过限额
- 负收益极值
- 长图例

### longText

- 长成员公司名称
- 长风险事项标题
- 长说明

### error

- 页面或区块加载错误

---

## 19. 完成标准

实现完成时必须满足：

1. 覆盖 INV-UI-01～17 的全部页面和状态。
2. 所有定义路由可直接访问和刷新。
3. 总览、VaR 页的滚动续图是同一页面，不重复 DOM。
4. 所有关键按钮有真实行为。
5. 底部 AI 输入不遮挡内容。
6. 筛选状态可保留。
7. 跟踪和汇报状态可在演示环境中持久化。
8. 同一指标跨页完全一致。
9. 图表与摘要一致。
10. AI 结论有证据和不确定性。
11. 不出现旧四页签、旧评分、旧压力测试或旧 AI 建议。
12. 不增加新依赖。
13. 不修改无关页面。
14. `npm run build` 成功。
15. 在真实浏览器中通过 375、390、393、430 四类移动视口验收。