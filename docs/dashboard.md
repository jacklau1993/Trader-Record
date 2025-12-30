# Dashboard Redesign Specification

This document outlines the layout and components required to make **Trader Record** match the reference dashboard (Tradezella).

## 1. Design Overview

- **Theme**: Dark Mode (Primary background: very dark grey/black, Cards: slightly lighter dark grey).
- **Accent Colors**:
  - **Profit/Win**: Green (`#22c55e` / `rgb(34, 197, 94)`) - Used for positive P&L, bars, win segments.
  - **Loss**: Red (`#ef4444` / `rgb(239, 68, 68)`) - Used for negative P&L, bars, loss segments.
  - **Brand/Primary**: Blue/Purple tint for branding elements or borders.
- **Typography**: Clean sans-serif (Inter or similar). Monospace for financial figures.

## 2. Layout Structure

The dashboard is a flexible grid layout (likely CSS Grid or Flexbox).

### Header Area

- **Left**: "Dashboard" Title.
- **Right**:
  - Currency/Account Selector.
  - Filters dropdown.
  - Date Range Picker (e.g., "This month").
  - Account Profile/Settings.

### Row 1: Key Performance Indicators (KPIs)

A row of 5 uniformly sized cards.

1.  **Net P&L**: Large colored value, masked value toggle icon.
2.  **Trade Win %**: Main percentage, Semi-circle gauge chart (Win/Loss/BE).
3.  **Profit Factor**: Ratio value, Radial/Ring chart.
4.  **Avg Win/Loss Trade**: Ratio or separate values (Avg Win vs Avg Loss bar comparison).
5.  **Trade Expectancy**: Value, Reset/Action button.

### Row 2: Main Analytics & Recent Activity

Split view: `2/3` width for charts, `1/3` width for lists.

- **Left Column (Charts)**:
  - **Daily Net Cumulative P&L**: Area chart showing equity curve over time.
  - **Net Daily P&L**: Bar chart showing profit/loss per day (Green/Red bars).
- **Right Column (List)**:
  - **Tabs**: "Recent trades" | "Open positions".
  - **Table**: Columns: Close Date, Symbol, Net P&L (colored). Compact rows.

### Row 3: Calendar & Advanced Metrics

- **Left (Calendar)**: Large Monthly Calendar view.
  - Cells show Day Number.
  - Summary of P&L for that day (e.g., "-$299").
  - Number of trades (e.g., "1 trade").
  - Color-coded cells based on P&L (Green/Red backgrounds).
- **Right (Secondary Charts)**:
  - **Win % - Avg Win - Avg Loss**: Multi-line chart comparing these metrics over time.
  - **Trade Duration Performance**: Scatter plot showing P&L vs Duration.

## 3. Component Requirements

### UI Components (Shadcn/UI recommended)

- `Card`: For all widget containers.
- `Button`: Ghost/Outline variants for filters.
- `Select/Dropdown`: For account and date selection.
- `Tabs`: For Recent Trades pane.
- `Table`: For trades list.
- `Calendar`: Custom implementation needed for P&L display per cell.

### Visualization (Recharts or similar)

- **AreaChart**: Cumulative P&L.
- **BarChart**: Daily P&L (Positive/Negative color mapping).
- **PieChart/RadialBar**: Win % and Profit Factor.
- **ScatterChart**: Trade duration.

## 4. Implementation Priorities

1.  **Layout Shell**: Implement the grid structure.
2.  **Stats Cards**: Build the 5 top-level cards with mock data.
3.  **Recent Trades**: Enhance existing `RecentTrades.tsx` to match the table design.
4.  **Date/Filter Logic**: Ensure global state drives the data.
5.  **Charts**: specific chart components for P&L.

## 5. CSS/Tailwind Recommendations

- Use `grid-cols-12` for the main layout.
- Stats row: `grid-cols-5` (or flex with equal width).
- Row 2: `col-span-8` (Charts) vs `col-span-4` (Trades).
- Row 3: `col-span-8` (Calendar) vs `col-span-4` (Extra charts).
