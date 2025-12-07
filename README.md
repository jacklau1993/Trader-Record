# 交易日記應用 (Trading Journal App)

一款面向主動交易者的雲端交易日記，涵蓋交易紀錄、標籤維度分析、富文本筆記與模板、圖片上傳，以及從瀏覽器 localStorage 遷移到雲端的工具。採用 Next.js 16（App Router + Edge Runtime）、Drizzle ORM、Cloudflare D1 與 R2、Better Auth 架構，預設部署於 Cloudflare Pages。

## 功能總覽
- 儀表板：顯示淨損益、勝率、獲利因子、平均盈虧，並有累積/日收益圖、日曆熱力圖、近期交易。
- 交易管理：新增/編輯/刪除交易，支援方向、倉位、進出場、P&L，並自動計算 Points、Planned/Realized R:R、風險數據與評分。
- 標籤與分類：自訂分類與標籤，交易可套用多標籤，顏色與分類同步更新。
- 報表：依標籤呈現 P&L、勝率、交易次數、平均盈虧，並有 P&L+成交量組合圖、勝率/成交量圖與標的交叉分析。
- 筆記本與模板：多段落/多頁筆記，TipTap 富文本編輯器（標題、粗斜體、列表、程式碼、引用），可插入/管理模板並保存到資料庫。
- 圖片上傳：筆記可上傳圖片到 Cloudflare R2，接受 JPEG/PNG/GIF/WebP，限制 5MB。
- 資料遷移：偵測舊版瀏覽器 localStorage，將分類、標籤、交易、筆記與模板寫入雲端資料庫。
- 驗證與設定：Better Auth 電郵/密碼登入、帳戶設定（名稱）、偏好設定（幣別、日期格式、時區、主題），支援交易匯出與刪除帳戶。

## 技術棧
- 應用：Next.js 16（App Router，Edge runtime）、TypeScript、Cloudflare Pages（`@cloudflare/next-on-pages`）
- 資料層：Drizzle ORM + Cloudflare D1（SQLite），本地使用 `.wrangler/state` 中的 SQLite 檔
- 儲存：Cloudflare R2（影像綁定 `IMAGES`），API 於 `app/api/images`
- 認證：Better Auth（email/password）
- 介面：Tailwind CSS、Lucide 圖示
- 圖表與編輯：Recharts、TipTap（含圖片上傳、Placeholder、StarterKit）

## 環境需求
- Node.js 18+
- npm
- Cloudflare Wrangler CLI（D1/R2 綁定與遷移）
- Cloudflare 帳號（部署至 Pages/D1/R2 時）

## 本地快速開始
1) 安裝依賴  
```bash
npm install
```

2) 設定環境變數，於專案根目錄建立 `.env`：  
```env
BETTER_AUTH_SECRET=以 openssl rand -hex 32 產生的隨機字串
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=可選，用於啟用驗證信
```

3) 初始化本地 D1 資料庫（使用現有 Drizzle 遷移檔 `drizzle/*.sql`）：  
```bash
npx wrangler d1 migrations apply trading-app-db --local
```
這會在 `.wrangler/state/v3/d1` 產生 SQLite 檔，供開發模式使用。

4) 啟動開發伺服器  
```bash
npm run dev
```
預設埠 `http://localhost:3000`。若要本地測試圖片上傳，需讓 `IMAGES` 綁定可用（例如以 `wrangler dev` 提供 R2 模擬，或在 Cloudflare Pages 預覽環境驗證）。

## 部署到 Cloudflare Pages
1) 建立並遷移 D1  
```bash
npx wrangler d1 migrations apply trading-app-db
```

2) 準備 R2 並綁定 `IMAGES`（bucket 名稱在 `wrangler.toml` 中為 `trading-app-images`）  
```bash
npx wrangler r2 bucket create trading-app-images
```

3) 在 Pages/Workers 專案中設定環境變數：`BETTER_AUTH_SECRET`、`BETTER_AUTH_URL`（指向正式網域），如需郵件驗證則加入 `RESEND_API_KEY`。

4) 建置並部署  
```bash
npm run build
npx wrangler pages deploy .next
```
`wrangler.toml` 已設定 `pages_build_output_dir = ".next"` 與 Edge 相容性旗標。

## 可用腳本
- `npm run dev`：開發模式（Next.js）
- `npm run build`：建置（含 Webpack fallback）
- `npm run start`：啟動已建置的應用
- `npm run lint`：ESLint 檢查

## 資料與 API 節點
- 認證：`app/api/auth/[...all]`（Better Auth handler）
- 圖片：`app/api/images/upload` 上傳至 R2，`app/api/images/[filename]` 讀取
- 伺服器動作：`app/actions/*` 覆蓋交易、標籤、筆記、模板、設定等資料流（採用 Drizzle 與 Edge runtime）

## 授權
ISC（以 `package.json` 為準）

---

# Trading Journal App

A cloud-first trading journal for active traders with trade logging, tag-based analytics, rich text notebooks and templates, image uploads, and a migration path from browser localStorage. Built with Next.js 16 (App Router + Edge runtime), Drizzle ORM, Cloudflare D1 and R2, and Better Auth, targeting Cloudflare Pages by default.

## Features
- Dashboard: net P&L, win rate, profit factor, average win/loss, cumulative and daily profit charts, calendar heatmap, and recent trades.
- Trade management: create/edit/delete trades with direction, size, entry/exit, P&L, plus auto-calculated points and planned/realized R:R, risk inputs, rating, and notes.
- Tags and categories: custom categories/tags, multi-tag assignment per trade, color-coordinated categories.
- Reports: tag-level P&L, win rate, counts, average win/loss, combined P&L + volume chart, win-rate vs volume chart, and ticker cross-analysis.
- Notebook and templates: multi-section notebook, TipTap rich text (headings, bold/italic, lists, code, quotes), insert/manage templates persisted in the DB.
- Image uploads: notebook images stored in Cloudflare R2 via `/api/images/upload`, JPEG/PNG/GIF/WebP with 5MB cap.
- Data migration: detects legacy localStorage data and pushes categories, tags, trades, notes, and templates to the cloud DB.
- Auth and settings: Better Auth email/password login, profile update, preferences (currency, date format, timezone, theme), trade export, and account deletion.

## Tech Stack
- App: Next.js 16 (App Router, Edge runtime), TypeScript, Cloudflare Pages (`@cloudflare/next-on-pages`)
- Data: Drizzle ORM + Cloudflare D1 (SQLite), local dev uses `.wrangler/state` SQLite file
- Storage: Cloudflare R2 for images (`IMAGES` binding), APIs under `app/api/images`
- Auth: Better Auth (email/password)
- UI: Tailwind CSS, Lucide icons
- Charts & editor: Recharts, TipTap (with image upload, Placeholder, StarterKit)

## Prerequisites
- Node.js 18+
- npm
- Cloudflare Wrangler CLI (for D1/R2 bindings and migrations)
- Cloudflare account for deployment to Pages/D1/R2

## Local Development
1) Install dependencies  
```bash
npm install
```

2) Create `.env` in the repo root:  
```env
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
BETTER_AUTH_URL=http://localhost:3000
RESEND_API_KEY=optional_if_email_verification_is_enabled
```

3) Apply D1 migrations locally (uses `drizzle/*.sql`):  
```bash
npx wrangler d1 migrations apply trading-app-db --local
```
This seeds the SQLite file under `.wrangler/state/v3/d1` for dev use.

4) Start the dev server  
```bash
npm run dev
```
Visit `http://localhost:3000`. For local image uploads, ensure an `IMAGES` binding is available (e.g., via `wrangler dev` with R2 emulation or by testing in a Cloudflare Pages preview environment).

## Deploying to Cloudflare Pages
1) Provision and migrate D1:  
```bash
npx wrangler d1 migrations apply trading-app-db
```

2) Prepare R2 and bind `IMAGES` (bucket name in `wrangler.toml` is `trading-app-images`):  
```bash
npx wrangler r2 bucket create trading-app-images
```

3) Set environment variables in Pages/Workers: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (production URL), and `RESEND_API_KEY` if you enable verification emails.

4) Build and deploy:  
```bash
npm run build
npx wrangler pages deploy .next
```
`wrangler.toml` already sets `pages_build_output_dir = ".next"` and edge compatibility flags.

## Scripts
- `npm run dev`: Next.js dev server
- `npm run build`: production build (with Webpack fallback)
- `npm run start`: serve the built app
- `npm run lint`: ESLint checks

## Data & APIs
- Auth: `app/api/auth/[...all]` (Better Auth handler)
- Images: `app/api/images/upload` for R2 uploads, `app/api/images/[filename]` to serve files
- Server actions: `app/actions/*` cover trades, tags, notes, templates, settings, all using Drizzle on Edge

## License
ISC (per `package.json`)
