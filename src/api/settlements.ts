import { apiClient } from "./client";

export interface Settlement {
  id: number;
  transactionId: string;
  saleId: number | null;
  settlementDate: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: string;
  validationStatus: string;
  uploadBatchId: number | null;
}

export const getSettlements = async (): Promise<Settlement[]> => {
  const response = await apiClient.get<Settlement[]>("/api/settlements");

  return response.data;
};

export interface CreateSettlementRequest {
  transactionId: string;
  settlementDate: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: string;
}

export const createSettlement = async (
  data: CreateSettlementRequest,
): Promise<Settlement> => {
  const response = await apiClient.post<Settlement>("/api/settlements", data);

  return response.data;
};

export const uploadSettlementsCsv = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<string>(
    "/api/uploads/settlements",
    formData,
  );
  return response.data;
};

export const updateSettlement = async (
  id: number,
  data: CreateSettlementRequest,
): Promise<Settlement> => {
  const response = await apiClient.put<Settlement>(
    `/api/settlements/${id}`,
    data,
  );

  return response.data;
};

export const deleteSettlement = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/settlements/${id}`);
};
