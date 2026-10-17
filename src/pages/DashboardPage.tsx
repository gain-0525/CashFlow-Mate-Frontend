import { useEffect, useState } from "react";
import { AlertCircle, ArrowDownToLine, TrendingUp, Wallet } from "lucide-react";
import { getSales, type Sale } from "../api/sales";
import { getSettlements, type Settlement } from "../api/settlements";

import SummaryCard from "../components/dashboard/SummaryCard";
import CashFlowChart from "../components/dashboard/CashFlowChart";
import { getForecast, type Forecast } from "../api/forecast";

export default function DashboardPage() {
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const data = await getForecast();
        setForecast(data);
      } catch (error) {
        console.error("현금흐름 예측 조회 실패:", error);
        setError("현금흐름 예측 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchForecast();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales();
        setSales(data);
      } catch (error) {
        console.error("매출 조회 실패:", error);
      }
    };
    fetchSales();
  }, []);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const data = await getSettlements();
        setSettlements(data);
      } catch (error) {
        console.error("정산 조회 실패:", error);
      }
    };
    fetchSettlements();
  }, []);

  const chartData = forecast.map((item) => ({
    date: item.date.slice(5).replace("-", "/"),
    balance: item.projectedBalance,
  }));

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSettlements = settlements.reduce(
    (sum, settlement) => sum + settlement.netAmount,
    0,
  );

  const mismatchCount = settlements.filter(
    (settlements) =>
      settlements.validationStatus === "AMOUNT_MISMATCH" ||
      settlements.validationStatus === "MISSING_SALE",
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="총 매출"
          value={`₩${totalSales.toLocaleString("ko-KR")}`}
          description="등록된 매출 합계"
          icon={TrendingUp}
        />

        <SummaryCard
          title="총 정산액"
          value={`₩${totalSettlements.toLocaleString("ko-KR")}`}
          description="등록된 정산 금액 합계"
          icon={ArrowDownToLine}
          iconColor="#8B5CF6"
        />

        <SummaryCard
          title="정산 불일치"
          value={`${mismatchCount}건`}
          description="확인이 필요한 정산 내역"
          icon={AlertCircle}
          iconColor="#F59E0B"
        />

        <SummaryCard
          title="예상 잔액"
          value={
            forecast.length > 0
              ? `₩${forecast[forecast.length - 1].projectedBalance.toLocaleString("ko-KR")}`
              : "-"
          }
          description="예측 기간 마지막 날의 잔액"
          icon={Wallet}
          iconColor="#10B981"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-[#8190B0]">
          현금흐름 데이터를 불러오던 중입니다...
        </p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : forecast.length === 0 ? (
        <p className="text-sm text-[#8190B0]">
          현금흐름 예측 데이터가 없습니다.
        </p>
      ) : (
        <CashFlowChart data={chartData} />
      )}
    </div>
  );
}
