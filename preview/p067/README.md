# DAIRY 24HR｜P0.6.7 泌乳牛舍七項補強

**手機／桌機試玩**：https://topmiru221-sys.github.io/DAIRY-24HR-/preview/p067/?v=p067

基底：已驗收 **P0.6.6**，全數原有檔案保留在原預覽資料夾，另建 `preview/p067/`；正式首頁與榨乳室／儲乳區／管理室原樣保留。

## 七項新增功能與精確限制

1. **LED 與日夜氛圍**：九組牛舍屋架燈具與白天／黃昏／夜間手動切換；桌機額外使用兩組低強度點光源，手機避免額外 GPU 燈光負擔。非自動日光長週期模擬。
2. **牛群往返榨乳室動線**：三頭編號乳牛沿現有牛舍內路徑走向出口，接著可由「🧭 場景」進入既有榨乳室，既有早班榨乳動畫重新開始；回到泌乳牛舍可讓牛群沿路返回。跨區域是場景銜接，不是全牧場無縫自動尋路。
3. **推料安全停車**：固定推料路線上可手動顯示維修障礙物，機器人距離障礙過近會停車，撤走後繼續巡航。非商用等級雷達或動態繞道導航，也無醫療／安全合規宣稱。
4. **選擇性頭鎖**：採食欄位上八個示範鎖定指示可整批切換，保留原頭鎖架、動線與飲水位置；不是完整的單牛治療保定。
5. **行為動畫擴充**：採食時輕微擺頭、臥下時反芻頭部動作，牛群離舍示範走動。完整牛隻起臥轉換、採食／飲水逐頭精細 AI 尚未完成。
6. **TMR 剩料與補料**：料堆以固定速度模擬視覺耗損，可手動補料回復至滿槽；0–100% 是遊戲示意量，並非真實乾物攝取、配方或產乳預測。
7. **監測趨勢模擬**：每頭乳牛以 0–100 虛擬相對指標示意活動／反芻，最近 12 組可保留進暫存歷程、並可切換牛號。沒有真實感測來源、發情警報、疾病診斷或配種建議。

## 操作

進入「泌乳牛舍」→ 點 **ℹ️ 資訊** 展開（仍預設收合），即可在原推料機操作下方看到七項進階控制。亦可走近新增物件按 E 互動。

- 「🚧 放置障礙」可以在推料機巡航中測試停車；「🚧 移除障礙」可以恢復。
- 「🐄 牛群前往榨乳」後可先觀察乳牛走到出口，再在「🧭 場景」選「榨乳室」銜接既有作業。
- 回到「泌乳牛舍」使用「↩ 牛群返回」。
- 「💡 切換照明」可以驗收三個時段。
- 「📈 切換牛號」顯示不同乳牛的模擬資料。

## 回歸檢查

```sh
node preview/p067/barn-operations.test.mjs
node preview/p067/feed-pusher.test.mjs
node preview/p067/lactating-barn.test.mjs
node preview/p067/hud-fold.test.mjs
node preview/p067/controls.test.mjs
node preview/p067/cycle.test.mjs
node preview/p067/cow-walk.test.mjs
node preview/p067/shift-story.test.mjs
node preview/p067/farm-masterplan.test.mjs
```

## 實物資料與界線

- Lely 官方 Juno 推料設備： https://www.lelyna.com/us/solutions/feeding/juno/
- University of Minnesota Extension 乳牛時間配置： https://extension.umn.edu/dairy-milking-cows/how-overstocking-affects-cow-performance
- University of Wisconsin Extension 飼槽剩料與管理： https://dairy.extension.wisc.edu/articles/maximize-feed-bunk-management-to-increase-profitability/

**待實機驗收**：Android WebGL FPS、連續轉場、牛隻穿模、照明暗度與觸控按鈕。P0.6.7 仍是局部模擬場景，不等同完成全部 24 小時劇情與商業級 AI 系統。
