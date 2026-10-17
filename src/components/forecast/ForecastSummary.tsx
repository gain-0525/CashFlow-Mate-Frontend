import type { Forecast } from "../../api/forecast";

interface Props {
  forecasts: Forecast[];
}

export default function ForecastSummary({ forecasts }: Props) {
  const totalInflow = forecasts.reduce((sum, item) => sum + item.inflow, 0);

  const totalOutflow = forecasts.reduce((sum, item) => sum + item.outflow, 0);

  const finalBalance =
    forecasts.length > 0 ? forecasts[forecasts.length - 1].projectedBalance : 0;

  const cards = [
    {
      label: "예상 총유입액",
      value: totalInflow,
    },
    {
      label: "예정 총지출액",
      value: totalOutflow,
    },
    {
      label: "최종 예상 잔액",
      value: finalBalance,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#EDF0F8] bg-white p-6"
        >
          <p className="text-sm text-[#8190B0]">{card.label}</p>

          <p className="mt-3 text-2xl font-bold text-[#17213B]">
            ₩{card.value.toLocaleString("ko-KR")}
          </p>
        </div>
      ))}
    </div>
  );
}
