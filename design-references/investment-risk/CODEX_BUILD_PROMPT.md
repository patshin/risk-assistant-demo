# Codex Build Prompt：投资风险模块全量重建

你正在修改仓库：

```text
https://github.com/patshin/risk-assistant-demo
```

目标是基于已经确认的投资风险产品方案、高保真 UI 和设计规范，彻底重建移动端投资风险模块。

这不是旧 `InvestmentRiskPage` 的视觉换皮，也不是对旧四页签做局部整理。

---

## 一、必须先读取

开始任何代码修改前，依次读取：

1. 仓库根目录 `AGENTS.md`
2. `design-references/investment-risk/` 中的全部文件
3. `design-references/investment-risk/DESIGN_SPEC.md`
4. 所有 `INV-UI-01` 至 `INV-UI-17` 参考图
5. 当前：
   - `src/App.tsx`
   - `src/pages/InvestmentRiskPage.tsx`
   - `src/pages/HomePage.tsx`
   - `src/pages/WatchPage.tsx`
   - `src/pages/ReportPage.tsx`
   - `src/components/GlobalCopilot.tsx`
   - `src/components/BottomAskBar.tsx`
   - `src/components/BottomSheet.tsx`
   - `src/components/PageHeader.tsx`
   - `src/components/RiskCard.tsx`
   - `src/components/DonutChart.tsx`
   - `src/components/MiniLineChart.tsx`
   - `src/components/index.ts`
   - `src/data/mockRisk.ts`
   - `src/styles/tokens.css`
   - `src/styles/global.css`
   - `package.json`

设计规范和新 UI 稿优先于旧 `InvestmentRiskPage`。

旧投资风险实现只用于识别哪些全局组件可复用，不构成兼容约束。

---

## 二、开始前保护用户修改

第一步运行：

```bash
git status --short
```

要求：

- 记录当前工作区状态。
- 不覆盖、删除、格式化或回退用户已有修改。
- 不使用 `git reset --hard`。
- 不使用 `git checkout -- .`。
- 不清理未跟踪文件。
- 不提交、推送或创建 PR，除非用户另行明确要求。
- 如果本任务需要修改一个已经存在用户修改的文件，先读取 diff，保留用户意图，再做最小合并。

在开始实质编辑前，先输出：

1. 预计修改范围
2. 预计新增、重写和仅扩展的文件
3. 实施阶段
4. 哪些旧投资风险代码将被移除
5. 哪些公共组件会复用或向后兼容扩展

本任务预计会超过 5 个文件，必须按 `AGENTS.md` 先说明范围。

---

## 三、强制使用的工作方法

### 1. `$impeccable`

使用 `$impeccable` 完成：

- 参考图视觉拆解
- 移动端组件实现
- 字体、间距、卡片、图表和状态语义
- 375～430px 响应式
- 视觉精修
- 最终像素和布局稳定性检查

不得把 `$impeccable` 只用于最后一次表面检查。

### 2. `$vercel-react-best-practices`

使用 `$vercel-react-best-practices` 检查：

- 页面和组件边界
- React state 和派生数据
- 避免重复计算和重复数据源
- 避免不必要的全局状态
- key、memo、effect 和事件处理
- 路由页面直接访问
- 条件渲染和错误状态
- 可维护性和性能

### 3. `$agent-browser`

使用 `$agent-browser`：

- 启动真实浏览器
- 遍历完整用户流程
- 测试每个路由和关键弹层
- 截取关键状态
- 验证 375、390、393、430 四种视口
- 检查控制台
- 检查溢出、遮挡和非空画面
- 发现问题后继续修改并重新验证

不得只依赖静态代码阅读或构建成功。

---

## 四、最高优先级实现原则

### 1. 新设计是事实来源

以下均允许彻底替换：

- `InvestmentRiskPage` 页面结构
- 投资风险路由内部结构
- 旧投资风险组件
- 旧投资风险 mock
- 旧投资风险 TypeScript 类型
- 旧投资风险 CSS
- 旧投资风险页签和状态管理
- 旧 AI 建议逻辑

### 2. 不得做旧页面换皮

最终实现中不得保留：

```text
组合概览
压力测试
风险因子
资产配置
```

不得保留：

```text
风险评分 67/100
最大回撤
VaR(95%)
预期收益
配置较均衡
因子联动
久期结构
信用等级结构
固定 AI 建议
```

### 3. 不得增加方案外能力

不要新增：

- 新风险指标
- 新投资类别
- 新压力测试
- 新 AI 卡片
- 新聊天入口
- 单只持仓、产品、发行人或项目详情
- 自动调仓建议
- 投资决策建议
- 风险评分
- 复杂桌面表格
- 新依赖

### 4. 所有按钮必须真实

禁止：

- 视觉按钮没有点击行为
- 点击后只打印日志
- 点击后打开无关的通用 AI
- 点击后进入不存在的路由
- 假筛选
- 假保存
- 假汇报确认

---

## 五、目标页面和路由

使用现有 `HashRouter`，实现：

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

### 路由页面

1. 投资风险总览
2. 重点变化列表
3. 关注事项详情
4. VaR 风险
5. 收益与风险
6. 规模与结构
7. 成员公司详情
8. 资产类别详情
9. 投资风险来源的重点跟踪详情
10. 投资风险汇报预览

### 非路由状态

1. 重点变化筛选 Bottom Sheet
2. 指标范围说明 Bottom Sheet
3. 全局 Copilot 投资风险状态
4. 加入重点跟踪成功 Bottom Sheet
5. 加载、空、错误、无结果和重复操作反馈

---

## 六、推荐文件结构

可根据仓库实际情况调整，但不要把所有内容继续放在一个页面文件中。

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
│     ├─ 页面基础布局
│     ├─ 标签和指标
│     ├─ 总览卡片
│     ├─ 重点变化卡片
│     ├─ 筛选和说明 Bottom Sheet
│     ├─ VaR 仪表和趋势图
│     ├─ 条形排行
│     ├─ 环图
│     ├─ VaR 矩阵
│     ├─ 固定操作栏
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

可以删除旧 `InvestmentRiskPage.tsx`，也可以将其改为薄导出层；最终不得保留旧页面实现。

---

## 七、分阶段实施

严格按以下阶段执行。每个阶段完成后检查代码和数据一致性，再进入下一阶段。

---

### 阶段 1：参考资产和旧模块审计

完成：

1. 读取全部参考图和设计规范。
2. 列出参考图与路由、滚动段、弹层的映射。
3. 审计旧投资风险组件、数据和 CSS。
4. 标记：
   - 可复用
   - 可向后兼容扩展
   - 必须删除或重写
5. 审计首页、跟踪、报告和全局 Copilot 的连接点。
6. 检查当前路由直接访问和返回机制。
7. 输出预计文件清单。

此阶段不要先写视觉代码。

---

### 阶段 2：新领域模型和数据合同

先实现：

- TypeScript 类型
- canonical 投资风险 snapshot
- 成员公司、资产类别和风险因子字典
- 指标 scope
- 重点变化
- evidence
- tracking task
- report draft
- selector
- formatter
- demo store

必须落实 `DESIGN_SPEC.md` 中的数据模型和一致性规则。

核心要求：

1. 所有页面读取同一份 snapshot。
2. 限额使用率和剩余额度由 VaR 与限额计算。
3. 资产占比由金额计算。
4. 图表最后一点由当前指标派生。
5. 报告和 Copilot 引用 evidence，不复制数字。
6. `null` 和 `0` 严格区分。
7. 因子 VaR 不强制相加。
8. 参考图中跨页示例矛盾必须通过 canonical mock 修正。
9. 不把演示值散落在 TSX 文件中。
10. 对 `reference-confirmed`、`demo-consistent` 和 `provisional-label` 做开发注释或数据标记。

为演示操作增加版本化 localStorage：

```text
risk-assistant-demo:investment-risk:v1
```

用于保存：

- 已创建跟踪任务
- 汇报草稿状态
- 是否已纳入汇报

不要引入状态管理库。

---

### 阶段 3：页面、组件和路由实现

按完整流程实现。

#### 3.1 首页连接

修改首页投资风险入口：

```text
标题：投资风险
副标题：规模 / 收益 / VaR
状态：需关注
```

主动提醒：

```text
投资月 CII 收益率转负，建议查看
```

投资卡进入 `/investment`，提醒进入对应变化详情。

不要影响宏观、信用或个人工作台。

#### 3.2 投资风险总览

实现 INV-UI-02 和 INV-UI-03 为同一连续页面：

1. 页面头部和数据上下文
2. 整体风险摘要
3. 本期需关注
4. 管理摘要
5. 主要风险来源
6. 重点成员公司
7. 底部 AI 输入

#### 3.3 重点变化

实现：

- 分类 Segmented Control
- 筛选按钮
- 筛选 Bottom Sheet
- URL search params
- 返回后筛选保留
- 无结果状态
- 事项详情

#### 3.4 VaR

实现：

- VaR 与限额仪表
- 近 6 个月趋势
- 风险因子
- 成员公司排行
- 风险因子矩阵
- 数据范围说明
- 成员公司下钻

#### 3.5 收益与风险

实现：

- 年 CII
- 月 CII
- 关注提示
- 成员公司收益率
- 收益与 VaR 对照
- 成员公司下钻

#### 3.6 规模与结构

实现：

- 集团投资规模
- 资产类别环图
- 资产类别图例
- 成员公司规模排行
- 成员公司下钻
- 资产类别下钻

#### 3.7 成员公司详情

同一模板支持：

```text
寿险
产险
养老险
健康险
银行
证券
方正证券
```

根据数据能力决定是否展示收益和 VaR，缺失时使用明确无数据状态。

#### 3.8 资产类别详情

同一模板支持：

```text
固收
权益
另类
其他
```

`其他`可以显示口径说明；没有收益或 VaR 数据时不伪造。

#### 3.9 跟踪和报告

实现：

- 加入跟踪成功
- 重复加入幂等
- 跟踪详情
- 跟踪记录
- 报告草稿
- 人工确认纳入汇报
- 报告状态持久化

---

### 阶段 4：图表与交互

图表不得增加依赖。

实现：

1. VaR 半环仪表
2. VaR 六个月趋势
3. 风险因子条形图
4. 成员公司排行
5. VaR 因子矩阵
6. CII 成员公司条形图
7. 资产结构环图
8. 成员公司规模分布
9. 证据微趋势

所有图表必须：

- 响应容器宽度
- 具有稳定高度
- 不横向溢出
- 不遮挡标签
- 支持空数据
- 支持单点数据
- 支持极值
- 支持 null
- 有 `role="img"` 和中文 `aria-label`
- 与页面摘要使用同一数据源

交互必须包括：

- 返回
- 直接访问 fallback
- 筛选
- 筛选重置
- 弹层关闭
- 成员公司下钻
- 资产类别下钻
- 加入跟踪
- 查看跟踪
- 纳入汇报
- 继续追问
- 指标说明展开
- Copilot 操作按钮

---

### 阶段 5：全局 Copilot 连接

保留现有底部 AI 输入和全局 Copilot 整体交互。

可以向后兼容扩展 `openCopilot`：

```ts
openCopilot({
  intent: "general",
  context: "...",
  sourceContext: {
    module: "investment-risk",
    snapshotId,
    route,
    changeId,
    memberId,
    assetClassId,
    metricIds,
  },
});
```

投资风险 Copilot 输出必须包含：

1. 结论摘要
2. 关键证据
3. 数据范围
4. 不确定性
5. 已定义操作

默认演示问题：

```text
本期最重要的投资风险是什么？
```

事实：

```text
月 CII 收益率 -2.47%
集团整体 VaR 426 亿
集团限额 800 亿
养老险 VaR 608 亿
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

不要出现旧的地产链、授信客户、房地产证据或通用信用风险结论。

不要在普通页面增加新的 AI 卡片。

---

### 阶段 6：视觉精修

使用 `$impeccable`，逐项处理：

- 暖色背景
- 卡片透明度和阴影
- 22px 页面标题
- 18px 区块标题
- 大数字的 tabular numerals
- 卡片圆角
- 橙色主按钮
- 标签语义
- 图表配色
- 文字基线
- 卡片高度稳定
- sticky 页面头部
- Bottom Sheet
- 底部 AI 输入
- 固定操作栏
- 安全区

不要绘制假的系统状态栏。

不要把页面做成通用后台或桌面 Dashboard。

---

### 阶段 7：多视口浏览器验收

启动：

```bash
npm run dev -- --host 127.0.0.1
```

使用 `$agent-browser` 测试：

```text
375 × 812
390 × 844
393 × 852
430 × 932
```

至少遍历：

```text
首页
→ 投资风险总览
→ 重点变化
→ 筛选
→ 事项详情
→ Copilot
→ 加入跟踪
→ 跟踪详情
→ 汇报预览
```

以及：

```text
总览
→ VaR
→ 成员公司详情
```

```text
总览
→ 规模与结构
→ 权益类
→ 养老险
```

```text
总览
→ 收益与风险
```

逐页检查：

- 页面非空
- 参考内容完整
- 无横向溢出
- 无文字重叠
- 无图表裁切
- 固定底栏不遮挡内容
- 弹层正确
- 返回正确
- 直接访问和刷新正确
- 控制台无错误
- 所有按钮有行为

发现问题必须继续修复和重新验证。

---

## 八、响应式和长内容

必须专门测试：

```text
中文长标题
长成员公司名称
长资产类别名称
25,996 亿以上金额
-123.45%
+12,345bp
VaR 超限
空数据
单点数据
长图例
```

不允许：

- 标签意外换两行
- 数字和单位拆开
- 右侧数值被挤出
- 卡片高度跳动
- 图表标签覆盖
- 页面横向滚动
- 通过把字体缩到不可读来解决问题

可以实现仅开发环境可用的 fixture：

```text
?fixture=empty
?fixture=singlePoint
?fixture=extreme
?fixture=longText
?fixture=error
```

---

## 九、React 实现要求

使用 `$vercel-react-best-practices` 检查：

- 页面级数据只获取或选择一次
- 派生值使用纯函数 selector
- 不在 render 中重复查找大型数组
- 不使用 effect 同步可由 props 或 URL 推导的状态
- 筛选状态以 URL 为事实来源
- localStorage 访问集中在 demo store
- 组件 props 使用明确类型
- 不滥用 `any`
- 不在页面内复制 format 函数
- 路由参数有校验和 fallback
- 列表使用稳定 id
- 不使用数组下标作为可变列表 key
- 避免一个组件超过合理复杂度
- 不引入无必要 context 或全局 store
- 不为每个图表重复实现相同条形逻辑

---

## 十、构建检查

完成后运行：

```bash
npm run build
```

如果失败：

1. 修复所有 TypeScript、Vite 和 CSS 问题。
2. 重新运行。
3. 不以“旧代码问题”为理由跳过。
4. 不留下 warning 导致的真实运行问题。

构建成功后再次启动开发服务器，并用 `$agent-browser` 做最终回归。

---

## 十一、最终总结格式

最终只在全部实现和验收完成后总结：

### 已完成

- 页面和路由
- 核心流程
- 数据模型
- 图表
- Copilot
- 跟踪
- 报告
- 响应式

### 修改文件

按：

```text
新增
重写
扩展
删除
```

分类列出。

### 验证结果

```text
npm run build
浏览器视口
完整流程
控制台
空状态
极值状态
```

### 保留限制

只列真实数据条件限制，例如：

- “其他”的正式业务名称待确认
- 成员公司独立 VaR 限额尚未提供
- 无持仓明细，因此不解释具体收益变化原因

不得把未完成的 UI 或未通过的 QA 包装成限制。