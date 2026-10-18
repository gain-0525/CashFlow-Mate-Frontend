import { useEffect, useState } from "react";

import type { UploadResult } from "../api/sales";
import {
  getSettlements,
  createSettlement,
  updateSettlement,
  deleteSettlement,
  type Settlement,
  type CreateSettlementRequest,
} from "../api/settlements";
import SettlementForm from "../components/settlements/SettlementForm";
import SettlementsCsvUpload from "../components/settlements/SettlementCsvUpload";
import { Download } from "lucide-react";

const validationLabels: Record<string, string> = {
  MATCHED: "일치",
  AMOUNT_MISMATCH: "금액 불일치",
  MISSING_SALE: "매출 누락",
  INVALID_DATA: "정산 데이터 오류",
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
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [editingSettlement, setEditingSettlement] = useState<Settlement | null>(
    null,
  );

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
  };

  const handleUpdateSettlement = async (data: CreateSettlementRequest) => {
    if (!editingSettlement) return;

    await updateSettlement(editingSettlement.id, data);

    const updatedSettlements = await getSettlements();
    setSettlements(updatedSettlements);

    setEditingSettlement(null);
    setIsFormOpen(false);
  };

  const handleDeleteSettlement = async (settlement: Settlement) => {
    const isConfirmed = window.confirm(
      `${settlement.transactionId} 정산 내역을 삭제하시겠습니까?`,
    );

    if (!isConfirmed) return;

    try {
      await deleteSettlement(settlement.id);

      setSettlements((prev) =>
        prev.filter((item) => item.id !== settlement.id),
      );
    } catch {
      window.alert("정산 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <a
          href="/templates/settlements-template.csv"
          download="settlements-template.csv"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8ECF6] bg-white px-5 py-3 text-sm font-semibold text-[#3156D3] transition-colors hover:bg-[#F5F7FF]"
        >
          <Download size={17} />
          CSV 양식 다운로드
        </a>
        <SettlementsCsvUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={(message) => {
            setUploadMessage(message);

            if (message) {
              setUploadResult(null);
            }
          }}
          onUploadResult={setUploadResult}
        />

        <button
          type="button"
          onClick={() => {
            setEditingSettlement(null);
            setIsFormOpen(true);
          }}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4564E8]"
        >
          정산 등록
        </button>
      </div>

      {uploadResult && (
        <section className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#17213B]">
                CSV 업로드 결과
              </h2>
              <p className="mt-1 text-sm text-[#8190B0]">
                {uploadResult.fileName}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUploadResult(null)}
              className="text-sm text-[#8190B0] hover:text-[#17213B]"
            >
              닫기 ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#F8FAFF] p-4">
              <p className="text-sm text-[#8190B0]">전체 데이터</p>
              <p className="mt-2 text-2xl font-bold text-[#17213B]">
                {uploadResult.totalRows}건
              </p>
            </div>

            <div className="rounded-xl bg-[#F0FDF4] p-4">
              <p className="text-sm text-[#15803D]">성공</p>
              <p className="mt-2 text-2xl font-bold text-[#15803D]">
                {uploadResult.successRows}건
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF5F5] p-4">
              <p className="text-sm text-[#DC2626]">실패</p>
              <p className="mt-2 text-2xl font-bold text-[#DC2626]">
                {uploadResult.errorRows}건
              </p>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold text-[#DC2626]">
                오류 상세 ({uploadResult.errors.length}건)
              </h3>

              <div className="overflow-hidden rounded-xl border border-[#EDF0F8]">
                {uploadResult.errors.map((error, index) => (
                  <div
                    key={`${error.rowNumber}-${index}`}
                    className="flex flex-col gap-1 border-b border-[#EDF0F8] px-4 py-3 last:border-b-0 sm:flex-row sm:gap-4"
                  >
                    <span className="shrink-0 text-sm font-semibold text-[#DC2626]">
                      {error.rowNumber}행
                    </span>

                    <span className="shrink-0 text-xs text-[#8190B0] sm:w-44">
                      {error.errorCode}
                    </span>

                    <span className="text-sm text-[#475569]">
                      {error.errorMessage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {uploadMessage && (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            uploadMessage.includes("완료")
              ? "border-[#D7E9DD] bg-[#F0FDF4] text-[#15803D]"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {uploadMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            >
              ! {uploadMessage}
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <SettlementForm
          key={editingSettlement?.id ?? "create"}
          initialData={editingSettlement ?? undefined}
          onSubmit={
            editingSettlement ? handleUpdateSettlement : handleCreateSettlement
          }
          onCancel={() => {
            setIsFormOpen(false);
            setEditingSettlement(null);
          }}
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
                  <th className="px-6 py-4 text-center">관리</th>
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSettlement(settlement);
                            setIsFormOpen(true);
                          }}
                          className="rounded-lg border border-[#DDE4F0] px-3 py-2 text-sm font-medium text-[#5675FF] hover:bg-[#F5F7FF]"
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSettlement(settlement)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
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
