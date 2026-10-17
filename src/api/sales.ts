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

export const getSales = async (): Promise<Sale[]> => {
  const response = await apiClient.get<Sale[]>("/api/sales");

  return response.data;
};

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await apiClient.post<Sale>("/api/sales", data);

  return response.data;
};

export const uploadSalesCsv = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post<string>(
    "/api/uploads/sales",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  return response.data;
};
