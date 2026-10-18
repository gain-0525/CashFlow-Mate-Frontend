import { useState, type FormEvent } from "react";

import type { CreateExpenseRequest } from "../../api/expenses";

interface Props {
  onSubmit: (data: CreateExpenseRequest) => Promise<void>;
  onCancel: () => void;
  initialData?: CreateExpenseRequest;
}

export default function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
}: Props) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [amount, setAmount] = useState(
    initialData ? String(initialData.amount) : "",
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "SCHEDULED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !amount || !dueDate) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("지출 금액은 0보다 커야 합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        dueDate,
        status,
      });
    } catch {
      setError(
        isEditing ? "지출 수정에 실패했습니다." : "지출 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#EDF0F8] bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-[#17213B]">
        {isEditing ? "지출 수정" : "지출 등록"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[#8190B0]">지출 항목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 서버 운영비"
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8190B0]">지출 금액</label>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="150000"
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8190B0]">
            지출 예정일
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#8190B0]">지출 상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
          >
            <option value="SCHEDULED">지출 예정</option>
            <option value="COMPLETED">지출 완료</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#E2E8F0] px-5 py-3 text-sm font-semibold text-[#8190B0]"
        >
          취소
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4564E8] disabled:opacity-50"
        >
          {isSubmitting
            ? isEditing
              ? "수정 중..."
              : "등록 중..."
            : isEditing
              ? "수정하기"
              : "등록하기"}
        </button>
      </div>
    </form>
  );
}
