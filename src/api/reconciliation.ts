import { apiClient } from "./client";

export type ValidationStatus =
  | "MATCHED"
  | "AMOUNT_MISMATCH"
  | "MISSING_SETTLEMENT"
  | "MISSING_SALE";

export interface Reconciliation {
  transactionId: string;
  saleAmount: number | null;
  settlementAmount: number | null;
  validationStatus: ValidationStatus;
}

export const getReconciliation = async (): Promise<Reconciliation[]> => {
  const response = await apiClient.get<Reconciliation[]>("/api/reconciliation");

  return response.data;
};
