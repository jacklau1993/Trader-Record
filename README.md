# 交易日記應用 (Trading Journal App)

雲端交易日記，涵蓋交易紀錄、標籤分析、報表、富文本筆記與模板、圖片上傳，以及 localStorage → 雲端的遷移。採用 Next.js 16（App Router + Edge runtime）、Drizzle ORM、Cloudflare D1/R2、Better Auth，預設部署 Cloudflare Pages。

## 功能

- 儀表板：淨 P&L、勝率、獲利因子、平均盈虧、累積/日收益圖、日曆熱力圖、近期交易。支援多帳戶切換（個人/Prop Firm）。
- 交易管理：新增/編輯/刪除，支援多標籤、方向/倉位/進出場時間與價格/P&L，依預設合約乘數自動算淨 P&L，並自動計算 Points、Planned/Realized R:R、風險、評分。
- 多帳戶管理：
  - 個人帳戶：於「設定」中管理（如 Interactive Brokers, TD Ameritrade）。
  - Prop Firm：專屬「Prop Firms」模組，追蹤成本、出金、考試狀態。
- 標籤與分類：自訂分類+標籤，顏色同步，供報表分析。
- 報表：
  - **績效報表 (Performance Report)**：淨 P&L、獲利因子、勝率、期望值、最大回撤 (Drawdown)、平均持倉時間 (Avg Hold Time)、權益曲線 (Equity Curve)、日收益圖。
  - **標籤報表 (Tags Report)**：標籤 P&L/勝率/次數/平均盈虧，P&L+成交量組合圖、勝率 vs 成交量、標的交叉分析。
- 筆記與模板：TipTap 富文本（標題、粗斜體、列表、程式碼、引用），模板插入/管理並存 DB。
- 圖片上傳：筆記可上傳 JPEG/PNG/GIF/WebP（5MB），存 Cloudflare R2。
- 遷移工具：偵測舊版 localStorage 的分類/標籤/交易/筆記/模板並寫入雲端。
- 驗證與設定：Better Auth 電郵/密碼，帳戶名稱、偏好（幣別、日期格式、時區、主題）、交易匯出、刪除帳戶。

## 技術棧

- 應用：Next.js 16（App Router, Edge）、TypeScript、Cloudflare Pages（`@cloudflare/next-on-pages`）
- 資料：Drizzle ORM + Cloudflare D1（SQLite，本地使用 `.wrangler/state` SQLite）
- 儲存：Cloudflare R2 `IMAGES` 綁定（`app/api/images` 提供上傳/讀取）
- 認證：Better Auth（email/password）
- 介面：Tailwind CSS、Lucide 圖示
- 圖表/編輯：Recharts、TipTap（含圖片上傳、Placeholder、StarterKit）
- 預設期貨代號與合約乘數：`lib/constants.ts`（用於自動計算 P&L）

## 前置需求

- Node.js 18+
- npm
- Cloudflare Wrangler CLI（D1/R2 綁定與遷移）
- Cloudflare 帳號（部署 Pages/D1/R2）

## 本地開發

1. 安裝依賴

```bash
npm install
```

2. 建立 `.env`（根目錄）

```env
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=可選（啟用驗證信）
```

3. 套用 D1 遷移（使用 `drizzle/*.sql`）

```bash
npx wrangler d1 migrations apply trading-app-db --local
```

會在 `.wrangler/state/v3/d1` 生成 SQLite 供開發使用。 4) 啟動

```bash
npm run dev
```

造訪 `http://localhost:3000`。若要本地測圖片，上線 `IMAGES` 綁定（如 `wrangler dev` 模擬 R2 或 Pages 預覽環境）。

## 部署到 Cloudflare Pages

1. 建立並遷移 D1

```bash
npx wrangler d1 migrations apply trading-app-db
```

2. 建立 R2 並綁定 `IMAGES`（bucket 名 `trading-app-images`）

```bash
npx wrangler r2 bucket create trading-app-images
```

3. 在 Pages/Workers 設定環境變數：`BETTER_AUTH_SECRET`、`BETTER_AUTH_URL`（正式網域）、`RESEND_API_KEY`（若啟用驗證信）。
4. 建置與部署

```bash
npm run build
npx wrangler pages deploy .next
```

`wrangler.toml` 已設定 `pages_build_output_dir=.next` 與 Edge 相容旗標。

## 指令

- `npm run dev`：開發伺服器
- `npm run build`：建置（Webpack fallback）
- `npm run start`：啟動已建置版本
- `npm run lint`：ESLint

## 資料與 API

- 認證：`app/api/auth/[...all]`（Better Auth handler）
- 圖片：`app/api/images/upload` 上傳，`app/api/images/[filename]` 讀取
- 伺服器動作：`app/actions/*`（交易、標籤、筆記、模板、設定；Drizzle + Edge runtime）

## 授權

ISC（參見 `package.json`）

---

# Trader Record

A professional, cloud-first trading journal application designed for serious traders. **Trader Record** helps you track trades, analyze performance via advanced metrics and charts, manage prop firm accounts, and maintain a rich-text trading notebook.

Built with **Next.js 16 (App Router + Edge Runtime)**, **Drizzle ORM**, and **Cloudflare (Pages, D1, R2)** for high performance and low latency.

## Key Features

### 1. Command Center Dashboard

The dashboard provides a real-time overview of your trading performance.

- **Key Performance Indicators (KPIs)**: Instantly view Net P&L, Win Rate, Profit Factor, Average Win/Loss, and Expectancy.
- **Dynamic Charts**:
  - **Equity Curve**: Visualise your cumulative P&L growth over time.
  - **Daily Net P&L**: Bar chart showing daily performance.
  - **Win/Loss Analysis**: Compare win vs. loss frequency and magnitude.
  - **Trade Duration**: Analyze the correlation between holding time and profitability.
- **Calendar Heatmap**: A GitHub-style monthly calendar showing daily P&L and trade counts at a glance.
- **Filters**: Filter all data by **Date Range** (this month, custom range) and **Trading Account**.

### 2. Trade Management

- **Manual Entry**: Detailed logging including Entry/Exit Price, Time, Quantity, and automatic P&L calculation based on contract multipliers (e.g., NQ, ES).
- **Smart CSV Import**:
  - Bulk import trades from broker `Performance.csv` exports.
  - **Auto-Normalization**: Automatically cleans ticker symbols (e.g., `MYMH6` -> `MYM`) to unify data.
  - **Auto-Journaling**: Automatically generates a detail-rich Note in the Notebook for every imported trade.
- **Multi-Account Support**: Clearly distinguish between **Personal Accounts** (Inteactive Brokers, TD) and **Prop Firm Accounts**.

### 3. Prop Firm Manager

A dedicated module to track your funded trader journey.

- **Track Status**: Monitor accounts by status: **Active**, **Pending**, **Passed**, or **Failed**.
- **Financials**: Log the **Cost** (Evaluation fees) vs. **Payouts** (Realized gains) to track your true ROI.
- **Payout History**: Record payout amounts and dates to keep financial records accurate.

### 4. Advanced Analytics & Reports

- **Performance Report**: Deep dive into metrics like Max Drawdown, Average Hold Time, and detailed P&L breakdowns.
- **Tag Analytics**: Use the comprehensive tagging system to grade setup quality (e.g., "A-Setup", "FOMO").
  - **Tag Reports**: Analyze Win Rate and P&L specifically by tag to identify strengths and weaknesses.
  - **Cross-Analysis**: View P&L distribution across different tags and tickers.

### 5. Trading Notebook

- **Rich Text Editor**: Powered by TipTap, supporting **Bold**, _Italic_, lists, code blocks, and blockquotes.
- **Image Support**: Drag & drop or paste chart screenshots directly into notes. Images are securely stored in **Cloudflare R2**.
- **Templates**: Create and reuse templates for specific review routines (e.g., "Daily Review", "Weekly Outlook").
- **Trade Integration**: Link notes directly to specific trades for seamless context switching.

### 6. Legacy Migration

- **Browser-to-Cloud**: Built-in tool to detect legacy data stored in `localStorage` and migrate it to the secure Cloudflare D1 database.

---

## Technical Architecture

The application is architected for the **Edge**, ensuring global low latency and high availability.

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Shadcn UI.
- **Backend**: Next.js Server Actions (Edge Runtime).
- **Database**: **Cloudflare D1** (SQLite at the Edge) via **Drizzle ORM**.
- **Object Storage**: **Cloudflare R2** for storing trade screenshots and user uploads.
- **Authentication**: **Better Auth** (Email/Password) with secure session management.
- **Deployment**: **Cloudflare Pages** (`@cloudflare/next-on-pages`).

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **Cloudflare Account** (for D1/R2)
- **Wrangler CLI** (installed globally: `npm i -g wrangler`)

### 1. Installation

```bash
git clone https://github.com/jacklau1993/Trading-app.git
cd Trading-app
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Generate a secure random string
BETTER_AUTH_SECRET=your_generated_secret_here
# Base URL (use http://localhost:3000 for local dev)
BETTER_AUTH_URL=http://localhost:3000
# Optional: For email verification
RESEND_API_KEY=re_123456789
```

### 3. Local Database (D1)

Initialize the local SQLite database using Drizzle migrations:

```bash
# Apply migrations to local .wrangler/state
npx wrangler d1 migrations apply trading-app-db --local
```

### 4. Run Locally

```bash
npm run dev
```

Access the app at `http://localhost:3000`.

> **Note on Images**: To test image uploads locally, you need to run Wrangler in a mode that emulates R2 bindings, or use a remote generic binding.

---

## Deployment (Cloudflare Pages)

1.  **Setup Cloudflare D1**:

    ```bash
    npx wrangler d1 create trading-app-db
    npx wrangler d1 migrations apply trading-app-db --remote
    ```

2.  **Setup Cloudflare R2**:

    ```bash
    npx wrangler r2 bucket create trading-app-images
    ```

3.  **Deploy**:

    ```bash
    npm run build
    npx wrangler pages deploy .next
    ```

4.  **Configure Environment**:
    - Go to Cloudflare Dashboard > Pages > Settings > Environment Variables.
    - Add `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (your production URL), and `RESEND_API_KEY`.
    - Ensure the **D1 Database** binding (`DB`) and **R2 Bucket** binding (`IMAGES`) are correctly linked in the Pages settings.
