import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BriefV3Markup } from "./BriefV3Markup";
import "./brief-v3.css";

type EventSheetData = {
  title: string;
  meta: string;
  summary: string;
  metrics: Array<[string, string]>;
  evidence: Array<[string, string, string]>;
  missing: string;
};

const eventData: Record<string, EventSheetData> = {
  huadong: {
    title: "华东建设集团",
    meta: "P0 · 新增出险 · 08:15更新",
    summary: "风险状态由重大预警转为出险。新增司法执行1.2亿元，经营现金流连续3个月为负；银行、租赁、资管存在已确认交叉敞口。",
    metrics: [["集团敞口", "23.6亿元"], ["关联成员", "3确认+1待核"], ["处置阶段", "协同确认"], ["集团动作", "统一口径"]],
    evidence: [["新增司法执行1.2亿元", "已确认", "司法信息平台 · 07:05"], ["经营现金流连续3个月为负", "已确认", "银行客户风险系统 · 昨日收盘"], ["集团关联敞口23.6亿元", "待统一", "成员公司汇总 · 当前口径"]],
    missing: "仍缺最新担保链、未来30日偿债安排，以及产险是否构成实际业务敞口的确认。",
  },
  "black-swan": {
    title: "地产链信用事件扩散",
    meta: "P1 · 外部事件 · 07:50更新",
    summary: "外部信用事件已确认。AI在集团客户库中匹配到11户潜在关联客户，但真实业务关系和正式敞口尚未全部确认。",
    metrics: [["潜在客户", "11户"], ["潜在敞口", "38.4亿元"], ["可能成员", "4家公司"], ["当前状态", "待核查"]],
    evidence: [["外部信用事件已发生", "已确认", "公开信息监测 · 06:50"], ["11户集团客户主体匹配", "AI推断", "客户主数据与文本关联"], ["4家成员公司可能相关", "待确认", "内部业务关系映射"]],
    missing: "需要各专业公司确认客户真实业务关系、当前余额、供应链依赖和是否需要升级为正式预警。",
  },
  retail: {
    title: "信用卡高风险客群升温",
    meta: "P1 · 零售产品 · 昨日收盘",
    summary: "高风险客群M1逾期率连续两周抬升，较两周前增加0.18个百分点，尚未触发正式管理限额。",
    metrics: [["产品", "信用卡"], ["观察周期", "连续2周"], ["变化幅度", "+0.18pp"], ["限额状态", "未触发"]],
    evidence: [["M1逾期率上升0.18个百分点", "已确认", "零售风险日报 · 昨日收盘"], ["未触发正式限额", "规则结果", "零售组合阈值规则"], ["高风险客群集中度上升", "已确认", "客群监测模型"]],
    missing: "需继续观察下一周迁徙率、催收回收率和额度使用变化，当前不足以判断趋势持续。",
  },
};

const workbenchLabels = new Set(["进入工作台", "进入个人工作台", "转入个人工作台", "转入工作台"]);

export function BriefDetailPage() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const toast = root.querySelector<HTMLElement>("#toast");
    const backdrop = root.querySelector<HTMLElement>("#backdrop");
    const sheetContent = root.querySelector<HTMLElement>("#sheetContent");
    const aiBackdrop = root.querySelector<HTMLElement>("#aiBackdrop");
    const phoneShell = document.querySelector<HTMLElement>(".phone-shell");
    if (!toast || !backdrop || !sheetContent || !aiBackdrop) return;

    let toastTimer: number | undefined;
    const answerTimers = new Set<number>();
    let lastFocused: HTMLElement | null = null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousShellOverflow = phoneShell?.style.overflowY ?? "";

    const lockScroll = () => {
      document.body.style.overflow = "hidden";
      if (phoneShell) phoneShell.style.overflowY = "hidden";
    };

    const unlockScroll = () => {
      document.body.style.overflow = previousBodyOverflow;
      if (phoneShell) phoneShell.style.overflowY = previousShellOverflow;
    };

    const showToast = (text: string) => {
      if (toastTimer !== undefined) window.clearTimeout(toastTimer);
      toast.textContent = text;
      toast.classList.add("show");
      toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
    };

    const openSheet = (html: string) => {
      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      sheetContent.innerHTML = html;
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
      lockScroll();
      window.setTimeout(() => sheetContent.querySelector<HTMLButtonElement>(".sheet-close")?.focus(), 20);
    };

    const closeSheet = () => {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      unlockScroll();
      lastFocused?.focus();
    };

    const openAI = () => {
      lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      aiBackdrop.classList.add("open");
      aiBackdrop.setAttribute("aria-hidden", "false");
      lockScroll();
      window.setTimeout(() => root.querySelector<HTMLInputElement>("#chatInput")?.focus(), 30);
    };

    const closeAI = () => {
      aiBackdrop.classList.remove("open");
      aiBackdrop.setAttribute("aria-hidden", "true");
      unlockScroll();
      lastFocused?.focus();
    };

    const switchPageTab = (button: HTMLElement) => {
      const target = button.dataset.pageTab;
      if (!target) return;
      root.querySelectorAll<HTMLElement>("[data-page-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
      root.querySelectorAll<HTMLElement>(".tab-panel").forEach((panel) => { panel.hidden = panel.id !== `panel-${target}`; });
      phoneShell?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onClick = async (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const button = target.closest<HTMLButtonElement>("button");

      if (button && workbenchLabels.has(button.textContent?.trim() ?? "")) {
        closeSheet();
        closeAI();
        navigate("/watch");
        return;
      }

      if (button?.id === "shareButton") {
        try {
          if (typeof navigator.share === "function") {
            await navigator.share({ title: "今日风险简报", text: "7月16日集团风险略有升温，3项关键变化，1项待集团推动。" });
          } else {
            throw new Error("Web Share API unavailable");
          }
        } catch {
          showToast("日报摘要已生成（原型）");
        }
        return;
      }

      const pageTab = target.closest<HTMLElement>("[data-page-tab]");
      if (pageTab) {
        switchPageTab(pageTab);
        return;
      }

      if (target.closest("[data-switch-investment]")) {
        const investmentTab = root.querySelector<HTMLElement>('[data-page-tab="investment"]');
        if (investmentTab) switchPageTab(investmentTab);
        return;
      }

      const impactTab = target.closest<HTMLElement>("[data-impact-tab]");
      if (impactTab) {
        const impactTarget = impactTab.dataset.impactTab;
        root.querySelectorAll<HTMLElement>("[data-impact-tab]").forEach((item) => {
          item.classList.toggle("active", item === impactTab);
          item.setAttribute("aria-selected", String(item === impactTab));
        });
        root.querySelectorAll<HTMLElement>(".impact-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `impact-${impactTarget}`));
        return;
      }

      const filterChip = target.closest<HTMLElement>(".filter-chip");
      if (filterChip) {
        const filter = filterChip.dataset.filter;
        root.querySelectorAll<HTMLElement>(".filter-chip").forEach((item) => item.classList.toggle("active", item === filterChip));
        root.querySelectorAll<HTMLElement>(".focus-card[data-status]").forEach((card) => card.classList.toggle("hidden", filter !== "all" && card.dataset.status !== filter));
        return;
      }

      const eventTrigger = target.closest<HTMLElement>("[data-event]");
      if (eventTrigger) {
        const data = eventData[eventTrigger.dataset.event ?? ""];
        if (data) {
          event.stopPropagation();
          openSheet(eventSheet(data));
        }
        return;
      }

      if (button?.id === "coverageButton") {
        openSheet(coverageSheet());
        return;
      }
      if (button?.id === "openDisposal") {
        openSheet(disposalSheet());
        return;
      }
      if (button?.id === "editionButton") {
        openSheet(editionSheet());
        return;
      }

      if (target.closest("[data-open-ai]")) {
        openAI();
        return;
      }
      if (button?.id === "micButton") {
        showToast("语音输入已准备（原型）");
        return;
      }
      if (target.closest("[data-close-ai]")) {
        closeAI();
        return;
      }
      if (target === aiBackdrop) {
        closeAI();
        return;
      }
      if (target === backdrop) {
        closeSheet();
        return;
      }

      const promptChip = target.closest<HTMLButtonElement>(".prompt-chip");
      if (promptChip) {
        const input = root.querySelector<HTMLInputElement>("#chatInput");
        if (input) {
          input.value = promptChip.textContent ?? "";
          input.focus();
        }
        return;
      }

      const toastElement = target.closest<HTMLElement>("[data-toast]");
      if (toastElement) showToast(toastElement.dataset.toast ?? "");

      if (target.closest("[data-close-sheet]")) closeSheet();

      const action = target.closest<HTMLElement>("[data-sheet-action]");
      if (action) {
        const type = action.dataset.sheetAction;
        if (type === "ack") showToast("已记录知悉，不改变正式风险状态");
        if (type === "watch") showToast("已加入个人关注");
        closeSheet();
      }

      const edition = target.closest<HTMLElement>("[data-edition]");
      if (edition) {
        const editionLabel = root.querySelector<HTMLElement>("#editionLabel");
        if (editionLabel) {
          editionLabel.textContent = edition.dataset.edition === "1015" ? "10:15版" : "07:30版";
          showToast(`已切换至${editionLabel.textContent}`);
        }
        closeSheet();
      }
    };

    const onSubmit = (event: SubmitEvent) => {
      if (!(event.target instanceof HTMLFormElement) || event.target.id !== "chatForm") return;
      event.preventDefault();
      const input = root.querySelector<HTMLInputElement>("#chatInput");
      const log = root.querySelector<HTMLElement>("#chatLog");
      const text = input?.value.trim() ?? "";
      if (!input || !log || !text) return;
      log.insertAdjacentHTML("beforeend", `<div class="message user">${text.replace(/[<>]/g, "")}</div>`);
      input.value = "";
      const answerTimer = window.setTimeout(() => {
        let answer = "华东建设集团是今日首要事项；当前处置卡在成员公司敞口口径未统一，银行需在7月18日前牵头形成联合方案。";
        if (text.includes("成员")) answer = "银行17.0亿元、租赁4.2亿元、资管1.8亿元为已确认敞口；产险0.6亿元仅为业务关系映射，寿险数据仍待更新。";
        if (text.includes("数据")) answer = "寿险批次预计08:30完成，宏观景气有1个来源延迟；这两项均不能被解释为“无风险”。";
        if (text.includes("处置") || text.includes("卡在")) answer = "处置已进入协同确认阶段。最新障碍是银行、租赁与资管对敞口和回收口径尚未完全统一。";
        log.insertAdjacentHTML("beforeend", `<div class="message ai">${answer}</div>`);
        log.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        answerTimers.delete(answerTimer);
      }, 350);
      answerTimers.add(answerTimer);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (aiBackdrop.classList.contains("open")) closeAI();
      else if (backdrop.classList.contains("open")) closeSheet();
    };

    const details = Array.from(root.querySelectorAll<HTMLDetailsElement>("details[data-accordion-group]"));
    const detailHandlers = details.map((item) => {
      const handler = () => {
        if (!item.open) return;
        const group = item.dataset.accordionGroup;
        details.forEach((other) => {
          if (other !== item && other.dataset.accordionGroup === group) other.open = false;
        });
      };
      item.addEventListener("toggle", handler);
      return { item, handler };
    });

    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);
    document.addEventListener("keydown", onKeyDown);
    (window as Window & { __prototypeReady?: boolean }).__prototypeReady = true;

    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
      document.removeEventListener("keydown", onKeyDown);
      detailHandlers.forEach(({ item, handler }) => item.removeEventListener("toggle", handler));
      if (toastTimer !== undefined) window.clearTimeout(toastTimer);
      answerTimers.forEach((timer) => window.clearTimeout(timer));
      unlockScroll();
      delete (window as Window & { __prototypeReady?: boolean }).__prototypeReady;
    };
  }, [navigate]);

  return <BriefV3Markup rootRef={rootRef} />;
}

function closeIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m6 6 12 12M18 6 6 18"/></svg>';
}

function eventSheet(data: EventSheetData) {
  const metrics = data.metrics.map(([label, value]) => `<div class="mini-metric"><span>${label}</span><strong>${value}</strong></div>`).join("");
  const evidence = data.evidence.map(([text, status, source]) => `<div class="evidence-item"><div class="evidence-top"><strong>${text}</strong><em class="${status === "待确认" || status === "待统一" ? "pending" : status === "AI推断" ? "ai" : ""}">${status}</em></div><small>${source}</small></div>`).join("");
  return `<div class="sheet-head"><div><h2 id="sheetTitle">${data.title}</h2><p>${data.meta}</p></div><button class="sheet-close" type="button" data-close-sheet aria-label="关闭">${closeIcon()}</button></div><div class="sheet-section"><h3>风险摘要</h3><div class="sheet-info"><p>${data.summary}</p></div></div><div class="mini-grid">${metrics}</div><div class="sheet-section"><h3>关键证据与状态</h3><div class="evidence-list">${evidence}</div></div><div class="sheet-section"><h3>当前缺失信息</h3><div class="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>${data.missing}</span></div></div><div class="sheet-actions"><button type="button" data-sheet-action="ack">已知悉</button><button type="button" data-sheet-action="watch">标记关注</button><button class="full" type="button" data-sheet-action="workbench">转入个人工作台</button></div>`;
}

function coverageSheet() {
  const rows = [["信用风险", "07:18", "已更新"], ["宏观风险", "07:05", "1源延迟"], ["投资风险", "2026-06", "已复核"], ["流动性风险", "07:24", "已更新"], ["操作风险", "07:12", "已更新"], ["声誉与合规", "06:55", "已更新"], ["寿险成员数据", "预计08:30", "待更新"]];
  return `<div class="sheet-head"><div><h2 id="sheetTitle">数据覆盖与判断边界</h2><p>严格区分“无重大变化”与“数据尚未到达”</p></div><button class="sheet-close" type="button" data-close-sheet aria-label="关闭">${closeIcon()}</button></div><div class="sheet-section"><div class="evidence-list">${rows.map(([area, time, status]) => `<div class="evidence-item"><div class="evidence-top"><strong>${area}</strong><em class="${status.includes("待") || status.includes("延迟") ? "pending" : ""}">${status}</em></div><small>数据时点：${time}</small></div>`).join("")}</div></div><div class="sheet-section"><div class="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>寿险数据未完成、宏观景气1个来源延迟。当前没有新增结论，不等于相关领域“无风险”。</span></div></div>`;
}

function disposalSheet() {
  return `<div class="sheet-head"><div><h2 id="sheetTitle">华东建设集团处置方案</h2><p>来源：个人工作台 · 最近更新08:15</p></div><button class="sheet-close" type="button" data-close-sheet aria-label="关闭">${closeIcon()}</button></div><div class="sheet-section"><h3>联合处置方案</h3><div class="sheet-info"><p>由银行牵头，租赁与资管参与统一敞口、担保物和回收节奏；日报仅展示领导关心的阶段、障碍和下一节点。</p></div></div><div class="sheet-section"><h3>成员公司分工</h3><div class="evidence-list"><div class="evidence-item"><div class="evidence-top"><strong>银行 · 牵头归口</strong><em>进行中</em></div><small>核验偿债安排、重组条件和担保链；下一反馈7月17日18:00。</small></div><div class="evidence-item"><div class="evidence-top"><strong>租赁 · 协同</strong><em class="pending">待确认</em></div><small>完成抵押物复估和租金回收方案；缺最新处置周期。</small></div><div class="evidence-item"><div class="evidence-top"><strong>资管 · 协同</strong><em>已更新</em></div><small>持仓1.8亿元，核对估值、评级和流动性，未触发限额。</small></div></div></div><div class="sheet-section"><h3>集团待推动</h3><div class="boundary-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>统一成员公司敞口确认时点，并在7月18日前形成联合处置方案。正式分派、催办和审批仍在个人工作台完成。</span></div></div><div class="sheet-actions"><button type="button" data-close-sheet>返回日报</button><button type="button" data-sheet-action="workbench">进入工作台</button></div>`;
}

function editionSheet() {
  return `<div class="sheet-head"><div><h2 id="sheetTitle">选择日报版次</h2><p>新信息不会静默覆盖已发布日报</p></div><button class="sheet-close" type="button" data-close-sheet aria-label="关闭">${closeIcon()}</button></div><div class="sheet-section"><div class="evidence-list"><button class="evidence-item" style="text-align:left;width:100%" type="button" data-edition="0730"><div class="evidence-top"><strong>07:30 初始版</strong><em>当前</em></div><small>12/13数据源就绪 · 3项重点变化</small></button><button class="evidence-item" style="text-align:left;width:100%" type="button" data-edition="1015"><div class="evidence-top"><strong>10:15 增量版</strong><em class="pending">待重阅</em></div><small>新增1项重大预警，华东建设处置进展更新</small></button></div></div>`;
}
