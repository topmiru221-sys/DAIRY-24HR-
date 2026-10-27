# DAIRY 24HR｜P0.6.6：TMR、巡航式推料機、牛隻發情監測

🎮 **試玩網址**：https://topmiru221-sys.github.io/DAIRY-24HR-/preview/p066/?v=p066

從使用者已驗收的 **P0.6.5** 開發，僅擴充泌乳牛舍，不重做其他十個設施、全牧場地圖或已精修的榨乳室、儲乳區、管理室。

## 本版內容

**1. 真正看得見的 TMR 混合日糧**

左右兩側飼槽現在都有由青草／青貯／乾草色澤及穀料色澤構成的低多邊形碎料和成列飼料堆，能從等角視角看到不同顆粒。手機版左右共 32 個飼料區段；桌機版左右共 44 區段。TMR 配方與營養值尚未製作，避免虛構能量、蛋白質、混合比例和乾物率。

**2. 自動推料機真正會移動**

參考 [Lely Juno 官方說明](https://www.lely.com/tw/solutions/feeding/juno/) 造型及行為，製作原創的低矮圓筒式推料機，有紅色上蓋、側邊推料裙板、底部驅動輪、感測器、指示燈和獨立充電座。

- 從中央充電座出發，靠近左飼槽，沿著完整採食線推料。
- 在牛舍末端以圓滑曲線轉彎，沿右飼槽折返；機體會依路線切線方向轉動。
- 機器人接近的飼料堆會朝牛隻可及的飼槽邊緣位移，表示「推料」，而非撒出一份新的 TMR。
- 循環結束後返回充電座，不重複永久巡航。
- 玩家首次進入泌乳牛舍時，會自動示範一次。需要時可在 **ℹ️ 資訊** 面板使用「▶ 啟動／⏸ 暫停示範」及「↩ 回充／重設」，或走近機器人按 E。

注意：是示意路徑、簡化物件位移和基本視覺狀態，**沒有真正的避障偵測／路線重規劃／碰撞安全互鎖／機器人控制系統**。

**3. 發情偵測器完成獨立可辨識的模型**

原本乳牛都有綠色活動／反芻健康監測器，本版在每頭乳牛頸部再加上**藍色發情監測加速度計模組和小型狀態指示**，可對應原本背部四位數牛號。

- 手機：24 頭；桌機：32 頭；全數具備健康＋發情監測器。
- 場景增加「活動／反芻／發情」接收站，靠近按 E 可查看裝置用途。
- 真正的感測數值、資料基線、發情機率、發情時間、配種名單和通知**都尚未產生**；避免把健康或發情的假數字誤當作現場數據。

## 未來正式 24 小時故事的工作接口

檔案 `feed-pusher.mjs` 新增 `FUTURE_FEED_JOB`：`daily-feed-front-check`。這個資料項定義預計的每日工作順序：巡查飼槽、確認機器人與安全、執行推料、複查採食線；**狀態明確標記為 `preview-only`**，並未宣稱現在是完整工作系統。

發情監測也留待未來工作系統接入個體資料、時間序列、活動／反芻基準比較、提示與現場複核流程，而非目前用亂數製造病例或發情提示。

## 穩定性與保留

- 原 P0.6.5 的**左右資訊和場景選單預設收合**保留。
- P0.6.4 已驗收的風扇方向、平板扇、頂部風扇、運動場活動門、刮糞機、頭鎖噴淋、牛隻動作及移動操控保留。
- 11 個區域的地圖定位、14 個建築入口及 3 個舊精修區不修改。
- 泌乳牛舍新增 3 個可查看物件（TMR、推料機、發情監測），該區 7 → **10 個**；其他十區各 3 個，合計 **40 個**互動點。
- `scene.js` 新增推料狀態介面、首次進入示範與遊戲時間步長傳遞；`realistic-facilities.mjs` 只修改泌乳牛舍的介面接線與計數。
- `controls.mjs`、`working-parlor.mjs`、`cow-walk.mjs`、`support-rooms.mjs`、`room-assets.mjs`、`cycle.mjs`、`shift-story.mjs`、`farm-masterplan.mjs` 沿用 P0.6.5 原始檔案。

## 模型研究與專業限制

- [Lely Juno 官方機型](https://www.lely.com/tw/solutions/feeding/juno/)：定時沿飼槽推料、靠近採食前緣、自動巡航和充電站。遊戲使用**原創簡化機身**，非產品原始 CAD 模型。
- [University of Minnesota Extension—Feeding total mixed rations](https://extension.umn.edu/agriculture/animals-and-livestock/dairy/feeding-total-mixed-rations)：TMR 混合日糧、正確飼餵與觀察飼槽；模型顏色不代表實際配方。
- [SenseHub Dairy 行為監測頸圈](https://www.sensehub.co.nz/monitoring/collars-and-hardware/)：頸圈加速度計追蹤行為與反芻，透過模式判斷提供發情／健康提示，但並不直接診斷疾病。

## 驗收建議

1. 開啟 P0.6.6 → 🧭 場景 → 泌乳牛舍，確認兩側飼槽都呈現可見碎料狀 TMR。
2. 初次進入時，推料機應從牛舍內充電位置起步、逐段推靠 TMR、轉彎、完成後回充。
3. 展開 ℹ️ 資訊，測試推料示範 **暫停、繼續、回充／重設**；收合後恢復乾淨視野。
4. 靠近乳牛頸圈觀察藍色發情監測模組和原本背號，且不要出現憑空捏造的發情警報。
5. 返回原精修榨乳室、儲乳區、管理室，確認操作與畫面不受影響。

### 回歸測試

```sh
node preview/p066/feed-pusher.test.mjs
node preview/p066/lactating-barn.test.mjs
node preview/p066/hud-fold.test.mjs
node preview/p066/controls.test.mjs
node preview/p066/cycle.test.mjs
node preview/p066/cow-walk.test.mjs
node preview/p066/shift-story.test.mjs
node preview/p066/farm-masterplan.test.mjs
```

注意：自動巡航速度是**遊戲動畫速度**，不是 Juno 的真實車速；場景地坪、料堆和機器人路線仍未實測真實牛舍。手機 WebGL FPS、模型穿模和實機操作仍需玩家驗收。
