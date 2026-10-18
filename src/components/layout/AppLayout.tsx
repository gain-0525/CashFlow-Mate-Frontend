import {
  BarChart3,
  BookOpen,
  Bell,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Wallet,
  X,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

const menus = [
  { path: "/", label: "대시보드", icon: LayoutDashboard },
  { path: "/sales", label: "매출 관리", icon: BarChart3 },
  { path: "/settlements", label: "정산 관리", icon: Wallet },
  {
    path: "/reconciliation",
    label: "대사 관리",
    icon: FileCheck2,
  },
  { path: "/expenses", label: "지출 관리", icon: ReceiptText },
  { path: "/forecast", label: "현금흐름 예측", icon: TrendingUp },
  { path: "/calendar", label: "자금 흐름 캘린더", icon: CalendarDays },
  { path: "/guide", label: "사용 가이드", icon: BookOpen },
];

const pageDescriptions: Record<string, string> = {
  "/": "매출과 정산 데이터를 한눈에 확인하고, 앞으로의 현금흐름을 준비하세요.",
  "/guide": "CashFlow Mate의 주요 기능과 이용 방법을 알아보세요.",
  "/sales": "매출 내역을 조회하고 데이터를 관리하세요.",
  "/settlements": "정산 내역과 수수료를 확인하세요.",
  "/reconciliation": "매출과 정산 데이터의 불일치 항목을 확인하세요.",
  "/expenses": "사업 운영에 필요한 지출을 관리하세요.",
  "/forecast": "예상 수입과 지출을 분석해 미래 잔액과 자금 위험을 확인하세요.",
  "/calendar":
    "날짜별 매출, 정산, 지출을 한눈에 확인하고 자금 흐름을 관리하세요.",
};

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const currentPage = menus.find((menu) => menu.path === pathname);
  const pageTitle = currentPage?.label ?? "페이지";
  const description = pageDescriptions[pathname] ?? "";

  return (
    <div className="min-h-screen bg-[#F7F9FF] text-[#17213B]">
      {/* 모바일 사이드바 배경 */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-[#E8ECF6] bg-white px-4 py-7
          transition-transform duration-200
          lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* 로고 */}
        <NavLink
          to="/"
          onClick={() => setIsSidebarOpen(false)}
          className="mb-12 flex items-center gap-3 px-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5675FF] to-[#A58BFA] text-white">
            <Wallet size={21} />
          </div>

          <span className="text-lg font-bold tracking-tight">
            CashFlow Mate
          </span>
        </NavLink>

        {/* 메뉴 */}
        <nav className="space-y-2">
          {menus.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-[#E9EEFF] text-[#3156D3]"
                    : "text-[#64748B] hover:bg-[#F5F7FF] hover:text-[#3156D3]"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-5">
          {/* 브랜드 메시지 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8EDFF] to-[#F1EAFF] p-5">
            <div className="absolute -right-5 -top-6 h-24 w-24 rounded-full bg-white/40" />

            <p className="relative text-sm font-semibold leading-6 text-[#4255A3]">
              데이터로
              <br />
              더 나은 내일의
              <br />
              비즈니스를 만드세요.
            </p>

            <ClipboardList size={23} className="mt-4 text-[#7C87E9]" />
          </div>

          <div className="flex items-center gap-3 border-t border-[#EEF0F6] px-2 pt-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EDFF] text-sm font-bold text-[#4255A3]">
              C
            </div>
            <div>
              <p className="text-sm font-semibold">CashFlow Mate</p>
              <p className="text-xs text-[#94A3B8]">Business Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="min-h-screen lg:ml-64">
        {/* 상단 헤더 */}
        <header className="flex h-20 items-center justify-between border-b border-[#EDF0F8] bg-white/80 px-5 backdrop-blur-sm sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 hover:bg-[#F1F4FF] lg:hidden"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <span className="text-sm font-medium text-[#7C89A8]">
              Workspace
              <span className="mx-2 text-[#CBD5E1]">/</span>
              <span className="text-[#3156D3]">{pageTitle}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Bell size={20} className="text-[#64748B]" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8EDFF] text-sm font-bold text-[#4255A3]">
              C
            </div>
          </div>
        </header>

        {/* 페이지 영역 */}
        <main className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-8">
            <p className="mb-2 text-sm text-[#8190B0]">
              오늘도 좋은 하루 보내세요 ✨
            </p>

            <h1 className="text-3xl font-bold tracking-tight">{pageTitle}</h1>

            <p className="mt-2 text-sm text-[#8190B0]">{description}</p>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
