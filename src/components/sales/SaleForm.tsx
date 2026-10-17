import { useState } from "react";

interface SaleFormProps {
  onSubmit: (data: {
    transactionId: string;
    saleDate: string;
    amount: number;
    paymentMethod: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function SaleForm({ onSubmit, onCancel }: SaleFormProps) {
  const [transactionId, setTransactionId] = useState("");
  const [saleDate, setSaleDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("매출 금액은 0보다 커야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit({
        transactionId,
        saleDate,
        amount: numericAmount,
        paymentMethod,
      });
    } catch {
      setError("매출 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[#EDF0F8] bg-white p-6"
    >
      <h2 className="text-lg font-semibold">매출 등록</h2>

      <div>
        <label htmlFor="transactionId" className="mb-2 block text-sm">
          거래 ID
        </label>
        <input
          id="transactionId"
          required
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="TXN014"
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label htmlFor="saleDate" className="mb-2 block text-sm">
          매출일
        </label>
        <input
          id="saleDate"
          type="date"
          required
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label htmlFor="amount" className="mb-2 block text-sm">
          매출 금액
        </label>
        <input
          id="amount"
          type="number"
          min="1"
          step="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="150000"
          className="w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label htmlFor="paymentMethod" className="mb-2 block text-sm">
          결제 수단
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full rounded-xl border p-3"
        >
          <option value="CARD">카드</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border px-5 py-3"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-white disabled:opacity-50"
        >
          {isSubmitting ? "등록 중..." : "매출 등록"}
        </button>
      </div>
    </form>
  );
}
