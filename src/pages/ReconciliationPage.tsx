import { useEffect, useState } from "react";

import {
  getReconciliation,
  type Reconciliation,
  type ValidationStatus,
} from "../api/reconciliation";

import {
  createSettlement,
  type CreateSettlementRequest,
} from "../api/settlements";

import SettlementForm from "../components/settlements/SettlementForm";

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
  const [selectedReconciliation, setSelectedReconciliation] =
    useState<Reconciliation | null>(null);

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

  const handleResolve = (item: Reconciliation) => {
    console.log("문제 해결 버튼 클릭:", item);
    console.log("대조 상태:", item.validationStatus);
    setSelectedReconciliation(item);
  };

  const handleCreateMissingSettlement = async (
    data: CreateSettlementRequest,
  ) => {
    await createSettlement(data);

    const updatedReconciliations = await getReconciliation();
    setReconciliations(updatedReconciliations);

    setSelectedReconciliation(null);
  };

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

          {selectedReconciliation?.validationStatus ===
            "MISSING_SETTLEMENT" && (
            <div className="rounded-2xl border border-[#DDE4FF] bg-[#F8FAFF] p-5">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-[#17213B]">
                  정산 누락 해결
                </h2>
                <p className="mt-1 text-sm text-[#8190B0]">
                  거래 ID {selectedReconciliation.transactionId}에 해당하는 정산
                  데이터를 등록해 주세요.
                </p>
                <p className="mt-1 text-sm text-[#8190B0]">
                  기존 매출액: ₩
                  {selectedReconciliation.saleAmount?.toLocaleString("ko-KR") ??
                    "-"}
                </p>
              </div>

              <SettlementForm
                key={selectedReconciliation.transactionId}
                defaultTransactionId={selectedReconciliation.transactionId}
                onSubmit={handleCreateMissingSettlement}
                onCancel={() => setSelectedReconciliation(null)}
              />
            </div>
          )}

          <ReconciliationTable
            reconciliations={filteredReconciliations}
            onResolve={handleResolve}
          />
        </>
      )}
    </div>
  );
}
