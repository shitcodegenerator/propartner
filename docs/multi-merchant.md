# 多商戶部署指南

同一份 repo，透過 Vite 環境變數區分商戶，各自部署到獨立的 Vercel 專案與後端。

---

## 專案結構

```
.env.propartner      ← 商戶一（葡眾）API 設定
.env.merchant2       ← 商戶二 API 設定
```

每個 `.env` 只需設定一個變數：

```env
VITE_API_BASE=https://your-backend.vercel.app
```

---

## 本地開發

```bash
# 商戶一（葡眾）
yarn dev:propartner

# 商戶二
yarn dev:merchant2
```

---

## 建置

```bash
# 商戶一
yarn build:propartner

# 商戶二
yarn build:merchant2
```

---

## Vercel 部署設定

### 商戶一（葡眾）— 現有 Vercel 專案

| 設定項目 | 值 |
|---------|-----|
| Build Command | `yarn build:propartner` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_BASE` = `https://propartnerbe.vercel.app` |

### 商戶二 — 新建 Vercel 專案

1. 前往 [vercel.com](https://vercel.com) → **Add New Project**
2. 匯入同一個 GitHub repo
3. 設定以下內容：

| 設定項目 | 值 |
|---------|-----|
| Build Command | `yarn build:merchant2` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_BASE` = `https://merchant2be.vercel.app`（填入實際後端網址） |

---

## 後端部署（不需改程式碼）

將後端 repo 在 Vercel 再部署一次作為新的 Project，設定不同的資料庫連線環境變數即可：

```
後端 Vercel Project A（葡眾）
  DATABASE_URL = mongodb://...propartner-db...

後端 Vercel Project B（商戶二）
  DATABASE_URL = mongodb://...merchant2-db...
```

兩個後端使用相同程式碼，資料完全隔離。

---

## 新增第三個商戶

1. 複製 `.env.merchant2` 為 `.env.merchant3`，填入新後端網址
2. 在 `package.json` 新增：
   ```json
   "dev:merchant3": "vite --mode merchant3",
   "build:merchant3": "vite build --mode merchant3"
   ```
3. 在 Vercel 建立新 Project，Build Command 設為 `yarn build:merchant3`
4. 後端 repo 再部署一次，使用新的 DB 連線
