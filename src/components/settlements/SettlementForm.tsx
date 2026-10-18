import { useState } from "react";
import type { FormEvent } from "react";

import type {
  CreateSettlementRequest,
  Settlement,
} from "../../api/settlements";

interface SettlementFormProps {
  initialData?: Settlement;
  onSubmit: (data: CreateSettlementRequest) => Promise<void>;
  onCancel: () => void;
}

export default function SettlementForm({
  initialData,
  onSubmit,
  onCancel,
}: SettlementFormProps) {
  const isEditMode = !!initialData;

  const [transactionId, setTransactionId] = useState(
    initialData?.transactionId ?? "",
  );

  const [settlementDate, setSettlementDate] = useState(
    initialData?.settlementDate ?? "",
  );

  const [grossAmount, setGrossAmount] = useState(
    initialData ? String(initialData.grossAmount) : "",
  );

  const [feeAmount, setFeeAmount] = useState(
    initialData ? String(initialData.feeAmount) : "",
  );

  const [status, setStatus] = useState(initialData?.status ?? "SCHEDULED");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const gross = Number(grossAmount);
    const fee = Number(feeAmount);

    if (gross <= 0 || fee < 0 || fee > gross) {
      setError("정산 금액과 수수료를 확인해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({
        transactionId: transactionId.trim(),
        settlementDate,
        grossAmount: gross,
        feeAmount: fee,
        netAmount: gross - fee,
        status,
      });
    } catch {
      setError(
        isEditMode ? "정산 수정에 실패했습니다." : "정산 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-[#5675FF]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[#EDF0F8] bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-[#17213B]">
        {isEditMode ? "정산 수정" : "정산 등록"}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>거래 ID</span>
          <input
            required
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="TXN030"
            className={inputClass}
          />
        </label>

        <label className="space-y-2 text-sm">
          <span>정산 예정일</span>
          <input
            required
            type="date"
            value={settlementDate}
            onChange={(e) => setSettlementDate(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="space-y-2 text-sm">
          <span>정산 기준액</span>
          <input
            required
            type="number"
            min="1"
            value={grossAmount}
            onChange={(e) => setGrossAmount(e.target.value)}
            placeholder="100000"
            className={inputClass}
          />
        </label>

        <label className="space-y-2 text-sm">
          <span>수수료</span>
          <input
            required
            type="number"
            min="0"
            value={feeAmount}
            onChange={(e) => setFeeAmount(e.target.value)}
            placeholder="3000"
            className={inputClass}
          />
        </label>

        <label className="space-y-2 text-sm">
          <span>정산 상태</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={inputClass}
          >
            <option value="SCHEDULED">정산 예정</option>
            <option value="COMPLETED">정산 완료</option>
          </select>
        </label>

        <div className="flex flex-col justify-center rounded-xl bg-[#F8FAFF] px-4 py-3">
          <span className="text-sm text-[#8190B0]">예상 실정산액</span>
          <span className="mt-1 text-lg font-bold text-[#17213B]">
            ₩
            {Math.max(
              0,
              Number(grossAmount) - Number(feeAmount),
            ).toLocaleString("ko-KR")}
          </span>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#E2E8F0] px-5 py-3 text-sm"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting
            ? isEditMode
              ? "수정 중..."
              : "등록 중..."
            : isEditMode
              ? "정산 수정"
              : "정산 등록"}
        </button>
      </div>
    </form>
  );
}
