import { apiClient } from "./client";

export interface Sale {
  id: number;
  transactionId: string;
  saleDate: string;
  amount: number;
  paymentMethod: string;
  uploadBatchId: number | null;
}

export interface CreateSaleRequest {
  transactionId: string;
  saleDate: string;
  amount: number;
  paymentMethod: string;
}

export interface UploadResponse {
  batchId: number;
}

export interface UploadErrorDetail {
  rowNumber: number;
  errorCode: string;
  errorMessage: string;
  rawData: string;
}

export interface UploadResult {
  batchId: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: UploadErrorDetail[];
}

export const getSales = async (): Promise<Sale[]> => {
  const response = await apiClient.get<Sale[]>("/api/sales");

  return response.data;
};

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await apiClient.post<Sale>("/api/sales", data);

  return response.data;
};

export const uploadSalesCsv = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<UploadResponse>(
    "/api/uploads/sales",
    formData,
  );

  return response.data;
};

export const getUploadResult = async (
  batchId: number,
): Promise<UploadResult> => {
  const response = await apiClient.get<UploadResult>(`/api/uploads/${batchId}`);

  return response.data;
};

export const updateSale = async (
  id: number,
  data: CreateSaleRequest,
): Promise<Sale> => {
  const response = await apiClient.put<Sale>(`/api/sales/${id}`, data);
  return response.data;
};

export const deleteSale = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/sales/${id}`);
};
