import { apiClient } from "./client";

export interface Forecast {
  date: string;
  inflow: number;
  outflow: number;
  projectedBalance: number;
  riskLevel: string;
}

export const getForecast = async (): Promise<Forecast[]> => {
  const response = await apiClient.get<Forecast[]>("/api/forecast");

  return response.data;
};
