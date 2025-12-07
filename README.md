# Trading Journal App / 交易日記應用

A modern, secure, and feature-rich trading journal application designed to help traders track their performance, analyze strategies, and maintain discipline. Built with **Next.js 16**, **Drizzle ORM**, **Cloudflare D1**, and **Better Auth**.

這是一個現代化、安全且功能豐富的交易日記應用程序，旨在幫助交易者追蹤表現、分析策略並保持紀律。使用 **Next.js 16**、**Drizzle ORM**、**Cloudflare D1** 和 **Better Auth** 構建。

---

## 🚀 Features / 功能特點

- **Stats Dashboard**: Real-time performance metrics (Win Rate, Profit Factor, P&L) and visual charts.
  - **統計儀表板**：實時表現指標（勝率、獲利因子、損益）和可視化圖表。
- **Trade Logging**: Detailed trade entry with automated R:R calculations, tags, and notes.
  - **交易記錄**：詳細的交易輸入，自動計算風險回報比（R:R），支持標籤和筆記。
- **Notebook**: Integrated markdown editor for Daily Plans, Trade Reviews, and Strategy Notes.
  - **筆記本**：集成 Markdown 編輯器，用於日誌計劃、交易回顧和策略筆記。
- **Tag System**: Flexible tagging for strategies, mistakes, and setups with performance analysis by tag.
  - **標籤系統**：靈活的標籤功能，用於標記策略、錯誤和設置，並按標籤進行表現分析。
- **Secure Auth**: Email/Password authentication powered by Better Auth.
  - **安全認證**：由 Better Auth 支持的電子郵件/密碼認證。
- **Cloud Database**: Persistent storage using Cloudflare D1 (SQLite), supporting easy migration from localStorage.
  - **雲端數據庫**：使用 Cloudflare D1 (SQLite) 進行持久存儲，支持從 localStorage 輕鬆遷移。

## 🛠️ Tech Stack / 技術棧

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React
- **Database**: Drizzle ORM + Cloudflare D1 (SQLite)
- **Authentication**: Better Auth
- **Charts**: Recharts
- **Hosting**: Cloudflare Pages

## 🏁 Getting Started / 開始使用

### Prerequisites / 前置要求

- Node.js 18+
- npm or pnpm

### Installation / 安裝

1. **Clone the repository / 克隆存儲庫**
   ```bash
   git clone <repository-url>
   cd trading-app
   ```

2. **Install dependencies / 安裝依賴**
   ```bash
   npm install
   ```

3. **Environment Setup / 環境設置**
   Create a `.env` file in the root directory:
   在根目錄創建 `.env` 文件：
   ```env
   BETTER_AUTH_SECRET=your_generated_secret_here
   BETTER_AUTH_URL=http://localhost:3000
   ```
   *You can generate a secret using `openssl rand -hex 32` / 您可以使用 `openssl rand -hex 32` 生成密鑰*

4. **Run Database Migrations / 運行數據庫遷移**
   Initialize the local SQLite database:
   初始化本地 SQLite 數據庫：
   ```bash
   npx drizzle-kit push
   ```

5. **Start Development Server / 啟動開發服務器**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)。

## 📦 Deployment / 部署

This app is capable for Cloudflare Pages.
此應用程序已配置為可以部署到 Cloudflare Pages。

1. **Build the application / 構建應用**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare / 部署到 Cloudflare**
   Ensure you have Wrangler installed and authenticated.
   確保您已安裝並驗證 Wrangler。
   ```bash
   npx wrangler pages deploy .vercel/output/static
   ```
   *(Note: Adjust build output directory based on your Next.js config / 注意：根據您的 Next.js 配置調整構建輸出目錄)*

## 📄 License / 許可證

MIT
