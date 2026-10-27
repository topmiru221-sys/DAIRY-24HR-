# DAIRY 24HR｜P0.6.2 加大泌乳牛舍與運動場

試玩：https://topmiru221-sys.github.io/DAIRY-24HR-/preview/p062/?v=p062

本版集中精修泌乳牛舍，保留原先全場 16 地圖節點、14 設施入口、榨乳室／儲乳室／管理室三大精修區及其他十個未選中區域。

## 已完成

| 項目 | 模型及玩法 |
|---|---|
| 擴大牛舍 | 46 × 36 遊戲單位的開放式自由牛床舍、可自由走動 |
| 戶外運動場 | 相連 48 × 25 遊戲單位，遮蔭、飲水、欄杆、排水及牛體刷 |
| 牛隻散布 | 牛床躺臥、飼槽採食、室內走道活動、戶外站立／散步／休息 |
| 牛舍風扇 | 高屋架、半透明斜屋頂、桌機18組／手機12組旋轉風扇 |
| 採食線噴水 | 頭鎖牛側噴淋主管，10個噴嘴，E 鍵啟動短暫演示／自動停機 |
| 個體追蹤 | 手機12頭／桌機16頭，每頭有背上4位數編號、頸圈健康監測器和耳牌 |
| 刮糞設施 | 兩條刮糞走道、牽引導槽、末端集污溝及可短暫演示的慢速刮板 |

泌乳牛舍有六個可查看的設施／觀察點，其他十區各三個，共36個。手機可直接點『牛舍』或『運動場』切換試玩位置，也可用已驗收的方向鍵與點地移動自行走動；攝影機容許更大的拉遠範圍。

## 研究依據

資料來源與具體的建模決策放在 [REFERENCES.md](REFERENCES.md)，包括 Penn State Extension 自由牛床、DairyNZ 牛舍與刮糞系統、EFSA 戶外活動福利研究、Ontario／Missouri 奶牛降溫，以及 Dairy Conservation 精準監測器。

## 限制

所有尺寸皆為遊戲單位，非工程公尺數，不能用來驗算牛床、密度或運動場規模。噴水約9秒、刮糞約22秒是互動展示時間，不是現場建議控制週期。健康頸圈沒有產出虛構反芻、體溫或疾病資料。動物行為與刮糞動作仍是簡化動畫，尚未建立完整避碰與機械安全互鎖。

本版模型由 GitHub 程式與模擬檢查，實際 Android 3D 畫面 FPS、穿模及手機介面仍待用戶實機驗收。

## 檔案與版本

- lactating-barn.mjs：新泌乳牛舍、戶外活動場、牛號／感測器、風扇、噴淋及刮糞。
- realistic-facilities.mjs：只替換泌乳牛舍，其餘十區保持原版。
- farm-masterplan.mjs：只放大整體地圖的泌乳牛舍建築外觀並附加戶外活動場。
- scene.js：只擴大泌乳牛舍人物移動範圍、快捷切換、互動和相機縮放。
- controls.mjs、working-parlor.mjs、cow-walk.mjs、support-rooms.mjs、room-assets.mjs、cycle.mjs、shift-story.mjs：由已驗收版原封複製。
- 檢查：controls.test.mjs、cow-walk.test.mjs、cycle.test.mjs、shift-story.test.mjs、farm-masterplan.test.mjs、lactating-barn.test.mjs。

前一版 P0.6.1：https://topmiru221-sys.github.io/DAIRY-24HR-/preview/p061/