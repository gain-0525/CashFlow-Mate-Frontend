import { useEffect, useState } from "react";

import { getSales, createSale } from "../api/sales";
import type { Sale, CreateSaleRequest } from "../api/sales";
import SaleForm from "../components/sales/SaleForm";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await getSales();
        setSales(data);
      } catch {
        setError("매출 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);

  const filteredSales = sales.filter((sale) =>
    sale.transactionId.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  const handleCreateSale = async (data: CreateSaleRequest) => {
    const newSale = await createSale(data);

    setSales((prev) => [...prev, newSale]);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-medium text-white"
        >
          매출 등록
        </button>
      </div>

      {isFormOpen && (
        <SaleForm
          onSubmit={handleCreateSale}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {isLoading ? (
        <p>매출 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
              <p className="text-sm text-[#8190B0]">총 매출액</p>
              <p className="mt-3 text-2xl font-bold">
                ₩{totalSales.toLocaleString("ko-KR")}
              </p>
            </div>

            <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
              <p className="text-sm text-[#8190B0]">총 거래 건수</p>
              <p className="mt-3 text-2xl font-bold">{sales.length}건</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#EDF0F8] bg-white">
            <div className="flex items-center justify-between gap-4 p-6">
              <h2 className="text-lg font-semibold text-[#17213B]">
                매출 내역
              </h2>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="거래 ID 검색"
                className="w-64 max-w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:border-[#5675FF]"
              />
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFF] text-[#8190B0]">
                <tr>
                  <th className="px-6 py-4">거래 ID</th>
                  <th className="px-6 py-4">매출일</th>
                  <th className="px-6 py-4">결제수단</th>
                  <th className="px-6 py-4 text-right">매출액</th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-t border-[#EDF0F8]">
                    <td className="px-6 py-4">{sale.transactionId}</td>
                    <td className="px-6 py-4">{sale.saleDate}</td>
                    <td className="px-6 py-4">{sale.paymentMethod}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ₩{sale.amount.toLocaleString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSales.length === 0 && (
              <p className="p-8 text-center text-sm text-[#8190B0]">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "등록된 매출 내역이 없습니다"}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
