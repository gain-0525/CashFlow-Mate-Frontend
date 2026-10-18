import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
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

  // 예상 잔액의 최솟값
  const minBalance = Math.min(
    0,
    ...forecasts.map((item) => item.projectedBalance),
  );

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

            {minBalance < 0 && (
              <ReferenceArea
                y1={minBalance}
                y2={0}
                fill="#FEE2E2"
                fillOpacity={0.5}
                strokeOpacity={0}
              />
            )}

            {/* 0원 기준 빨간 점선 */}
            <ReferenceLine
              y={0}
              stroke="#EF4444"
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />

            <Line
              type="monotone"
              dataKey="projectedBalance"
              name="예상 잔액"
              stroke="#5675FF"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;

                if (payload.projectedBalance >= 0) {
                  return <circle cx={cx} cy={cy} r={0} />;
                }

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#EF4444"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
