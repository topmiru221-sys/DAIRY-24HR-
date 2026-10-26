// DAIRY 24HR P0.5.8 — optional morning-shift story across three 3D rooms.
// Pure state; no data storage, network calls, compulsory quizzes, or medical claims.
export const MORNING_TASKS=Object.freeze([
 {id:'prepare',area:'parlor',name:'到榨乳室看看用品',hint:'走近前處理用品架，按 E 或右下角互動',target:'tools'},
 {id:'cooling',area:'tank',name:'看看儲乳區的溫控顯示',hint:'到儲乳區，走近溫度面板查看示意讀數',target:'milk-temp'},
 {id:'handover',area:'office',name:'查閱早班工作紀錄',hint:'到管理室，走近管理電腦查看紀錄',target:'office-desk'},
 {id:'report',area:'parlor',name:'向美玲姐說一聲',hint:'三區域都走過後，回榨乳室找美玲姐聊聊',target:'mei'}
]);
export const PRIORITIES=Object.freeze([
 {id:'cows',name:'先看牛位',note:'你先熟悉榨乳室的工作節奏'},
 {id:'milk',name:'先看儲乳',note:'你先確認生乳儲存區的情境顯示'},
 {id:'records',name:'先看紀錄',note:'你從管理室的工作安排開始了解'}
]);
export function createMorningStory({variant=0}={}){
 const done=new Set(),visited=new Set(),ambient=new Set();
 const priorityIds=PRIORITIES.map(x=>x.id);
 const v=Math.abs(Math.floor(Number.isFinite(variant)?variant:0))%3;
 const variants=[
  {parlor:'美玲姐：「今天早場照平常做，別急著找問題。」',tank:'冷卻機傳來規律的嗡嗡聲，儲乳區的工作燈亮著。',office:'管理室的白板留著今天的交班提醒。'},
  {parlor:'阿力從另一排探頭：「我看這排，你慢慢熟悉環境。」',tank:'管路整齊地沿著儲乳槽旁排列，出口留有工作空間。',office:'桌上攤著值班紀錄，旁邊放著一杯早班咖啡。'},
  {parlor:'入口傳來牛隻緩緩走動的聲音，這是普通的一天。',tank:'儲乳區的顯示器亮著，標記清楚寫著「模擬」。',office:'監控示意螢幕亮著，值班人員把資料整理在一旁。'}
 ];
 let focus='cows',elapsed=0,clockMinutes=310,zone='parlor',zoneSeconds=0;
 let pendingEvent=null;
 const requireTask=id=>MORNING_TASKS.find(x=>x.id===id);
 function clock(){
  const minutes=Math.floor(clockMinutes);
  return String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
 }
 function choosePriority(id){
  if(!priorityIds.includes(id))return snapshot();
  focus=id;return snapshot();
 }
 function enterArea(next){
  if(!['parlor','tank','office'].includes(next))return null;
  zone=next;zoneSeconds=0;
  const first=!visited.has(next);visited.add(next);
  if(first && next!=='parlor')return next==='tank'
   ?'你第一次走進儲乳區。這裡的讀數都是遊戲示意。'
   :'你第一次走進管理室。桌上放著今天的交班資料。';
  return null;
 }
 function update(dt){
  if(!Number.isFinite(dt)||dt<=0)return null;
  const delta=Math.min(dt,.10);
  elapsed+=delta;zoneSeconds+=delta;
  // About 35 in-game minutes per 100 seconds; not a claim about real milking.
  clockMinutes=310+elapsed*.35;
  if(!ambient.has(zone)&&zoneSeconds>11){
   ambient.add(zone);
   pendingEvent=variants[v][zone];
  }
  const message=pendingEvent;pendingEvent=null;
  return message;
 }
 function observe(id,area){
  if(!id || !requireTask('prepare'))return {changed:false,completed:false};
  const map={'tools':'prepare','milk-temp':'cooling','office-desk':'handover','mei':'report'};
  const taskId=map[id];
  if(!taskId)return {changed:false,completed:isComplete()};
  const task=requireTask(taskId);
  if(task.area!==area)return {changed:false,completed:isComplete()};
  if(done.has(taskId))return {changed:false,completed:isComplete()};
  if(taskId==='report' && !['prepare','cooling','handover'].every(k=>done.has(k))){
   // Do not turn normal NPC conversation into a compulsory task gate.
   return {changed:false,completed:false};
  }
  done.add(taskId);
  const completed=isComplete();
  const lines={
   prepare:'你確認了作業用品的位置。美玲姐：「好啊，等一下拿東西就知道去哪找了。」',
   cooling:'你看了儲乳溫度的示意讀數，記下「這不是真實量測」。',
   handover:'你查閱了示意值班紀錄，知道今天早班有哪些工作。',
   report:focus==='cows'?'美玲姐：「你今天看得滿仔細的喔，下次一起顧牛吧。」':
    focus==='milk'?'美玲姐：「連儲乳區你都去看啦，不錯喔。」':
     '美玲姐：「交班紀錄都有看，這樣接著做比較清楚。」'
  };
  return {changed:true,taskId,completed,line:lines[taskId]};
 }
 function isComplete(){return MORNING_TASKS.every(x=>done.has(x.id))}
 function snapshot(){
  const tasks=MORNING_TASKS.map(t=>({...t,done:done.has(t.id),available:t.id!=='report'||['prepare','cooling','handover'].every(k=>done.has(k))}));
  const firstUndone=tasks.find(t=>!t.done&&t.available)||tasks.find(t=>!t.done);
  return {tasks,doneCount:done.size,total:tasks.length,complete:isComplete(),
   focus,priority:PRIORITIES.find(x=>x.id===focus),clock:clock(),elapsed,
   currentArea:zone,visited:[...visited],next:firstUndone||null};
 }
 return {choosePriority,enterArea,update,observe,snapshot};
}
