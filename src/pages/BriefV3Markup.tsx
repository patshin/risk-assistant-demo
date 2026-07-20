import type { RefObject } from "react";

type BriefV3MarkupProps = {
  rootRef: RefObject<HTMLDivElement | null>;
  onBack: () => void;
};

export function BriefV3Markup({ rootRef, onBack }: BriefV3MarkupProps) {
  return (
    <div className="v3-brief" ref={rootRef}>
<main className="app" id="app">
    <div className="page">
      <header className="topbar">
        <button className="icon-button" type="button" aria-label="返回" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m15 18-6-6 6-6"/><path d="M9 12h10"/></svg>
        </button>
        <h1>今日风险简报</h1>
        <button className="icon-button" id="shareButton" type="button" aria-label="分享简报">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="m8.4 10.7 7.2-4.2M8.4 13.3l7.2 4.2"/></svg>
        </button>
      </header>

      <div className="brief-meta">
        <div>
          <div className="date-main">7月16日 · 星期四</div>
          <div className="date-sub">集团领导日报 · 已知悉 2 / 5</div>
        </div>
        <button className="edition-button" id="editionButton" type="button">
          <span id="editionLabel">07:30版</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg>
        </button>
      </div>

      <nav className="page-tabs" role="tablist" aria-label="简报类型">
        <button role="tab" aria-selected="true" data-page-tab="overall">综合日报</button>
        <button role="tab" aria-selected="false" data-page-tab="investment">投资日报</button>
        <button role="tab" aria-selected="false" data-page-tab="history">历史</button>
      </nav>

      <section className="tab-panel" id="panel-overall" role="tabpanel">
        <article className="card summary-card">
          <div className="summary-top">
            <span className="ai-label"><span className="spark">AI</span>领导摘要</span>
            <span className="trend-badge">↑ 较昨日升温</span>
          </div>
          <h2>今日集团风险整体略有升温</h2>
          <p><b>华东建设集团</b>由重大预警转为出险，跨银行、租赁和资管敞口需要协同确认；地产链外部事件与信用卡高风险客群值得继续关注。流动性、操作及声誉合规暂无重大变化。</p>
          <div className="summary-stats" aria-label="今日摘要数字">
            <div className="summary-stat"><strong>3</strong><span>关键变化</span></div>
            <div className="summary-stat"><strong>1</strong><span>待集团推动</span></div>
            <div className="summary-stat"><strong>1</strong><span>数据待更新</span></div>
          </div>
          <button className="coverage-line" id="coverageButton" type="button"><span>13个数据源中12个已就绪，寿险批次仍在汇总</span><b>查看边界</b></button>
        </article>

        <section className="section" aria-labelledby="domain-title">
          <div className="section-head">
            <div><h2 id="domain-title">全域风险态势</h2><p>六个风险域全部露出，点击查看关键指标与影响</p></div>
          </div>
          <div className="card accordion-list" id="domainList">
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-5h6v5"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">信用风险</span><span className="status-pill high">较高</span></span><span className="row-desc">新增出险1户，地产链预警继续扩散</span><span className="row-meta">数据截至 07:18 · 已复核</span></span>
                <span className="row-side up"><b>升温</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body">
                <p className="body-lead">今日升温主要由新增司法执行、存量预警迁移和地产链关联客户扩散共同驱动。</p>
                <div className="mini-grid"><div className="mini-metric"><span>新增出险</span><strong>1户 / 0.05亿</strong></div><div className="mini-metric"><span>存量预警资产</span><strong>3,342亿元</strong></div><div className="mini-metric"><span>预警客户</span><strong>964户</strong></div><div className="mini-metric"><span>重点主体</span><strong>3类对象</strong></div></div>
                <div className="detail-block"><h4>主要影响</h4><p>华东建设集团、地产链11户潜在关联客户及信用卡高风险客群。</p></div>
                <button className="inline-action" type="button" data-toast="已进入信用风险专业模块（原型）">进入信用风险模块</button>
              </div>
            </details>
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3c2.3 2.4 3.5 5.4 3.5 9S14.3 18.6 12 21M12 3C9.7 5.4 8.5 8.4 8.5 12S9.7 18.6 12 21"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">宏观风险</span><span className="status-pill warn">中高</span></span><span className="row-desc">海外长端利率上行，地产政策边际改善</span><span className="row-meta">数据截至 07:05 · 1个来源延迟</span></span>
                <span className="row-side up"><b>升温</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body">
                <p className="body-lead">方向相反的宏观信号并存，主要观察海外融资成本上升对集团客户与长久期资产的传导。</p>
                <div className="mini-grid"><div className="mini-metric"><span>10年期利率</span><strong>单日 +11bp</strong></div><div className="mini-metric"><span>敏感主体</span><strong>8家</strong></div><div className="mini-metric"><span>影响方向</span><strong>融资成本↑</strong></div><div className="mini-metric"><span>数据状态</span><strong>1源延迟</strong></div></div>
                <div className="detail-block"><h4>主要影响</h4><p>跨境融资主体、境外债务以及久期较长的固定收益资产。</p></div>
                <button className="inline-action" type="button" data-toast="已进入宏观风险专业模块（原型）">进入宏观风险模块</button>
              </div>
            </details>
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/><path d="m4 8 5-3 5 4 6-5"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">投资风险</span><span className="status-pill mid">关注</span></span><span className="row-desc">月度CII收益转负，VaR仍处限额内</span><span className="row-meta">2026-06复核快照 · 非实时口径</span></span>
                <span className="row-side"><b>稳定</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body">
                <p className="body-lead">收益变化需要知悉，但当前尚未演变为集团限额压力，应结合成员公司与资产结构判断持续性。</p>
                <div className="mini-grid"><div className="mini-metric"><span>CII月度收益</span><strong style={{ color: "var(--red)" }}>-0.42%</strong></div><div className="mini-metric"><span>集团VaR</span><strong>426亿元</strong></div><div className="mini-metric"><span>限额使用率</span><strong>53.3%</strong></div><div className="mini-metric"><span>需关注成员</span><strong>3家</strong></div></div>
                <button className="inline-action" type="button" data-switch-investment>查看投资风险日报</button>
              </div>
            </details>
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2.5S5.5 10 5.5 14.8a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z"/><path d="M9 16.5c.7 1 1.7 1.5 3 1.5"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">流动性风险</span><span className="status-pill ok">正常</span></span><span className="row-desc">主要指标稳定，无新增限额触发</span><span className="row-meta">数据截至 07:24 · 已复核</span></span>
                <span className="row-side"><b>稳定</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body"><p className="body-lead">集团与主要成员公司的核心流动性指标均处于管理阈值内，今日无需要升级的事项。</p><div className="mini-grid"><div className="mini-metric"><span>限额触发</span><strong>0项</strong></div><div className="mini-metric"><span>异常成员</span><strong>0家</strong></div></div></div>
            </details>
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 4 7v5c0 5 3.5 8.2 8 9 4.5-.8 8-4 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">操作风险</span><span className="status-pill ok">稳定</span></span><span className="row-desc">无新增重大事件，2项整改按期推进</span><span className="row-meta">数据截至 07:12 · 已复核</span></span>
                <span className="row-side down"><b>缓解</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body"><p className="body-lead">存量整改没有延期或升级条件，今日无需集团层面推动。</p><div className="mini-grid"><div className="mini-metric"><span>新增重大事件</span><strong>0项</strong></div><div className="mini-metric"><span>整改推进</span><strong>2项正常</strong></div></div></div>
            </details>
            <details className="accordion-item" data-accordion-group="domain">
              <summary>
                <span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M8 12h8M12 8v8"/></svg></span>
                <span className="row-main"><span className="row-title-line"><span className="row-title">声誉与合规</span><span className="status-pill ok">正常</span></span><span className="row-desc">舆情与监管事项无管理相关增量</span><span className="row-meta">数据截至 06:55 · 已复核</span></span>
                <span className="row-side"><b>稳定</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span>
              </summary>
              <div className="accordion-body"><p className="body-lead">未发现需要纳入今日重点的重大负面舆情或新增监管处罚事项。</p><div className="mini-grid"><div className="mini-metric"><span>重大舆情</span><strong>0项</strong></div><div className="mini-metric"><span>新增处罚</span><strong>0项</strong></div></div></div>
            </details>
          </div>
        </section>

        <section className="section" id="focusSection" aria-labelledby="focus-title">
          <div className="section-head"><div><h2 id="focus-title">今日重点</h2><p>只保留需要领导优先知悉或轻量推动的事项</p></div><button className="text-button" type="button" data-toast="已按管理重要性排序">3项</button></div>
          <div className="filter-row" role="group" aria-label="今日重点筛选">
            <button className="filter-chip active" type="button" data-filter="all">全部</button>
            <button className="filter-chip" type="button" data-filter="push">待推动 1</button>
            <button className="filter-chip" type="button" data-filter="attention">待关注 2</button>
          </div>
          <div className="focus-stack">
            <button className="focus-card urgent" type="button" data-status="push" data-event="huadong">
              <div className="focus-top"><div className="tag-row"><span className="tag p0">P0</span><span className="tag soft">大客户</span><span className="tag p0">新增出险</span></div><time className="focus-time">08:15更新</time></div>
              <h3>华东建设集团</h3><p className="focus-sub">地产链 / 建筑工程 · 牵头归口：银行</p>
              <div className="focus-change"><b>重大预警 → 出险</b>，新增司法执行1.2亿元，经营现金流连续3个月为负。</div>
              <div className="focus-metrics"><div className="focus-metric"><span>集团汇总敞口</span><strong>23.6亿元</strong></div><div className="focus-metric"><span>关联成员</span><strong>3确认 + 1待核</strong></div><div className="focus-metric"><span>处置阶段</span><strong>协同确认</strong></div><div className="focus-metric"><span>集团待推动</span><strong>统一敞口口径</strong></div></div>
              <div className="focus-reason"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2Z"/></svg><span>跨成员敞口与处置口径尚未完全统一，需要集团推动。</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg></div>
            </button>

            <button className="focus-card" type="button" data-status="attention" data-event="black-swan">
              <div className="focus-top"><div className="tag-row"><span className="tag p1">P1</span><span className="tag soft">黑天鹅</span><span className="tag blue">外部事件</span></div><time className="focus-time">07:50更新</time></div>
              <h3>地产链信用事件出现扩散迹象</h3><p className="focus-sub">可能影响对公金融BU及4家成员公司</p>
              <div className="focus-change">已匹配集团内<b>11户潜在关联客户</b>，当前业务关系与实际敞口仍待专业公司确认。</div>
              <div className="focus-reason"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2Z"/></svg><span>潜在关联敞口38.4亿元，当前属于高影响、待核验事项。</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg></div>
            </button>

            <button className="focus-card" type="button" data-status="attention" data-event="retail">
              <div className="focus-top"><div className="tag-row"><span className="tag p1">P1</span><span className="tag soft">零售产品</span><span className="tag ok">信用卡</span></div><time className="focus-time">昨日收盘</time></div>
              <h3>高风险客群早期逾期率连续两周抬升</h3><p className="focus-sub">零售金融BU · 银行信用卡组合</p>
              <div className="focus-change">M1逾期率较两周前上升<b>0.18个百分点</b>，尚未触发正式管理限额。</div>
              <div className="focus-reason"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2Z"/></svg><span>建议继续观察迁徙率与催收回收率，暂不升级正式风险等级。</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg></div>
            </button>
          </div>
        </section>

        <section className="section" aria-labelledby="disposal-title">
          <div className="section-head"><div><h2 id="disposal-title">处置与推动进展</h2><p>来自个人工作台，日报只读展示领导关心的关键节点</p></div><button className="text-button" type="button" data-toast="当前共有12项处置事项">全部 12</button></div>
          <article className="card disposal-card">
            <div className="disposal-head"><div className="disposal-head-line"><h3>华东建设集团</h3><span className="tag p0">待集团推动</span></div><p>联合处置方案：债务重组 + 担保资产处置</p></div>
            <div className="stepper" aria-label="处置进度"><div className="step done"><i>✓</i><span>风险识别</span></div><div className="step done"><i>✓</i><span>方案制定</span></div><div className="step current"><i></i><span>协同确认</span></div><div className="step"><i></i><span>执行跟踪</span></div></div>
            <div className="disposal-body"><dl style={{ margin: 0 }}><div className="disposal-fact"><dt>最新进展</dt><dd>银行已完成担保物复估；租赁回收方案待确认。</dd></div><div className="disposal-fact"><dt>当前障碍</dt><dd className="alert">银行、租赁与资管的敞口口径尚未完全统一。</dd></div><div className="disposal-fact"><dt>下一节点</dt><dd>7月18日前形成联合处置方案并回报集团。</dd></div></dl><div className="dual-actions"><button type="button" id="openDisposal">查看完整处置</button><button className="primary" type="button" data-toast="已进入个人工作台（原型）">进入工作台</button></div></div>
          </article>
        </section>

        <section className="section" aria-labelledby="impact-title">
          <div className="section-head"><div><h2 id="impact-title">集团影响与成员关注</h2><p>每个板块、成员公司和风险对象均可点击展开</p></div></div>
          <article className="card impact-card">
            <div className="impact-tabs" role="tablist" aria-label="集团影响分类">
              <button type="button" role="tab" aria-selected="false" data-impact-tab="bu">业务板块</button>
              <button className="active" type="button" role="tab" aria-selected="true" data-impact-tab="member">成员公司</button>
              <button type="button" role="tab" aria-selected="false" data-impact-tab="object">风险对象</button>
            </div>

            <div className="impact-panel" id="impact-bu" role="tabpanel">
              <div className="impact-summary">共涉及<b>4个业务板块</b>。集团层面重点不是简单汇总，而是识别跨板块传导与协同缺口。</div>
              <div className="accordion-list">
                <details className="accordion-item" data-accordion-group="impact-bu" open>
                  <summary><span className="row-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg></span><span className="row-main"><span className="row-title">对公金融BU</span><span className="row-desc">大客户、地产链与城投风险交叉</span></span><span className="row-side up"><b>3项<br />90.8亿</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">当前是集团风险最集中的业务板块，既有已确认敞口，也有外部事件匹配形成的潜在敞口。</p><div className="impact-keyline"><span className="key-chip">银行</span><span className="key-chip">租赁</span><span className="key-chip">资管</span><span className="key-chip">产险待核</span></div><div className="detail-block"><h4>关联事项</h4><ul className="detail-list"><li>华东建设集团新增出险，集团确认敞口23.0亿元。</li><li>地产链外部事件匹配11户潜在客户，38.4亿元仍待核验。</li><li>城投再融资压力影响2家成员公司，暂未升级为P0。</li></ul></div><div className="detail-block"><h4>集团关注</h4><ul className="detail-list"><li>统一集团客户、担保链与成员公司敞口确认时点。</li><li>识别同一担保物、同一资金来源在成员公司之间的重复计算。</li><li>由银行牵头形成未来30日偿债与联合处置口径。</li></ul></div><div className="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>90.8亿元包含已确认与潜在敞口，不能直接理解为正式风险余额。</span></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-bu">
                  <summary><span className="row-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></span><span className="row-main"><span className="row-title">零售金融BU</span><span className="row-desc">信用卡高风险客群迁徙率升温</span></span><span className="row-side"><b>1项<br />未超限</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">当前变化集中于信用卡高风险客群，尚未扩散到消费贷和个人住房贷款。</p><div className="mini-grid"><div className="mini-metric"><span>M1逾期率</span><strong>+0.18pp</strong></div><div className="mini-metric"><span>观察周期</span><strong>连续2周</strong></div><div className="mini-metric"><span>限额状态</span><strong>未触发</strong></div><div className="mini-metric"><span>主要成员</span><strong>银行</strong></div></div><div className="detail-block"><h4>今日关注</h4><ul className="detail-list"><li>按获客批次观察迁徙率是否集中于特定渠道或客群。</li><li>同步跟踪催收回收率和额度使用变化，避免单一指标误判。</li><li>当前继续观察，不建议直接升级正式风险等级。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-bu">
                  <summary><span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg></span><span className="row-main"><span className="row-title">保险BU</span><span className="row-desc">产险业务待核，寿险批次仍在汇总</span></span><span className="row-side"><b>2家公司<br />待确认</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">保险板块需要区分保险责任、合同应收、追偿关系和投资持仓，不能把“有关联”直接等同于“有信用敞口”。</p><div className="detail-block"><h4>今日关注</h4><ul className="detail-list"><li>产险核验华东建设相关合同、应收与潜在追偿关系。</li><li>寿险确认投资持仓与对手方关系；当前批次未完成。</li><li>如确认无实际敞口，应从成员关注列表中移除。</li></ul></div><div className="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>寿险数据未到不能解释为“风险稳定”。</span></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-bu">
                  <summary><span className="row-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/><path d="m4 8 5-3 5 4 6-5"/></svg></span><span className="row-main"><span className="row-title">投资管理BU</span><span className="row-desc">月度收益转负，成员公司风险分化</span></span><span className="row-side"><b>2项<br />月度快照</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">综合日报只提示管理相关变化，收益归因、VaR和成员差异在投资日报中完整展示。</p><div className="mini-grid"><div className="mini-metric"><span>CII月度收益</span><strong style={{ color: "var(--red)" }}>-0.42%</strong></div><div className="mini-metric"><span>集团VaR</span><strong>426亿元</strong></div><div className="mini-metric"><span>限额使用率</span><strong>53.3%</strong></div><div className="mini-metric"><span>东部资管VaR</span><strong>78%</strong></div></div><button className="inline-action" type="button" data-switch-investment>查看投资风险日报</button></div>
                </details>
              </div>
            </div>

            <div className="impact-panel active" id="impact-member" role="tabpanel">
              <div className="impact-summary">已确认银行、租赁、资管敞口<b>23.0亿元</b>；产险0.6亿元业务关系待确认，寿险数据待更新。</div>
              <div className="accordion-list">
                <details className="accordion-item" data-accordion-group="impact-member" open>
                  <summary><span className="row-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">银行</span><span className="status-pill high">牵头归口</span></span><span className="row-desc">授信与担保敞口17.0亿元</span></span><span className="row-side up"><b>已确认</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">银行同时承接华东建设集团、地产链潜在关联客户与信用卡组合风险，是本次集团协同的牵头方。</p><div className="mini-grid"><div className="mini-metric"><span>授信余额</span><strong>14.8亿元</strong></div><div className="mini-metric"><span>担保及表外</span><strong>2.2亿元</strong></div><div className="mini-metric"><span>关联重点事项</span><strong>3项</strong></div><div className="mini-metric"><span>数据状态</span><strong>07:10已确认</strong></div></div><div className="detail-block"><h4>当前关注</h4><ul className="detail-list"><li>未来30日偿债安排、担保链及关联账户资金变化。</li><li>是否需要收紧新增授信、提款与续作策略。</li><li>是否存在成员公司间重复担保或风险缓释高估。</li></ul></div><div className="detail-block"><h4>建议 / 策略</h4><ul className="detail-list"><li>由银行统一集团客户ID、敞口与担保口径。</li><li>牵头形成联合处置方案，并于7月18日前回报集团。</li><li>信用卡事项继续周度观察，暂不调整正式风险等级。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-member">
                  <summary><span className="row-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h4"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">租赁</span><span className="status-pill ok">已确认</span></span><span className="row-desc">租赁债权4.2亿元 · 抵押物与租金回收</span></span><span className="row-side"><b>协同方</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">租赁的风险重点不只是债权余额，还包括抵押物价值、处置周期与未来两期租金回收可执行性。</p><div className="mini-grid"><div className="mini-metric"><span>租赁债权</span><strong>3.6亿元</strong></div><div className="mini-metric"><span>应收租金</span><strong>0.6亿元</strong></div><div className="mini-metric"><span>抵押物复估</span><strong>进行中</strong></div><div className="mini-metric"><span>下一反馈</span><strong>7月17日</strong></div></div><div className="detail-block"><h4>当前关注</h4><ul className="detail-list"><li>抵押物权属、最新估值和真实可处置周期。</li><li>未来两期租金来源及与银行重组方案的冲突。</li></ul></div><div className="detail-block"><h4>建议 / 策略</h4><ul className="detail-list"><li>补齐抵押物证据，避免仅使用历史评估值。</li><li>将回收节奏与银行债务重组安排统一。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-member">
                  <summary><span className="row-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 4-7"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">资管</span><span className="status-pill ok">已确认</span></span><span className="row-desc">债券与资管持仓1.8亿元 · 估值与流动性</span></span><span className="row-side"><b>协同方</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">资管需要同时处理主体信用变化与自身组合风险，重点是穿透持仓、估值、评级及二级市场流动性。</p><div className="mini-grid"><div className="mini-metric"><span>债券持仓</span><strong>1.2亿元</strong></div><div className="mini-metric"><span>资管计划</span><strong>0.6亿元</strong></div><div className="mini-metric"><span>成员VaR使用</span><strong>78%</strong></div><div className="mini-metric"><span>限额状态</span><strong>未触发</strong></div></div><div className="detail-block"><h4>当前关注</h4><ul className="detail-list"><li>持仓穿透、最新估值、评级变化和交易流动性。</li><li>区分已确认事实与市场传闻，避免单一舆情驱动正式结论。</li></ul></div><div className="detail-block"><h4>建议 / 策略</h4><ul className="detail-list"><li>将估值与持仓变化同步到集团客户统一风险视图。</li><li>对VaR使用率建立连续3个月跟踪，而非单月静态判断。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-member">
                  <summary><span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">产险</span><span className="status-pill warn">待确认</span></span><span className="row-desc">合同与应收关系0.6亿元 · 尚未确认实际敞口</span></span><span className="row-side"><b>待业务核验</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">当前只确认主体关系，尚不能确定合同应收、追偿或保证保险责任是否构成真实风险敞口。</p><div className="detail-block"><h4>需要核验</h4><ul className="detail-list"><li>合同履约、应收款项、潜在赔付与追偿关系。</li><li>0.6亿元是否为有效风险余额，还是业务关系映射结果。</li></ul></div><div className="detail-block"><h4>建议 / 策略</h4><ul className="detail-list"><li>如无实际敞口，从成员关注列表中移除。</li><li>如确认存在敞口，再由产险形成专业处置动作。</li></ul></div><div className="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>待确认金额不应计入正式集团风险余额。</span></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-member">
                  <summary><span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2 4 5v6c0 5 3.4 8.2 8 11 4.6-2.8 8-6 8-11V5l-8-3Z"/><path d="M9 11h6"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">寿险</span><span className="status-pill warn">数据待更新</span></span><span className="row-desc">投资持仓与对手方批次预计08:30完成</span></span><span className="row-side"><b>未完成</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">当前没有足够数据判断寿险是否受华东建设或地产链事件影响，因此不能标记为“稳定”。</p><div className="detail-block"><h4>待补信息</h4><ul className="detail-list"><li>债券、信托与资管计划穿透持仓。</li><li>对手方及担保关系映射。</li><li>批次完成后是否出现需重新审阅的新增事项。</li></ul></div><div className="detail-block"><h4>建议 / 策略</h4><ul className="detail-list"><li>08:30完成后自动回写日报数据边界。</li><li>如出现重大关联，标记“发布后有更新”并要求重新知悉。</li></ul></div></div>
                </details>
              </div>
            </div>

            <div className="impact-panel" id="impact-object" role="tabpanel">
              <div className="impact-summary">风险对象按<b>主体、事件、客群和市场冲击</b>组织，避免领导只能按风险条线理解问题。</div>
              <div className="accordion-list">
                <details className="accordion-item" data-accordion-group="impact-object" open>
                  <summary><span className="row-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M6 21V7l6-4 6 4v14"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">华东建设集团</span><span className="status-pill high">P0</span></span><span className="row-desc">新增出险 · 3家成员确认敞口</span></span><span className="row-side up"><b>23.6亿</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">风险状态变化明确、集团敞口较大且处置需要跨成员协同，是今日首要事项。</p><div className="mini-grid"><div className="mini-metric"><span>司法执行新增</span><strong>1.2亿元</strong></div><div className="mini-metric"><span>经营现金流</span><strong>连续3月为负</strong></div><div className="mini-metric"><span>已确认敞口</span><strong>23.0亿元</strong></div><div className="mini-metric"><span>待确认关系</span><strong>产险0.6亿元</strong></div></div><div className="detail-block"><h4>当前缺失</h4><ul className="detail-list"><li>最新担保链与未来30日偿债安排。</li><li>成员公司统一确认的敞口与回收口径。</li><li>产险是否构成真实业务敞口。</li></ul></div><button className="inline-action" type="button" data-event="huadong">查看完整事项详情</button></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-object">
                  <summary><span className="row-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="16" r="3"/><path d="m10.2 10.2 3.6 3.6"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">地产链外部事件</span><span className="status-pill warn">待核验</span></span><span className="row-desc">AI匹配11户潜在关联客户</span></span><span className="row-side"><b>38.4亿<br />潜在</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">外部信用事件已确认，但客户关联与真实业务影响仍处于AI匹配和专业公司核验阶段。</p><div className="mini-grid"><div className="mini-metric"><span>潜在客户</span><strong>11户</strong></div><div className="mini-metric"><span>可能成员</span><strong>4家公司</strong></div><div className="mini-metric"><span>潜在敞口</span><strong>38.4亿元</strong></div><div className="mini-metric"><span>当前状态</span><strong>待核查</strong></div></div><div className="detail-block"><h4>需要确认</h4><ul className="detail-list"><li>主体关系是否真实，是否为同名或弱关联。</li><li>实际余额、担保关系与供应链回款依赖。</li><li>哪些事项需要转为正式预警。</li></ul></div><div className="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>AI主体匹配不是正式业务影响结论。</span></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-object">
                  <summary><span className="row-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">信用卡高风险客群</span><span className="status-pill mid">升温</span></span><span className="row-desc">M1逾期率连续两周上升</span></span><span className="row-side"><b>+0.18pp</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">变化方向明确，但幅度尚未达到正式升级条件，当前重点是判断是否持续以及集中于哪些获客批次。</p><div className="mini-grid"><div className="mini-metric"><span>产品</span><strong>信用卡</strong></div><div className="mini-metric"><span>观察周期</span><strong>连续2周</strong></div><div className="mini-metric"><span>正式限额</span><strong>未触发</strong></div><div className="mini-metric"><span>主要成员</span><strong>银行</strong></div></div><div className="detail-block"><h4>下一步观察</h4><ul className="detail-list"><li>迁徙率、催收回收率与额度使用。</li><li>特定渠道、地区与客群集中度。</li><li>下一周期仍升温时，再进入工作台评估升级。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-object">
                  <summary><span className="row-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 18h16M6 15l4-4 3 2 5-6"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">海外长端利率上行</span><span className="status-pill warn">宏观冲击</span></span><span className="row-desc">外币融资成本与长久期资产承压</span></span><span className="row-side up"><b>+11bp</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">市场变化已发生，内部影响以敏感性映射为主，尚未形成实际限额触发。</p><div className="mini-grid"><div className="mini-metric"><span>敏感主体</span><strong>8家</strong></div><div className="mini-metric"><span>主要方向</span><strong>融资成本↑</strong></div><div className="mini-metric"><span>关联资产</span><strong>长久期固收</strong></div><div className="mini-metric"><span>数据边界</span><strong>1源延迟</strong></div></div><div className="detail-block"><h4>下一步观察</h4><ul className="detail-list"><li>跨境融资主体滚动到期与对冲安排。</li><li>境外债务和长久期资产的估值敏感性。</li><li>与地产链信用风险是否形成同向叠加。</li></ul></div></div>
                </details>
                <details className="accordion-item" data-accordion-group="impact-object">
                  <summary><span className="row-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg></span><span className="row-main"><span className="row-title-line"><span className="row-title">投资组合月度收益变化</span><span className="status-pill mid">关注</span></span><span className="row-desc">CII收益转负，集团VaR仍有余量</span></span><span className="row-side"><b>-0.42%</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary>
                  <div className="accordion-body"><p className="body-lead">这是月度复核对象，不应与今日实时事件使用同一时间尺度。</p><div className="mini-grid"><div className="mini-metric"><span>集团VaR</span><strong>426亿元</strong></div><div className="mini-metric"><span>限额使用率</span><strong>53.3%</strong></div><div className="mini-metric"><span>需关注成员</span><strong>3家</strong></div><div className="mini-metric"><span>复核状态</span><strong>已复核</strong></div></div><button className="inline-action" type="button" data-switch-investment>查看投资风险日报</button></div>
                </details>
              </div>
            </div>
          </article>
        </section>

        <section className="section" aria-labelledby="complete-title">
          <div className="section-head"><div><h2 id="complete-title">日报完整性</h2><p>明确区分“没有变化”和“数据未到”</p></div></div>
          <article className="card completeness-card">
            <div className="completeness-row"><span className="row-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 4 4L19 6"/></svg></span><div><strong>今日无重大变化</strong><p>流动性、操作、声誉合规保持稳定</p></div><span className="status-pill ok">3个领域</span></div>
            <div className="completeness-row"><span className="row-icon amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.3 2.7 1.9 17a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 2.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg></span><div><strong>数据待更新</strong><p>寿险批次与宏观景气1个来源尚未完成</p></div><span className="status-pill warn">不等于无风险</span></div>
          </article>
        </section>
      </section>

      <section className="tab-panel" id="panel-investment" role="tabpanel" hidden>
        <article className="card invest-hero"><div className="invest-hero-top"><div><h2>投资风险日报</h2><p>2026-06已复核 · 集团合并口径。综合日报只展示摘要，本页保留收益、VaR、成员和资产结构。</p></div><span className="reviewed">已复核</span></div><div className="invest-metrics"><div className="invest-metric"><span>集团投资规模</span><strong>8,426亿</strong><small>较上月 +1.8%</small></div><div className="invest-metric"><span>集团VaR</span><strong>426亿</strong><small>限额使用率53.3%</small></div><div className="invest-metric"><span>CII月度收益</span><strong className="negative">-0.42%</strong><small>由正转负</small></div><div className="invest-metric"><span>需关注成员</span><strong>3家</strong><small>1家新增</small></div></div></article>
        <section className="section"><div className="section-head"><div><h2>本期关键变化</h2><p>点击展开依据、成员差异和建议</p></div></div><div className="card accordion-list"><details className="accordion-item" data-accordion-group="invest" open><summary><span className="row-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg></span><span className="row-main"><span className="row-title">CII综合收益率转负</span><span className="row-desc">权益与另类资产是主要拖累</span></span><span className="row-side up"><b>-0.42%</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary><div className="accordion-body"><p className="body-lead">固定收益组合保持正贡献，收益恶化尚未转化为集团VaR或限额压力。</p><div className="detail-block"><h4>管理建议</h4><ul className="detail-list"><li>拆分成员公司和资产类别确认收益拖累来源。</li><li>观察下一周期是否持续，不因单月变化直接调整策略。</li></ul></div></div></details><details className="accordion-item" data-accordion-group="invest"><summary><span className="row-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 4-7"/></svg></span><span className="row-main"><span className="row-title">东部资管VaR使用率升至78%</span><span className="row-desc">单月上升12个百分点，仍低于限额</span></span><span className="row-side"><b>78%</b><svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7 10 5 5 5-5"/></svg></span></summary><div className="accordion-body"><p className="body-lead">上升速度比绝对水平更值得关注，建议建立连续3个月的组合跟踪。</p><div className="detail-block"><h4>关注点</h4><ul className="detail-list"><li>权益和非标资产的边际贡献。</li><li>压力情景下的流动性和限额空间。</li><li>与集团客户风险的持仓关联。</li></ul></div></div></details></div></section>
      </section>

      <section className="tab-panel" id="panel-history" role="tabpanel" hidden>
        <div className="history-list"><article className="history-card"><div className="history-top"><strong>7月16日 · 今日</strong><span className="status-pill mid">10:15有更新</span></div><p>信用风险升温，投资端月度收益转负；流动性与操作风险稳定。</p><div className="history-meta"><span>07:30初始版</span><span>5项知悉</span><span>1项待推动</span></div></article><article className="history-card"><div className="history-top"><strong>7月15日 · 星期三</strong><span className="status-pill ok">已发布</span></div><p>地产链预警资产小幅上升，宏观与投资风险无重大变化。</p><div className="history-meta"><span>07:30版</span><span>2项重点变化</span></div></article><article className="history-card"><div className="history-top"><strong>7月14日 · 星期二</strong><span className="status-pill ok">已发布</span></div><p>信用端新增重大预警1户；操作风险完成1项整改关闭。</p><div className="history-meta"><span>07:30版</span><span>3项重点变化</span></div></article></div>
      </section>
    </div>

    <div className="unified-composer" role="group" aria-label="统一AI对话入口">
      <button className="composer-ai" type="button" data-open-ai aria-label="打开AI风控助手">AI</button>
      <button className="composer-prompt" type="button" data-open-ai>总结变化、检查跟踪进度…</button>
      <button className="composer-icon" type="button" id="micButton" aria-label="语音输入"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg></button>
      <button className="composer-plus" type="button" data-open-ai aria-label="新建提问"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>

    <div className="backdrop" id="backdrop" aria-hidden="true"><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle"><div className="sheet-handle"></div><div id="sheetContent"></div></section></div>
    <div className="backdrop" id="aiBackdrop" aria-hidden="true"><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="aiTitle"><div className="sheet-handle"></div><div className="sheet-head"><div><h2 id="aiTitle">AI 风控助手</h2><p>基于当前简报、证据状态和工作台进展回答</p></div><button className="sheet-close" type="button" data-close-ai aria-label="关闭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div className="prompt-chips"><button className="prompt-chip" type="button">今天最需要关注什么？</button><button className="prompt-chip" type="button">成员公司的差异是什么？</button><button className="prompt-chip" type="button">处置卡在哪里？</button><button className="prompt-chip" type="button">哪些数据还没更新？</button></div><div className="chat-log" id="chatLog"><div className="message ai">华东建设集团新增出险是今日首要事项。银行、租赁和资管已有确认敞口，产险仍待业务核验；处置目前卡在跨成员敞口口径尚未统一。</div></div><form className="chat-input" id="chatForm"><input id="chatInput" placeholder="继续追问风险、成员影响或处置进展…" autoComplete="off"/><button type="submit" aria-label="发送"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 14-8-4 16-3-6-7-2Z"/><path d="m12 14 7-10"/></svg></button></form></section></div>
    <div className="toast" id="toast" role="status" aria-live="polite"></div>
  </main>
    </div>
  );
}
