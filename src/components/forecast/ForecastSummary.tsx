import type { Forecast } from "../../api/forecast";

interface Props {
  forecasts: Forecast[];
}

export default function ForecastSummary({ forecasts }: Props) {
  const totalInflow = forecasts.reduce((sum, item) => sum + item.inflow, 0);

  const totalOutflow = forecasts.reduce((sum, item) => sum + item.outflow, 0);

  const finalBalance =
    forecasts.length > 0 ? forecasts[forecasts.length - 1].projectedBalance : 0;

  const riskDays = forecasts.filter((item) => item.projectedBalance < 0);

  const firstRiskDay = riskDays[0];

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
    <div className="space-y-4">
      {firstRiskDay && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">⚠️ 자금 부족 위험 감지</p>

          <p className="mt-2 text-sm text-red-600">
            {firstRiskDay.date}에 예상 잔액이 ₩
            {firstRiskDay.projectedBalance.toLocaleString("ko-KR")}
            으로 떨어질 것으로 예상됩니다.
          </p>

          <p className="mt-1 text-sm text-red-600">
            해당 날짜까지 최소 ₩
            {Math.abs(firstRiskDay.projectedBalance).toLocaleString("ko-KR")}의
            추가 자금이 필요합니다.
          </p>
        </div>
      )}

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
    </div>
  );
}
