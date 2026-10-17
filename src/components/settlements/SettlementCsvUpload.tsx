import { useState } from "react";
import type { ChangeEvent } from "react";

import { uploadSettlementsCsv } from "../../api/settlements";

interface Props {
  onUploadSuccess: () => Promise<void>;
  onUploadError: (message: string) => void;
}

export default function SettlementsCsvUpload({
  onUploadSuccess,
  onUploadError,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      onUploadError("CSV 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    onUploadError("");

    try {
      await uploadSettlementsCsv(file);
      await onUploadSuccess();
    } catch {
      onUploadError("정산 CSV 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <label className="cursor-pointer rounded-xl bg-[#EEF0FF] px-4 py-3 text-sm font-semibold text-[#6055D8]">
        {isUploading ? "업로드 중..." : "CSV 업로드"}

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
