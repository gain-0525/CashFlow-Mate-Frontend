import type { Reconciliation } from "../../api/reconciliation";

interface Props {
  reconciliations: Reconciliation[];
}

export default function ReconciliationAnalysis({ reconciliations }: Props) {
  const analysisItems = [
    {
      label: "금액 불일치",
      status: "AMOUNT_MISMATCH",
    },
    {
      label: "정산 누락",
      status: "MISSING_SETTLEMENT",
    },
    {
      label: "매출 누락",
      status: "MISSING_SALE",
    },
  ];

  return (
    <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-[#17213B]">
        이상 거래 분석
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {analysisItems.map((item) => {
          const count = reconciliations.filter(
            (reconciliation) => reconciliation.validationStatus === item.status,
          ).length;

          return (
            <div key={item.status} className="rounded-xl bg-[#F8FAFF] p-5">
              <p className="text-sm text-[#8190B0]">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-[#17213B]">
                {count}건
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
