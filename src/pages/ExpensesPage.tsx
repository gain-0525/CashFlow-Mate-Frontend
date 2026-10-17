import { useEffect, useState } from "react";

import {
  getExpenses,
  type Expense,
  createExpense,
  type CreateExpenseRequest,
} from "../api/expenses";
import ExpenseForm from "../components/expenses/ExpenseForm";

const statusLabels: Record<string, string> = {
  SCHEDULED: "지출 예정",
  COMPLETED: "지출 완료",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch {
        setError("지출 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const scheduledCount = expenses.filter(
    (expense) => expense.status === "SCHEDULED",
  ).length;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || expense.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateExpense = async (data: CreateExpenseRequest) => {
    await createExpense(data);

    const updatedExpenses = await getExpenses();
    setExpenses(updatedExpenses);

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>지출 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* 요약 카드 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "총 지출액",
                value: `₩${totalAmount.toLocaleString("ko-KR")}`,
              },
              {
                label: "전체 지출",
                value: `${expenses.length}건`,
              },
              {
                label: "지출 예정",
                value: `${scheduledCount}건`,
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[#EDF0F8] bg-white p-6"
              >
                <p className="text-sm text-[#8190B0]">{card.label}</p>
                <p className="mt-3 text-2xl font-bold text-[#17213B]">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* 검색 및 지출 등록 버튼 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="지출 항목 검색"
              className="w-64 max-w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
            />

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4564E8]"
            >
              지출 등록
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: "전체", value: "ALL" },
              { label: "지출 예정", value: "SCHEDULED" },
              { label: "지출 완료", value: "COMPLETED" },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  statusFilter === filter.value
                    ? "bg-[#5675FF] text-white"
                    : "bg-white text-[#8190B0] hover:bg-[#F8FAFF]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 지출 등록 폼 */}
          {isFormOpen && (
            <ExpenseForm
              onSubmit={handleCreateExpense}
              onCancel={() => setIsFormOpen(false)}
            />
          )}

          {/* 지출 테이블 */}
          <div className="overflow-x-auto rounded-2xl border border-[#EDF0F8] bg-white">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[#17213B]">
                지출 내역
              </h2>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFF] text-[#8190B0]">
                <tr>
                  <th className="px-6 py-4">지출 항목</th>
                  <th className="px-6 py-4 text-right">금액</th>
                  <th className="px-6 py-4">지출 예정일</th>
                  <th className="px-6 py-4">상태</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-t border-[#EDF0F8]">
                    <td className="px-6 py-4 font-medium">{expense.title}</td>
                    <td className="px-6 py-4 text-right">
                      ₩{expense.amount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-6 py-4">{expense.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {statusLabels[expense.status] ?? expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredExpenses.length === 0 && (
              <p className="p-8 text-center text-sm text-[#8190B0]">
                지출 내역이 없습니다.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
