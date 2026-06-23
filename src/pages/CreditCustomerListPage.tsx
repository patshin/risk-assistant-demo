import { useState } from "react";
import { ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomAskBar, PageHeader, useCopilot } from "../components";
import { creditCustomerStats, customerFilters, filterCreditCustomers, type CustomerFilter } from "../data/creditCustomers";
import { CustomerRiskCard } from "./CreditRiskPage";

const PAGE_SIZE = 10;

export function CreditCustomerListPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();
  const [filter, setFilter] = useState<CustomerFilter>("全部");
  const [page, setPage] = useState(1);
  const stats = creditCustomerStats();
  const filteredCustomers = filterCreditCustomers(filter);
  const pageCount = Math.max(Math.ceil(filteredCustomers.length / PAGE_SIZE), 1);
  const pageCustomers = filteredCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeFilter(nextFilter: CustomerFilter) {
    setFilter(nextFilter);
    setPage(1);
  }

  return (
    <div className="page credit-page">
      <div className="page-scroll credit-detail">
        <PageHeader
          title="全部客户风险"
          onBack={() => navigate("/credit")}
          action={
            <button className="icon-button" type="button" aria-label="筛选">
              <ListFilter size={18} />
            </button>
          }
        />

        <section className="customer-list-summary glass-card">
          <span>AI 统计摘要</span>
          <h2>当前共 {stats.total} 家集团/公司存在风险信号</h2>
          <p>一级预警 {stats.firstLevel} 家 · 二级预警 {stats.secondLevel} 家 · 已出险 {stats.defaulted} 家 · 关注中 {stats.watching} 家</p>
        </section>

        <div className="credit-chip-row customer-list-filters">
          {customerFilters.map((item) => (
            <button className={item === filter ? "is-active" : ""} type="button" key={item} onClick={() => changeFilter(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="customer-card-list">
          {pageCustomers.map((customer) => (
            <CustomerRiskCard customer={customer} key={customer.id} />
          ))}
        </div>

        <div className="customer-pagination">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>
            上一页
          </button>
          <span>{page} / {pageCount}</span>
          <button type="button" disabled={page === pageCount} onClick={() => setPage((current) => Math.min(current + 1, pageCount))}>
            下一页
          </button>
        </div>
      </div>

      <BottomAskBar onOpen={() => openCopilot({ context: "正在分析“全部客户风险列表”" })} />
    </div>
  );
}
