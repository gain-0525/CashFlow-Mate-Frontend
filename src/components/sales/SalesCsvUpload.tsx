import { useState } from "react";
import {
  getUploadResult,
  uploadSalesCsv,
  type UploadResult,
} from "../../api/sales";

interface SalesCsvUploadProps {
  onUploadSuccess: () => Promise<void>;
  onUploadResult: (result: UploadResult) => void;
}

export default function SalesCsvUpload({
  onUploadSuccess,
  onUploadResult,
}: SalesCsvUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("CSV 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const { batchId } = await uploadSalesCsv(file);
      const result = await getUploadResult(batchId);

      onUploadResult(result);
      await onUploadSuccess();
    } catch {
      setMessage("CSV 업로드 또는 결과 조회에 실패했습니다.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#EEF0FF] px-5 py-3 text-sm font-semibold text-[#6055D8]">
        {isUploading ? "업로드 중..." : "CSV 업로드"}

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>

      {message && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {message}
        </p>
      )}
    </div>
  );
}
