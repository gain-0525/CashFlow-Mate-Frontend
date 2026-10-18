import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  FileSpreadsheet,
  ReceiptText,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";

const steps = [
  {
    number: "01",
    title: "매출 등록",
    description:
      "거래 ID, 매출일, 금액, 결제 수단을 입력해 매출을 등록하세요. CSV 파일을 이용한 일괄 등록도 가능합니다.",
    icon: BarChart3,
    path: "/sales",
    button: "매출 관리로 이동",
  },
  {
    number: "02",
    title: "정산 등록 및 대조",
    description:
      "정산 내역을 등록하면 거래 ID를 기준으로 매출 데이터와 비교합니다. 대사 관리에서 불일치 항목을 확인하세요.",
    icon: FileCheck2,
    path: "/reconciliation",
    button: "대사 관리로 이동",
  },
  {
    number: "03",
    title: "지출 관리",
    description:
      "사업 운영에 필요한 지출을 등록하고 예정된 지출과 완료된 지출을 구분해 관리하세요.",
    icon: ReceiptText,
    path: "/expenses",
    button: "지출 관리로 이동",
  },
  {
    number: "04",
    title: "현금흐름 예측",
    description:
      "예정된 정산 수입과 지출을 바탕으로 향후 30일의 현금흐름을 확인하고 자금 부족 가능성을 점검하세요.",
    icon: TrendingUp,
    path: "/forecast",
    button: "현금흐름 예측으로 이동",
  },
];

const validationStatuses = [
  {
    label: "일치",
    code: "MATCHED",
    description: "매출 금액과 정산 금액이 정상적으로 일치하는 상태",
    color: "bg-[#E8F8EF] text-[#16834B]",
  },
  {
    label: "금액 불일치",
    code: "AMOUNT_MISMATCH",
    description: "등록된 매출 금액과 정산의 총금액이 다른 상태",
    color: "bg-[#FFF2E5] text-[#C66B16]",
  },
  {
    label: "매출 누락",
    code: "MISSING_SALE",
    description: "정산 내역에 대응하는 거래 ID의 매출이 없는 상태",
    color: "bg-[#FEECEC] text-[#C64545]",
  },
  {
    label: "정산 데이터 오류",
    code: "INVALID_DATA",
    description: "총정산액에서 수수료를 뺀 금액이 실정산액과 다른 상태",
    color: "bg-[#F1EDFF] text-[#7053BD]",
  },
];

export default function GuidePage() {
  return (
    <div className="space-y-8">
      {/* 서비스 소개 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#5675FF] to-[#A58BFA] p-8 text-white sm:p-10">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />

        <div className="relative">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <BookOpen size={25} />
          </div>

          <h2 className="text-2xl font-bold sm:text-3xl">
            CashFlow Mate 시작하기
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90">
            CashFlow Mate는 매출, 정산, 지출 데이터를 한곳에서 관리하고 미래의
            현금흐름을 예측할 수 있도록 돕는 서비스입니다. 아래 가이드를 따라
            주요 기능을 활용해 보세요.
          </p>

          <Link
            to="/sales"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4255C7] transition hover:bg-[#F5F7FF]"
          >
            매출 등록부터 시작하기
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* 사용 순서 */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold">서비스 이용 순서</h2>
          <p className="mt-2 text-sm text-[#8190B0]">
            네 단계만 따라 하면 CashFlow Mate의 주요 기능을 사용할 수 있어요.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border border-[#E8ECF6] bg-white p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FF] text-[#5675FF]">
                    <Icon size={24} />
                  </div>

                  <span className="text-2xl font-bold text-[#DCE3FF]">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold">{step.title}</h3>

                <p className="mt-3 min-h-16 text-sm leading-7 text-[#64748B]">
                  {step.description}
                </p>

                <Link
                  to={step.path}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#5675FF] hover:text-[#3156D3]"
                >
                  {step.button}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 대조 상태 설명 */}
      <section className="rounded-2xl border border-[#E8ECF6] bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-[#EEF2FF] p-3 text-[#5675FF]">
            <FileCheck2 size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold">정산 대조 결과 이해하기</h2>
            <p className="mt-2 text-sm leading-6 text-[#8190B0]">
              매출과 정산 데이터를 비교한 결과는 네 가지 상태로 표시됩니다.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {validationStatuses.map((status) => (
            <div
              key={status.code}
              className="rounded-xl border border-[#EEF0F6] p-5"
            >
              <span
                className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold ${status.color}`}
              >
                {status.label}
              </span>

              <p className="mt-3 text-sm font-medium">{status.description}</p>

              <p className="mt-2 text-xs text-[#94A3B8]">{status.code}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F7F9FF] p-4">
          <CircleAlert size={18} className="mt-0.5 shrink-0 text-[#5675FF]" />
          <p className="text-sm leading-6 text-[#64748B]">
            매출 금액을 수정하거나 매출을 삭제하면 연결된 정산의 대조 상태가
            자동으로 다시 계산됩니다.
          </p>
        </div>
      </section>

      {/* CSV 안내 */}
      <section className="rounded-2xl border border-[#E8ECF6] bg-white p-6 sm:p-8">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-[#EEF2FF] p-3 text-[#5675FF]">
            <FileSpreadsheet size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold">CSV 파일로 일괄 등록하기</h2>
            <p className="mt-2 text-sm leading-6 text-[#8190B0]">
              매출 및 정산 관리 페이지에서 CSV 파일을 업로드할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-[#F7F9FF] p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <BarChart3 size={18} className="text-[#5675FF]" />
              매출 데이터
            </h3>

            <p className="text-sm leading-7 text-[#64748B]">
              거래 ID, 매출일, 매출 금액, 결제 수단 등의 데이터를 파일로 등록할
              수 있습니다.
            </p>
          </div>

          <div className="rounded-xl bg-[#F7F9FF] p-5">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Wallet size={18} className="text-[#5675FF]" />
              정산 데이터
            </h3>

            <p className="text-sm leading-7 text-[#64748B]">
              거래 ID, 정산일, 총정산액, 수수료, 실정산액 등의 데이터를 파일로
              등록할 수 있습니다.
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-6 text-[#94A3B8]">
          CSV 파일의 정확한 컬럼명과 날짜 형식은 업로드 API의 요구사항에 맞춰
          작성해야 합니다. 양식을 다운 받아주세요.
        </p>
      </section>

      {/* 기능 요약 */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E8ECF6] bg-white p-5">
          <CheckCircle2 size={22} className="text-[#5675FF]" />
          <h3 className="mt-4 font-semibold">자동 대조</h3>
          <p className="mt-2 text-sm leading-6 text-[#8190B0]">
            거래 ID와 금액을 비교해 정산 오류를 확인합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8ECF6] bg-white p-5">
          <CalendarDays size={22} className="text-[#5675FF]" />
          <h3 className="mt-4 font-semibold">30일 예측</h3>
          <p className="mt-2 text-sm leading-6 text-[#8190B0]">
            예정된 현금 유입과 지출을 바탕으로 미래 잔액을 확인합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8ECF6] bg-white p-5">
          <Wallet size={22} className="text-[#5675FF]" />
          <h3 className="mt-4 font-semibold">통합 관리</h3>
          <p className="mt-2 text-sm leading-6 text-[#8190B0]">
            매출, 정산, 지출 정보를 하나의 서비스에서 관리합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
