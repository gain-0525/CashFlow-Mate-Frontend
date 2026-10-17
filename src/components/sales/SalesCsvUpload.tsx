import { useState } from "react";
import { uploadSalesCsv } from "../../api/sales";

interface SalesCsvUploadProps {
  onUploadSuccess: () => Promise<void>;
}

export default function SalesCsvUpload({
  onUploadSuccess,
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
      await uploadSalesCsv(file);
      await onUploadSuccess();
    } catch {
      setMessage("CSV 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="cursor-pointer rounded-xl bg-[#EEF0FF] px-5 py-3 text-sm font-semibold text-[#6055D8]">
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
        <p role="alert" className="text-sm text-red-500">
          {message}
        </p>
      )}
    </div>
  );
}
