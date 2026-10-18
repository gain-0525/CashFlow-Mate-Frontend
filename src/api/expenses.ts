import { apiClient } from "./client";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  status: string;
}

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await apiClient.get<Expense[]>("/api/expenses");

  return response.data;
};

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  dueDate: string;
  status: string;
}

export const createExpense = async (
  data: CreateExpenseRequest,
): Promise<Expense> => {
  const response = await apiClient.post<Expense>("/api/expenses", data);

  return response.data;
};

export const updateExpense = async (
  id: number,
  data: CreateExpenseRequest,
): Promise<Expense> => {
  const response = await apiClient.put<Expense>(`/api/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/expenses/${id}`);
};
