import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CashFlowData {
  date: string;
  balance: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <section className="rounded-2xl border border-[#EDF0F8] bg-white p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#17213B]">
          향후 30일 현금흐름 예측
        </h2>
        <p className="mt-2 text-sm text-[#8190B0]">
          날짜별 예상 잔액 변화를 확인하세요.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5675FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5675FF" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#EDF0F8"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "#8190B0", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />

            <YAxis
              tickFormatter={(value: number) =>
                `${(value / 10000).toLocaleString("ko-KR")}만`
              }
              tick={{ fill: "#8190B0", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={70}
            />

            <Tooltip
              formatter={(value) =>
                `${Number(value).toLocaleString("ko-KR")}원`
              }
            />

            <Area
              type="monotone"
              dataKey="balance"
              name="예상 잔액"
              stroke="#5675FF"
              strokeWidth={3}
              fill="url(#balanceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
