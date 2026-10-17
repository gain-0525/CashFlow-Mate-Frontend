import { useEffect, useState } from "react";

import {
  getReconciliation,
  type Reconciliation,
  type ValidationStatus,
} from "../api/reconciliation";

import ReconciliationSummary from "../components/reconciliation/ReconciliationSummary";
import ReconciliationTable from "../components/reconciliation/ReconciliationTable";
import ReconciliationAnalysis from "../components/reconciliation/ReconciliationAnalysis";

type FilterStatus = "ALL" | ValidationStatus;

const filters: { label: string; value: FilterStatus }[] = [
  { label: "전체", value: "ALL" },
  { label: "정상", value: "MATCHED" },
  { label: "금액 불일치", value: "AMOUNT_MISMATCH" },
  { label: "정산 누락", value: "MISSING_SETTLEMENT" },
  { label: "매출 누락", value: "MISSING_SALE" },
];

export default function ReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReconciliation = async () => {
      try {
        const data = await getReconciliation();
        setReconciliations(data);
      } catch {
        setError("대조 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReconciliation();
  }, []);

  const filteredReconciliations = reconciliations.filter((item) => {
    const matchesFilter =
      activeFilter === "ALL" || item.validationStatus === activeFilter;

    const matchesSearch = item.transactionId
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>대조 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <ReconciliationSummary reconciliations={reconciliations} />
          <ReconciliationAnalysis reconciliations={reconciliations} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === filter.value
                      ? "bg-[#5675FF] text-white"
                      : "bg-white text-[#8190B0] hover:bg-[#F8FAFF]"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="거래 ID 검색"
              className="w-64 max-w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
            />
          </div>

          <ReconciliationTable reconciliations={filteredReconciliations} />
        </>
      )}
    </div>
  );
}
