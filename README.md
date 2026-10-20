<div align="center">

<img src="./src/assets/cashflow-mate-banner.png" alt="CashFlow Mate — 소상공인 현금흐름 관리 서비스" width="100%" />

# CashFlow Mate 💸

### 소상공인을 위한 매출·정산 통합 관리 및 현금흐름 예측 서비스

매출부터 정산, 대사, 지출, 현금흐름 예측까지 한곳에서 관리하는 웹 서비스

[🌐 서비스 바로가기](https://cash-flow-mate-frontend.vercel.app/) · [⚙️ Backend Repository](https://github.com/gain-0525/CashFlow-Mate)

</div>

---

## 📌 프로젝트 소개

소상공인은 매출이 발생한 시점과 실제 정산금이 입금되는 시점이 달라 자금 현황을 파악하기 어렵습니다. 여기에 사업 운영 지출까지 더해지면 여러 데이터를 직접 확인하고 비교해야 합니다.

**CashFlow Mate**는 이러한 불편을 줄이기 위해 매출·정산·대사·지출 정보를 통합 관리하고, **향후 30일 현금흐름 예측**과 **자금흐름 캘린더**를 제공하는 MVP 웹 서비스입니다.

## ✨ 주요 기능

| 기능                   | 설명                                                          |
| ---------------------- | ------------------------------------------------------------- |
| 📊 **대시보드**        | 총매출·정산 현황 등 핵심 지표와 현금흐름 그래프를 한눈에 확인 |
| 📈 **매출 관리**       | 매출 내역 조회 및 관리                                        |
| 💳 **정산 관리**       | 정산 내역 및 정산 금액 확인                                   |
| 🔎 **대사 관리**       | 매출 데이터와 정산 데이터를 비교하고 불일치 내역 확인         |
| 💸 **지출 관리**       | 사업 운영 지출 내역 관리                                      |
| 📉 **현금흐름 예측**   | 향후 30일의 예상 자금흐름 확인                                |
| 📅 **자금흐름 캘린더** | 날짜를 기준으로 자금 유입·유출 흐름 확인                      |
| 📂 **CSV 업로드**      | 기존 데이터를 파일로 등록하고 업로드 결과 관리                |

## 🖥️ 서비스 화면

> 실제 서비스 화면 캡처를 추가하면 더 완성도 높은 README가 됩니다.

<!-- 예시: 이미지를 추가한 뒤 주석을 해제하세요.
### 대시보드
![대시보드](./assets/dashboard.png)

### 자금흐름 캘린더
![캘린더](./assets/calendar.png)
-->

## 🛠️ 기술 스택

| 구분        | 기술                    |
| ----------- | ----------------------- |
| Frontend    | React, TypeScript, Vite |
| API 통신    | Axios                   |
| 배포        | Vercel                  |
| Backend     | Java, Spring Boot       |
| Database    | MySQL                   |
| 서버 인프라 | AWS EC2, Nginx, HTTPS   |

## 🏗️ 시스템 구성

```text
사용자 브라우저
      │
      ▼
React + TypeScript (Vercel)
      │ HTTPS / REST API
      ▼
Nginx (AWS EC2)
      │ reverse proxy
      ▼
Spring Boot
      │
      ▼
MySQL
```

## 🚀 로컬 실행

### 1. 저장소 클론

```bash
git clone https://github.com/gain-0525/CashFlow-Mate-Frontend.git
cd CashFlow-Mate-Frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

> 로컬 백엔드 서버가 실행 중이어야 API를 정상적으로 사용할 수 있습니다. `VITE_` 접두사가 붙은 변수는 브라우저에 노출되므로 비밀키를 넣지 마세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

## 🔗 관련 링크

- **서비스:** https://cash-flow-mate-frontend.vercel.app/
- **Frontend:** https://github.com/gain-0525/CashFlow-Mate-Frontend
- **Backend:** https://github.com/gain-0525/CashFlow-Mate

## 🔭 향후 개선 방향

- 사용자 인증 및 사용자별 데이터 접근 권한 적용
- 데이터 연동 자동화 및 예측 기능 고도화
- 운영 모니터링 및 서비스 안정성 개선

---

<div align="center">
  <sub>CashFlow Mate · 소상공인의 현금흐름을 더 쉽고, 더 정확하게</sub>
</div>
