import { useEffect, useState } from "react";

import { getForecast, type Forecast } from "../api/forecast";
import { getSettlements, type Settlement } from "../api/settlements";

import ForecastSummary from "../components/forecast/ForecastSummary";
import ForecastChart from "../components/forecast/ForecastChart";
import ForecastTable from "../components/forecast/ForecastTable";

export default function ForecastPage() {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const [forecastData, settlementData] = await Promise.all([
          getForecast(),
          getSettlements(),
        ]);

        setForecasts(forecastData);
        setSettlements(settlementData);
      } catch {
        setError("현금흐름 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, []);

  const completedSettlementAmount = settlements
    .filter((settlement) => settlement.status === "COMPLETED")
    .reduce((total, settlement) => total + settlement.netAmount, 0);
  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>현금흐름 예측 데이터를 불러오는 중입니다...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="rounded-xl border border-[#DFE6FF] bg-[#F8FAFF] px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="text-[#5675FF]">ⓘ</span>

              <div>
                <p className="text-sm font-semibold text-[#17213B]">
                  현금흐름 예측 기준 안내
                </p>

                <p className="mt-1 text-sm leading-6 text-[#8190B0]">
                  예상 유입액은 매출·정산 대조 결과가
                  <span className="font-semibold text-[#5675FF]">
                    {" "}
                    일치(MATCHED)
                  </span>
                  이고, 정산 상태가
                  <span className="font-semibold text-[#5675FF]">
                    {" "}
                    정산 예정(SCHEDULED)
                  </span>
                  인 거래만 반영됩니다. 금액 불일치, 매출 누락 및 정산 완료 건은
                  예상 유입액에서 제외됩니다. 예정 지출액은 지출 예정(SCHEDULED)
                  건을 기준으로 계산됩니다.
                </p>
              </div>
            </div>
          </div>

          <ForecastSummary forecasts={forecasts} />

          <div className="rounded-2xl border border-[#EDF0F8] bg-white p-6">
            <p className="text-sm font-medium text-[#8190B0]">정산 완료액</p>

            <p className="mt-2 text-2xl font-bold text-[#17213B]">
              ₩{completedSettlementAmount.toLocaleString("ko-KR")}
            </p>

            <p className="mt-2 text-sm text-[#8190B0]">
              이미 정산이 완료된 거래의 실정산액 합계입니다. 미래 예상
              유입액에는 포함되지 않습니다.
            </p>
          </div>

          {forecasts.length === 0 ? (
            <p className="text-sm text-[#8190B0]">
              예정된 현금 흐름 예측 데이터가 없습니다.
            </p>
          ) : (
            <>
              <ForecastChart forecasts={forecasts} />
              <ForecastTable forecasts={forecasts} />
            </>
          )}
        </>
      )}
    </div>
  );
}
