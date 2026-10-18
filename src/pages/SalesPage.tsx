import { useEffect, useState } from "react";

import { getSales, createSale, updateSale, deleteSale } from "../api/sales";
import type { Sale, CreateSaleRequest } from "../api/sales";
import SaleForm from "../components/sales/SaleForm";
import SalesCsvUpload from "../components/sales/SalesCsvUpload";
import { Download } from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

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

  const handleUploadSuccess = async () => {
    const data = await getSales();
    setSales(data);
    setUploadMessage("매출 CSV 업로드가 완료되었습니다.");
  };

  const handleUpdateSale = async (data: CreateSaleRequest) => {
    if (!editingSale) return;

    const updatedSale = await updateSale(editingSale.id, data);

    setSales((prev) =>
      prev.map((sale) => (sale.id === updatedSale.id ? updatedSale : sale)),
    );

    setEditingSale(null);
    setIsFormOpen(false);
  };

  const handleDeleteSale = async (sale: Sale) => {
    const isConfirmed = window.confirm(
      `${sale.transactionId} 매출을 삭제하시겠습니까?`,
    );

    if (!isConfirmed) return;

    try {
      await deleteSale(sale.id);

      setSales((prev) => prev.filter((item) => item.id !== sale.id));
    } catch {
      window.alert("매출 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* CSV 양식 다운로드 */}
        <a
          href="/templates/sales-template.csv"
          download="sales-template.csv"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8ECF6] bg-white px-5 py-3 text-sm font-semibold text-[#3156D3] transition-colors hover:bg-[#F5F7FF]"
        >
          <Download size={17} />
          CSV 양식 다운로드
        </a>

        {/* CSV 업로드 */}
        <SalesCsvUpload onUploadSuccess={handleUploadSuccess} />

        {/* 매출 등록 */}
        <button
          type="button"
          onClick={() => {
            setEditingSale(null);
            setIsFormOpen(true);
          }}
          className="rounded-xl bg-[#5675FF] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4564E8]"
        >
          매출 등록
        </button>
      </div>

      {uploadMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-[#D7E9DD] bg-[#F0FDF4] px-4 py-3 text-sm font-medium text-[#15803D]"
        >
          <span>✓</span>
          <span>{uploadMessage}</span>
        </div>
      )}

      {isFormOpen && (
        <SaleForm
          key={editingSale?.id ?? "create"}
          initialData={editingSale ?? undefined}
          onSubmit={editingSale ? handleUpdateSale : handleCreateSale}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingSale(null);
          }}
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
                  <th className="px-6 py-4 text-center">관리</th>
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

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSale(sale);
                            setIsFormOpen(true);
                          }}
                          className="rounded-lg border border-[#DDE4F0] px-3 py-2 text-sm font-medium text-[#5675FF] hover:bg-[#F5F7FF]"
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSale(sale)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
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
