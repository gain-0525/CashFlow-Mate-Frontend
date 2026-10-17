import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { Forecast } from "../../api/forecast";

interface Props {
  forecasts: Forecast[];
}

export default function ForecastChart({ forecasts }: Props) {
  const chartData = forecasts.map((item) => ({
    ...item,
    dateLabel: item.date.slice(5),
  }));

  return (
    <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-[#17213B]">
        예상 잔액 추이
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDF0F8" />

            <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} />

            <YAxis
              tickFormatter={(value: number) =>
                `${(value / 10000).toLocaleString("ko-KR")}만`
              }
              tick={{ fontSize: 12 }}
              width={65}
            />

            <Tooltip
              formatter={(value) => `₩${Number(value).toLocaleString("ko-KR")}`}
            />

            <Line
              type="monotone"
              dataKey="projectedBalance"
              name="예상 잔액"
              stroke="#5675FF"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
