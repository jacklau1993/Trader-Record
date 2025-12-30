# Mobile View Audit Report

**Date:** December 30, 2025
**Scope:** Mobile View (iPhone 12 Pro - 390x844)
**URL:** `https://trading-app-btc.pages.dev`

## Executive Summary

The application is functionally usable on mobile but suffers from significant layout regressions. **Horizontal overflow is present on every single page**, typically caused by non-responsive header elements (wide button groups, fixed-width inputs) and table containers. The navigation drawer (hamburger menu) is the only component functioning perfectly.

## Detailed Findings

### 1. Global Issues

- **Horizontal Overflow:** Users can scroll horizontally on every page. This breaks the "app-like" feel and allows content to float off-screen.
- **Root Cause:** Main content containers often lack `max-width: 100vw` or `overflow-x: hidden`. Several sub-components have fixed `min-width` or rigid flex layouts.

### 2. Dashboard

- **Header Truncation:** The top action bar containing "Import CSV" and the "All Accounts" selector is too wide.
- **Impact:** The "Import CSV" button is completely off-screen to the right. User cannot access this primary action without horizontal scrolling.
- **Metrics Cards:** Stack correctly, but their container adds to the overflow.

### 3. Trades Page

- **Table Layout:** The trade list is responsive (cards), but the "Net P&L" column values are cut off on the right edge.
- **Filters:** Filter inputs may be forcing the container width beyond 390px.

### 4. Reports Page

- **Header Layout:** The "Performance Report" and "Tags Report" toggle buttons are side-by-side and rigid, forcing the width.
- **Detailed Metrics Card:** The bottom card showing specific stats (Win Rate, Profit Factor) has truncated labels and cut-off values.
- **Charts:** The Equity Curve chart container adds horizontal scroll.

### 5. Notebook

- **"Pages" Header:** The `+` (Add Page) button is absolutely positioned or flex-pushed to `X ~926px`, causing a huge horizontal scroll area. This is the worst layout offender.
- **List Items:** Note titles are cramped and cut off without ellipsis.

### 6. Settings

- **Form Fields:** Input fields (Name, Email) are full-width but seem to exceed the viewport padding, contributing to overflow.
- **Buttons:** The "Save Profile" button has tight padding on the left.

## Plan for Improvement

### Immediate Fixes (High Priority)

1.  **Fix Global Overflow (layout.tsx / globals.css):**

    - Ensure the main `<body>` or root `<div>` has `overflow-x: hidden`.
    - Verify the main content wrapper has `max-width: 100%`.

2.  **Responsive Headers:**

    - **Dashboard/Reports:** Change the header flex direction to `column` on mobile (`flex-col` for `<sm`).
    - Stack the "Title", "Date Range", and "Action Buttons".

3.  **Notebook Layout Refactor:**

    - Fix the "Add Page" button positioning. It should be part of a flexible header, not fixed or pushed to a desktop width.

4.  **Trades Table/List:**
    - Ensure "Net P&L" text wraps or uses a smaller font size on mobile.

### Strategic Improvements

- **Mobile-First CSS Audit:** Review all `w-[x]` or `min-w-[x]` classes. Replace with `w-full` and `max-w-md` constraints.
- **Touch Targets:** Increase the height of inputs and buttons in the Settings page for easier touch interaction.

## Artifacts

Screenshots verifying these issues have been captured and stored in the project's brain directory.
