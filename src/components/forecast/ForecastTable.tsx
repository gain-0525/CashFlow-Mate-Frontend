import type { Forecast } from "../../api/forecast";

interface Props {
  forecasts: Forecast[];
}

const riskLabels: Record<string, string> = {
  NORMAL: "정상",
  WARNING: "주의",
  DANGER: "위험",
};

const riskStyles: Record<string, string> = {
  NORMAL: "bg-green-50 text-green-700",
  WARNING: "bg-yellow-50 text-yellow-700",
  DANGER: "bg-red-50 text-red-700",
};

const formatAmount = (amount: number) => `₩${amount.toLocaleString("ko-KR")}`;

export default function ForecastTable({ forecasts }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#EDF0F8] bg-white">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-[#17213B]">
          날짜별 현금흐름 내역
        </h2>
      </div>

      <table className="w-full min-w-[800px] whitespace-nowrap text-left text-sm">
        <thead className="bg-[#F8FAFF] text-[#8190B0]">
          <tr>
            <th className="px-6 py-4">날짜</th>
            <th className="px-6 py-4 text-right">예상 유입액</th>
            <th className="px-6 py-4 text-right">예정 지출액</th>
            <th className="px-6 py-4 text-right">예상 잔액</th>
            <th className="px-6 py-4">위험 수준</th>
          </tr>
        </thead>

        <tbody>
          {forecasts.map((item) => (
            <tr key={item.date} className="border-t border-[#EDF0F8]">
              <td className="px-6 py-4">{item.date}</td>

              <td className="px-6 py-4 text-right text-green-700">
                {formatAmount(item.inflow)}
              </td>

              <td className="px-6 py-4 text-right text-red-600">
                {formatAmount(item.outflow)}
              </td>

              <td className="px-6 py-4 text-right font-semibold">
                {formatAmount(item.projectedBalance)}
              </td>

              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={`inline-flex w-max items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold ${
                    riskStyles[item.riskLevel] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {riskLabels[item.riskLevel] ?? item.riskLevel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
