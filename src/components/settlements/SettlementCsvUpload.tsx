import { useState } from "react";
import type { ChangeEvent } from "react";

import { uploadSettlementsCsv } from "../../api/settlements";
import { getUploadResult, type UploadResult } from "../../api/sales";

interface Props {
  onUploadSuccess: () => Promise<void>;
  onUploadError: (message: string) => void;
  onUploadResult: (result: UploadResult) => void;
}

export default function SettlementsCsvUpload({
  onUploadSuccess,
  onUploadError,
  onUploadResult,
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
      // 1. 정산 CSV 업로드
      const { batchId } = await uploadSettlementsCsv(file);

      // 2. 업로드 결과 조회
      const result = await getUploadResult(batchId);

      // 3. 결과를 부모 페이지에 전달
      onUploadResult(result);

      // 4. 정산 목록 새로고침
      await onUploadSuccess();
    } catch {
      onUploadError("정산 CSV 업로드 또는 결과 조회에 실패했습니다.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center">
      <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#EEF0FF] px-4 py-3 text-sm font-semibold text-[#6055D8]">
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
