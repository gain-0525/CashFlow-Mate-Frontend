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
