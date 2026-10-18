import type { Reconciliation } from "../../api/reconciliation";

interface Props {
  reconciliations: Reconciliation[];
  onResolve: (item: Reconciliation) => void;
}

const statusLabels: Record<string, string> = {
  MATCHED: "일치",
  AMOUNT_MISMATCH: "금액 불일치",
  MISSING_SETTLEMENT: "정산 누락",
  MISSING_SALE: "매출 누락",
};

const statusStyles: Record<string, string> = {
  MATCHED: "bg-green-50 text-green-700",
  AMOUNT_MISMATCH: "bg-red-50 text-red-600",
  MISSING_SETTLEMENT: "bg-orange-50 text-orange-700",
  MISSING_SALE: "bg-red-50 text-red-600",
};

const formatAmount = (amount: number | null) => {
  return amount === null ? "-" : `₩${amount.toLocaleString("ko-KR")}`;
};

export default function ReconciliationTable({
  reconciliations,
  onResolve,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#EDF0F8] bg-white">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[#17213B]">대조 내역</h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-[#F8FAFF] text-[#8190B0]">
          <tr>
            <th className="px-6 py-4">거래 ID</th>
            <th className="px-6 py-4 text-right">매출액</th>
            <th className="px-6 py-4 text-right">금액 차이</th>
            <th className="px-6 py-4 text-right">정산 기준액</th>
            <th className="px-6 py-4">대조 결과</th>
            <th className="px-6 py-4 text-center">관리</th>
          </tr>
        </thead>

        <tbody>
          {reconciliations.map((item) => (
            <tr key={item.transactionId} className="border-t border-[#EDF0F8]">
              <td className="px-6 py-4 font-medium">{item.transactionId}</td>
              <td className="px-6 py-4 text-right">
                {formatAmount(item.saleAmount)}
              </td>
              <td className="px-6 py-4 text-right">
                {item.saleAmount !== null && item.settlementAmount !== null
                  ? `₩${Math.abs(
                      item.saleAmount - item.settlementAmount,
                    ).toLocaleString("ko-KR")}`
                  : "-"}
              </td>
              <td className="px-6 py-4 text-right">
                {formatAmount(item.settlementAmount)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    statusStyles[item.validationStatus]
                  }`}
                >
                  {statusLabels[item.validationStatus]}
                </span>
              </td>

              <td className="px-6 py-4 text-center">
                {item.validationStatus !== "MATCHED" ? (
                  <button
                    type="button"
                    onClick={() => onResolve(item)}
                    className="whitespace-nowrap rounded-lg border border-[#DDE4F0] px-3 py-2 text-sm font-medium text-[#5675FF] transition-colors hover:bg-[#F5F7FF]"
                  >
                    문제 해결
                  </button>
                ) : (
                  <span className="text-[#8190B0]">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reconciliations.length === 0 && (
        <p className="p-8 text-center text-sm text-[#8190B0]">
          대조 내역이 없습니다.
        </p>
      )}
    </div>
  );
}
