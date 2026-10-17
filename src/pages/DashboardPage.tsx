import { AlertCircle, ArrowDownToLine, TrendingUp, Wallet } from "lucide-react";

import SummaryCard from "../components/dashboard/SummaryCard";
import CashFlowChart from "../components/dashboard/CashFlowChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="총 매출"
          value="₩12,500,000"
          description="등록된 매출 합계"
          icon={TrendingUp}
        />

        <SummaryCard
          title="총 정산액"
          value="₩11,800,000"
          description="등록된 정산 금액 합계"
          icon={ArrowDownToLine}
          iconColor="#8B5CF6"
        />

        <SummaryCard
          title="정산 불일치"
          value="3건"
          description="확인이 필요한 정산 내역"
          icon={AlertCircle}
          iconColor="#F59E0B"
        />

        <SummaryCard
          title="예상 잔액"
          value="₩8,400,000"
          description="향후 현금흐름 예측"
          icon={Wallet}
          iconColor="#10B981"
        />
      </div>

      <CashFlowChart data={mockForecast} />
    </div>
  );
}

const mockForecast = Array.from({ length: 30 }, (_, index) => {
  const date = new Date(2026, 9, 17 + index);

  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    balance: 8000000 + index * 120000 + Math.sin(index / 3) * 500000,
  };
});
