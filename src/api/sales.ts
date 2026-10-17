import { apiClient } from "./client";

export interface Sale {
  id: number;
  transactionId: string;
  saleDate: string;
  amount: number;
  paymentMethod: string;
  uploadBatchId: number | null;
}

export const getSales = async (): Promise<Sale[]> => {
  const response = await apiClient.get<Sale[]>("/api/sales");

  return response.data;
};
