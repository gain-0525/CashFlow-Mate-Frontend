import { useEffect, useState } from "react";

import { getForecast, type Forecast } from "../api/forecast";

import ForecastSummary from "../components/forecast/ForecastSummary";
import ForecastChart from "../components/forecast/ForecastChart";
import ForecastTable from "../components/forecast/ForecastTable";

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const data = await getForecast();
        setForecasts(data);
      } catch {
        setError("현금흐름 예측 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>현금흐름 예측 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : forecasts.length === 0 ? (
        <p>예측 데이터가 없습니다.</p>
      ) : (
        <>
          <ForecastSummary forecasts={forecasts} />
          <ForecastChart forecasts={forecasts} />
          <ForecastTable forecasts={forecasts} />
        </>
      )}
    </div>
  );
}
