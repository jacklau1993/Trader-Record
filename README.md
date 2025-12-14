# 交易日記應用 (Trading Journal App)

雲端交易日記，涵蓋交易紀錄、標籤分析、報表、富文本筆記與模板、圖片上傳，以及 localStorage → 雲端的遷移。採用 Next.js 16（App Router + Edge runtime）、Drizzle ORM、Cloudflare D1/R2、Better Auth，預設部署 Cloudflare Pages。

## 功能
- 儀表板：淨 P&L、勝率、獲利因子、平均盈虧、累積/日收益圖、日曆熱力圖、近期交易。支援多帳戶切換（個人/Prop Firm）。
- 交易管理：新增/編輯/刪除，支援多標籤、方向/倉位/進出場/P&L，依預設合約乘數自動算淨 P&L，並自動計算 Points、Planned/Realized R:R、風險、評分。
- 多帳戶管理：
  - 個人帳戶：於「設定」中管理（如 Interactive Brokers, TD Ameritrade）。
  - Prop Firm：專屬「Prop Firms」模組，追蹤成本、出金、考試狀態。
- 標籤與分類：自訂分類+標籤，顏色同步，供報表分析。
- 報表：標籤 P&L/勝率/次數/平均盈虧，P&L+成交量組合圖、勝率 vs 成交量、標的交叉分析。
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
1) 安裝依賴
```bash
npm install
```
2) 建立 `.env`（根目錄）
```env
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=可選（啟用驗證信）
```
3) 套用 D1 遷移（使用 `drizzle/*.sql`）
```bash
npx wrangler d1 migrations apply trading-app-db --local
```
會在 `.wrangler/state/v3/d1` 生成 SQLite 供開發使用。
4) 啟動
```bash
npm run dev
```
造訪 `http://localhost:3000`。若要本地測圖片，上線 `IMAGES` 綁定（如 `wrangler dev` 模擬 R2 或 Pages 預覽環境）。

## 部署到 Cloudflare Pages
1) 建立並遷移 D1
```bash
npx wrangler d1 migrations apply trading-app-db
```
2) 建立 R2 並綁定 `IMAGES`（bucket 名 `trading-app-images`）
```bash
npx wrangler r2 bucket create trading-app-images
```
3) 在 Pages/Workers 設定環境變數：`BETTER_AUTH_SECRET`、`BETTER_AUTH_URL`（正式網域）、`RESEND_API_KEY`（若啟用驗證信）。
4) 建置與部署
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

# Trading Journal App

Cloud-first trading journal with trade logging, tag analytics, reports, rich-text notebook/templates, image uploads, and migration from browser localStorage. Built with Next.js 16 (App Router + Edge runtime), Drizzle ORM, Cloudflare D1/R2, Better Auth; targets Cloudflare Pages.

## Features
- Dashboard: net P&L, win rate, profit factor, average win/loss, cumulative & daily profit charts, calendar heatmap, recent trades. Supports **Account Switching** (Personal/Prop Firm).
- Trade management: create/edit/delete with multi-tags, direction/size/entry/exit/P&L; auto net P&L via preset contract multipliers, plus auto Points and Planned/Realized R:R, risk inputs, rating, notes.
- **Multi-Account Management**:
  - **Personal Accounts**: Manage in Settings (e.g., Interactive Brokers).
  - **Prop Firms**: Dedicated "Prop Firms" module to track costs, payouts, and evaluation status.
- Tags & categories: custom categories/tags with synced colors for reporting.
- Reports: tag P&L/win rate/counts/avg win-loss, P&L + volume combo chart, win-rate vs volume, ticker cross-analysis.
- Notebook & templates: TipTap rich text (headings, bold/italic, lists, code, quotes); insert/manage templates persisted in DB.
- Image uploads: JPEG/PNG/GIF/WebP (5MB) stored in Cloudflare R2 via `/api/images/upload`.
- Migration tool: detects legacy localStorage data (categories/tags/trades/notes/templates) and writes to the cloud DB.
- Auth & settings: Better Auth email/password, profile name, preferences (currency/date format/timezone/theme), trade export, account deletion.

## Tech Stack
- App: Next.js 16 (App Router, Edge), TypeScript, Cloudflare Pages (`@cloudflare/next-on-pages`)
- Data: Drizzle ORM + Cloudflare D1 (SQLite; local uses `.wrangler/state` SQLite)
- Storage: Cloudflare R2 `IMAGES` binding (`app/api/images` upload/serve)
- Auth: Better Auth (email/password)
- UI: Tailwind CSS, Lucide icons
- Charts/Editor: Recharts, TipTap (image upload, Placeholder, StarterKit)
- Preset futures tickers & contract multipliers: `lib/constants.ts` (drives auto P&L)

## Prerequisites
- Node.js 18+
- npm
- Cloudflare Wrangler CLI (for D1/R2 bindings and migrations)
- Cloudflare account (for Pages/D1/R2)

## Local Development
1) Install deps
```bash
npm install
```
2) Create `.env`
```env
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=optional_if_email_verification_is_enabled
```
3) Apply D1 migrations (uses `drizzle/*.sql`)
```bash
npx wrangler d1 migrations apply trading-app-db --local
```
Seeds the SQLite under `.wrangler/state/v3/d1` for dev.
4) Start dev server
```bash
npm run dev
```
Visit `http://localhost:3000`. For local image uploads, ensure an `IMAGES` binding (e.g., `wrangler dev` with R2 emulation or a Pages preview).

## Deploy to Cloudflare Pages
1) Provision/migrate D1
```bash
npx wrangler d1 migrations apply trading-app-db
```
2) Create/bind R2 `IMAGES` (bucket `trading-app-images`)
```bash
npx wrangler r2 bucket create trading-app-images
```
3) Set env vars in Pages/Workers: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (prod URL), `RESEND_API_KEY` if email verification is enabled.
4) Build & deploy
```bash
npm run build
npx wrangler pages deploy .next
```
`wrangler.toml` already sets `pages_build_output_dir=.next` and Edge compatibility.

## Scripts
- `npm run dev`: dev server
- `npm run build`: production build (with Webpack fallback)
- `npm run start`: serve built app
- `npm run lint`: ESLint

## Data & APIs
- Auth: `app/api/auth/[...all]` (Better Auth handler)
- Images: `app/api/images/upload` to R2, `app/api/images/[filename]` to serve
- Server actions: `app/actions/*` for trades, tags, notes, templates, settings (Drizzle + Edge runtime)

## License
ISC (per `package.json`)
