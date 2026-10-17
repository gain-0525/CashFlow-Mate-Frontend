import { useEffect, useState } from "react";

import {
  getSettlements,
  createSettlement,
  type Settlement,
  type CreateSettlementRequest,
} from "../api/settlements";
import SettlementForm from "../components/settlements/SettlementForm";
import SettlementsCsvUpload from "../components/settlements/SettlementCsvUpload";

const validationLabels: Record<string, string> = {
  MATCHED: "일치",
  AMOUNT_MISMATCH: "금액 불일치",
  MISSING_SALE: "매출 누락",
};

const statusLabels: Record<string, string> = {
  SCHEDULED: "정산 예정",
  COMPLETED: "정산 완료",
};

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const data = await getSettlements();
        setSettlements(data);
      } catch {
        setError("정산 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlements();
  }, []);

  const totalNetAmount = settlements.reduce(
    (sum, settlement) => sum + settlement.netAmount,
    0,
  );

  const mismatchCount = settlements.filter(
    (settlement) => settlement.validationStatus !== "MATCHED",
  ).length;

  const filteredSettlements = settlements.filter((settlement) =>
    settlement.transactionId
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  );

  const handleCreateSettlement = async (data: CreateSettlementRequest) => {
    await createSettlement(data);

    const updatedSettlements = await getSettlements();
    setSettlements(updatedSettlements);

    setIsFormOpen(false);
  };

  const handleUploadSuccess = async () => {
    const data = await getSettlements();
    setSettlements(data);
    setUploadMessage("정산 CSV가 업로드가 완료되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <SettlementsCsvUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(message) => setUploadMessage(message)}
        />

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4564E8]"
        >
          정산 등록
        </button>
      </div>

      {uploadMessage && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            uploadMessage.includes("완료")
              ? "border-[#D7E9DD] bg-[#F0FDF4] text-[#15803D]"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {uploadMessage.includes("완료") ? "✓" : "!"} {uploadMessage}
        </div>
      )}

      {isFormOpen && (
        <SettlementForm
          onSubmit={handleCreateSettlement}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isLoading ? (
        <p>정산 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="총 실정산액"
              value={`₩${totalNetAmount.toLocaleString("ko-KR")}`}
            />
            <SummaryCard
              label="총 정산 건수"
              value={`${settlements.length}건`}
            />
            <SummaryCard label="대조 이상 건수" value={`${mismatchCount}건`} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#EDF0F8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <h2 className="text-lg font-semibold text-[#17213B]">
                정산 내역
              </h2>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="거래 ID 검색"
                className="w-64 max-w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
              />
            </div>

            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#F8FAFF] text-[#8190B0]">
                <tr>
                  <th className="px-6 py-4">거래 ID</th>
                  <th className="px-6 py-4">정산 예정일</th>
                  <th className="px-6 py-4 text-right">정산 기준액</th>
                  <th className="px-6 py-4 text-right">수수료</th>
                  <th className="px-6 py-4 text-right">실정산액</th>
                  <th className="px-6 py-4">정산 상태</th>
                  <th className="px-6 py-4">대조 결과</th>
                </tr>
              </thead>

              <tbody>
                {filteredSettlements.map((settlement) => (
                  <tr key={settlement.id} className="border-t border-[#EDF0F8]">
                    <td className="px-6 py-4 font-medium">
                      {settlement.transactionId}
                    </td>
                    <td className="px-6 py-4">{settlement.settlementDate}</td>
                    <td className="px-6 py-4 text-right">
                      ₩{settlement.grossAmount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      ₩{settlement.feeAmount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ₩{settlement.netAmount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4">
                      {statusLabels[settlement.status] ?? settlement.status}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-3 py-1 text-xs font-semibold ${
                          settlement.validationStatus === "MATCHED"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {validationLabels[settlement.validationStatus] ??
                          settlement.validationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSettlements.length === 0 && (
              <p className="p-8 text-center text-sm text-[#8190B0]">
                {searchQuery
                  ? "검색 결과가 없습니다."
                  : "등록된 정산 내역이 없습니다."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
      <p className="text-sm text-[#8190B0]">{label}</p>
      <p className="mt-3 text-2xl font-bold text-[#17213B]">{value}</p>
    </div>
  );
}
