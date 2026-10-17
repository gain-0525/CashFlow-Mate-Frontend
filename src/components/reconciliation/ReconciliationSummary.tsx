import type { Reconciliation } from "../../api/reconciliation";

interface Props {
  reconciliations: Reconciliation[];
}

export default function ReconciliationSummary({ reconciliations }: Props) {
  const totalCount = reconciliations.length;

  const matchedCount = reconciliations.filter(
    (item) => item.validationStatus === "MATCHED",
  ).length;

  const mismatchCount = totalCount - matchedCount;

  const cards = [
    { label: "전체 거래", value: `${totalCount}건` },
    { label: "정상 거래", value: `${matchedCount}건` },
    { label: "이상 거래", value: `${mismatchCount}건` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#EDF0F8] bg-white p-6"
        >
          <p className="text-sm text-[#8190B0]">{card.label}</p>
          <p className="mt-3 text-2xl font-bold text-[#17213B]">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
