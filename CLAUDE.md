# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

葡眾 (ProPartner) 抽獎系統 — 用於「葡眾珍鑽經理贈車表揚大會」的現場抽獎前端應用。包含參加者報名、現場抽獎展示、得獎名單查詢、管理設定等功能。

## Commands

```bash
yarn dev      # 啟動開發伺服器 (Vite)
yarn build    # 建置生產版本
yarn preview  # 預覽生產版本
```

無 TypeScript 型別檢查命令，不需執行型別檢查。

## Tech Stack

- **Framework**: Vue 3 (`<script setup>` SFC)
- **Build**: Vite 5
- **UI**: Element Plus + TailwindCSS 3
- **Style**: SCSS (scoped)、TailwindCSS utilities
- **HTTP**: Axios（直接呼叫，無封裝層）
- **Routing**: Vue Router 4（Hash 模式）
- **Package Manager**: Yarn 1

## Architecture

### 路由與頁面

路由定義在 `src/main.js`，使用 `createWebHashHistory`：

| 路徑 | 元件 | 用途 |
|------|------|------|
| `/` | `Home.vue` | 主抽獎展示頁（需密碼登入，支援全螢幕、鍵盤觸發抽獎） |
| `/enterdata` | `EnterData.vue` | 參加者報名表單（手機端填寫姓名/手機/身分證） |
| `/winners` | `Winners.vue` | 得獎名單頁（支援 `?raw=true` 顯示完整資料） |
| `/settings` | `Settings.vue` | 管理頁（設定抽獎人數/時間、重置名單、新增測試資料） |

### 後端 API

所有 API 呼叫直接使用 axios 指向 `https://propartnerbe.vercel.app`，無統一的 request wrapper。主要端點：

- `GET /lottery?event=&size=` — 執行抽獎
- `POST /enroll` — 報名參加
- `GET /getWinners?event=` — 取得得獎名單
- `GET /reset?event=` — 重置得獎者
- `GET /clear` — 清除所有參加者
- `GET /fake?event=` — 新增測試資料
- `POST /setNum` / `GET /getNum` — 設定/取得抽獎人數
- `POST /setTime` / `GET /getTime` — 設定/取得兌換時間

### 關鍵行為

- **Home.vue**: 按 `s + Enter` 同時觸發抽獎，按 `Space` 切換全螢幕，中獎者以 300ms 間隔逐一顯示
- **個資遮蔽**: `maskName()` 和 `maskTWID()` 在 Home.vue 與 Winners.vue 各自定義（重複邏輯）
- **場次 (event)**: 透過 URL query `?event=N` 傳遞，控制不同場次的抽獎資料

### 靜態資源

`src/assets/` 存放品牌 logo（SVG/PNG）、標題圖片、背景圖片。
