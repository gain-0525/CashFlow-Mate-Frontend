import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getSales, type Sale } from "../api/sales";
import { getSettlements, type Settlement } from "../api/settlements";
import { getExpenses, type Expense } from "../api/expenses";

export default function CashFlowCalendarPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [sales, setSales] = useState<Sale[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, settlementsData, expensesData] = await Promise.all([
          getSales(),
          getSettlements(),
          getExpenses(),
        ]);

        setSales(salesData);
        setSettlements(settlementsData);
        setExpenses(expensesData);
      } catch {
        setError("자금 흐름 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const moveMonth = (offset: number) => {
    setCurrentMonth(new Date(year, month + offset, 1));
    setSelectedDate(null);
  };

  const getDailyAmounts = (date: string) => {
    const salesAmount = sales
      .filter((sale) => sale.saleDate === date)
      .reduce((sum, sale) => sum + sale.amount, 0);

    const settlementAmount = settlements
      .filter((settlement) => settlement.settlementDate === date)
      .reduce((sum, settlement) => sum + settlement.netAmount, 0);

    const expenseAmount = expenses
      .filter((expense) => expense.dueDate === date)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return { salesAmount, settlementAmount, expenseAmount };
  };

  const selectedSales = sales.filter((sale) => sale.saleDate === selectedDate);

  const selectedSettlements = settlements.filter(
    (settlement) => settlement.settlementDate === selectedDate,
  );

  const selectedExpenses = expenses.filter(
    (expense) => expense.dueDate === selectedDate,
  );

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-[#8190B0]">
        자금 흐름 데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#17213B]">
            {year}년 {month + 1}월
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => moveMonth(-1)}
              className="rounded-lg p-2 hover:bg-[#F5F7FF]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label="다음 달"
              onClick={() => moveMonth(1)}
              className="rounded-lg p-2 hover:bg-[#F5F7FF]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-[#8190B0]"
            >
              {day}
            </div>
          ))}

          {dates.map((day, index) => {
            const dateKey =
              day === null
                ? null
                : `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const isSelected = dateKey === selectedDate;
            const dailyAmounts = dateKey ? getDailyAmounts(dateKey) : null;

            return (
              <button
                key={dateKey ?? `empty-${index}`}
                type="button"
                disabled={day === null}
                onClick={() => dateKey && setSelectedDate(dateKey)}
                className={`flex min-h-32 flex-col items-start justify-start rounded-xl border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-[#5675FF] bg-[#F0F3FF]"
                    : "border-[#EDF0F8] hover:bg-[#F8FAFF]"
                }`}
              >
                {day !== null && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-[#17213B]">
                      {day}
                    </span>

                    <div className="space-y-1.5">
                      {dailyAmounts && dailyAmounts.salesAmount > 0 && (
                        <div className="rounded-md bg-[#E9EEFF] px-2 py-1.5 text-xs font-medium text-[#3156D3]">
                          매출{" "}
                          {dailyAmounts.salesAmount.toLocaleString("ko-KR")}원
                        </div>
                      )}

                      {dailyAmounts && dailyAmounts.settlementAmount > 0 && (
                        <div className="rounded-md bg-[#DCFCE7] px-2 py-1.5 text-xs font-medium text-[#15803D]">
                          정산{" "}
                          {dailyAmounts.settlementAmount.toLocaleString(
                            "ko-KR",
                          )}
                          원
                        </div>
                      )}

                      {dailyAmounts && dailyAmounts.expenseAmount > 0 && (
                        <div className="rounded-md bg-[#FEE2E2] px-2 py-1.5 text-xs font-medium text-[#B91C1C]">
                          지출{" "}
                          {dailyAmounts.expenseAmount.toLocaleString("ko-KR")}원
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-5 rounded-2xl border border-[#EDF0F8] bg-white p-6">
          <h3 className="text-lg font-semibold text-[#17213B]">
            {selectedDate} 자금 흐름
          </h3>

          {/* 날짜별 금액 요약 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#E9EEFF] p-4">
              <p className="text-sm text-[#3156D3]">매출 발생액</p>
              <p className="mt-2 text-xl font-bold text-[#3156D3]">
                ₩
                {selectedSales
                  .reduce((sum, sale) => sum + sale.amount, 0)
                  .toLocaleString("ko-KR")}
              </p>
            </div>

            <div className="rounded-xl bg-[#DCFCE7] p-4">
              <p className="text-sm text-[#15803D]">정산액</p>
              <p className="mt-2 text-xl font-bold text-[#15803D]">
                ₩
                {selectedSettlements
                  .reduce((sum, settlement) => sum + settlement.netAmount, 0)
                  .toLocaleString("ko-KR")}
              </p>
            </div>

            <div className="rounded-xl bg-[#FEE2E2] p-4">
              <p className="text-sm text-[#B91C1C]">지출액</p>
              <p className="mt-2 text-xl font-bold text-[#B91C1C]">
                ₩
                {selectedExpenses
                  .reduce((sum, expense) => sum + expense.amount, 0)
                  .toLocaleString("ko-KR")}
              </p>
            </div>
          </div>

          {/* 매출 상세 */}
          <section className="space-y-3">
            <h4 className="font-semibold text-[#17213B]">
              매출 내역 ({selectedSales.length}건)
            </h4>

            {selectedSales.length === 0 ? (
              <p className="text-sm text-[#8190B0]">
                해당 날짜의 매출 내역이 없습니다.
              </p>
            ) : (
              selectedSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF0F8] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#17213B]">
                      {sale.transactionId}
                    </p>
                    <p className="mt-1 text-xs text-[#8190B0]">
                      결제 수단: {sale.paymentMethod}
                    </p>
                  </div>

                  <p className="font-semibold text-[#3156D3]">
                    ₩{sale.amount.toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </section>

          {/* 정산 상세 */}
          <section className="space-y-3">
            <h4 className="font-semibold text-[#17213B]">
              정산 내역 ({selectedSettlements.length}건)
            </h4>

            {selectedSettlements.length === 0 ? (
              <p className="text-sm text-[#8190B0]">
                해당 날짜의 정산 내역이 없습니다.
              </p>
            ) : (
              selectedSettlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF0F8] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#17213B]">
                      {settlement.transactionId}
                    </p>
                    <p className="mt-1 text-xs text-[#8190B0]">
                      {settlement.status === "COMPLETED"
                        ? "정산 완료"
                        : settlement.status === "SCHEDULED"
                          ? "정산 예정"
                          : settlement.status}
                    </p>
                  </div>

                  <p className="font-semibold text-[#15803D]">
                    ₩{settlement.netAmount.toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </section>

          {/* 지출 상세 */}
          <section className="space-y-3">
            <h4 className="font-semibold text-[#17213B]">
              지출 내역 ({selectedExpenses.length}건)
            </h4>

            {selectedExpenses.length === 0 ? (
              <p className="text-sm text-[#8190B0]">
                해당 날짜의 지출 내역이 없습니다.
              </p>
            ) : (
              selectedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF0F8] p-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#17213B]">
                      {expense.title}
                    </p>
                    <p className="mt-1 text-xs text-[#8190B0]">
                      {expense.status === "COMPLETED"
                        ? "지출 완료"
                        : expense.status === "SCHEDULED"
                          ? "지출 예정"
                          : expense.status}
                    </p>
                  </div>

                  <p className="font-semibold text-[#B91C1C]">
                    ₩{expense.amount.toLocaleString("ko-KR")}
                  </p>
                </div>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
