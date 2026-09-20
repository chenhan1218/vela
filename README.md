# Vela · 用藥提醒 POC (Medicine Reminder Proof-of-Concept)

> 為遠方家人點一盞守護之燈（Keep a light on for someone）。

這是一個基於 **Vela** 核心概念構建的極簡用藥提醒概念驗證（POC）。以「**非監控式守護**」與「**極簡大字體操作**」為核心，讓長輩能以最低摩擦力記錄日常服藥，同時透過點亮「守護之燈」，讓遠端子女第一時間獲得安心回饋。

---

## ✨ 核心特色

1. **極簡零負擔互動**：
   - 專為長輩優化的大字體、高對比、大點擊熱區（Touch Target）設計。
   - 一鍵切換服藥狀態，自動記錄服藥時間（如「已於 08:15 服用」）。
2. **守護之燈（The Kept Light）即時回饋**：
   - 當日所有藥物服用完畢後，頂端守護燈立即點亮並發出柔和微光，象徵平安與守護。
3. **語音朗讀提醒（Web Speech Synthesis）**：
   - 點擊喇叭圖示即可用語音朗讀藥品名稱、服用時間與注意事項。
4. **溫和音效回饋（Web Audio API）**：
   - 完成服藥標記時發出輕柔和弦音，提供長輩正向安心的操作確認。
5. **本地離線儲存（LocalStorage）**：
   - 所有資料與自訂新增的用藥排程均保存在瀏覽器本地，重新整理或離線皆可使用。
6. **支援自訂新增**：
   - 支援隨時新增個人化藥品、設定時間與備註說明。

---

## 🚀 快速開始

這是一個純靜態網頁（Static Website），無需任何編譯或套件安裝即可直接運行。

### 1. 本地開啟
直接在瀏覽器中開啟 `index.html`：
```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

或使用簡易 HTTP 伺服器啟動：
```bash
# Python
python3 -m http.server 8080

# 或 Node.js
npx serve .
```
開啟瀏覽器訪問 `http://localhost:8080` 即可。

---

## 🌐 線上即時體驗 (Live Demo)

- **GitHub Pages 體驗網址**：[https://chenhan1218.github.io/vela/](https://chenhan1218.github.io/vela/)
- **GitHub 專案倉庫**：[https://github.com/chenhan1218/vela](https://github.com/chenhan1218/vela)

---

## 📂 專案結構

```
vela/
├── index.html      # 核心結構與語意化標記
├── style.css       # Candle & Ink 溫暖視覺設計系統
├── app.js          # 用藥狀態管理、語音合成與音效回饋
└── README.md       # 專案說明文件
```

