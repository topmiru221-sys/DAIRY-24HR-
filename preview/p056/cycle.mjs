// DAIRY 24HR — one complete, user-controllable early-milking session.
// Durations are intentionally shortened for GAME DEMONSTRATION, not dairy SOP.
export const STAGES=Object.freeze([
 {key:'arrival',label:'牛隻進場',seconds:15,hint:'牛隻從入口慢慢進入左右牛位'},
 {key:'prepare',label:'前處理',seconds:16,hint:'工作人員核對牛號、前處理與擦拭'},
 {key:'attach',label:'接乳杯',seconds:11,hint:'四乳杯依序接上，乳管與集乳座連接'},
 {key:'milking',label:'榨乳中',seconds:32,hint:'乳流與脈動器運作；可到處觀察'},
 {key:'detach',label:'脫杯',seconds:9,hint:'擠乳結束，乳杯組脫離乳房'},
 {key:'postdip',label:'後藥浴',seconds:9,hint:'乳頭後藥浴與結束確認'},
 {key:'departure',label:'牛隻離場',seconds:14,hint:'牛隻依序離場、通道恢復淨空'},
 {key:'cleaning',label:'收工清洗',seconds:15,hint:'清洗模式示意，管線與設備回路'},
 {key:'complete',label:'早場結束',seconds:Infinity,hint:'這批完成了；可以再看一輪或繼續探索'}
]);
export function createMilkingCycle(){
 let stage=0,elapsed=0,playing=false,round=1,helps=0,transitions=0;
 const limit=dt=>Number.isFinite(dt)?Math.max(0,Math.min(dt,.1)):0;
 function next(){
   if(stage<STAGES.length-1){stage++;elapsed=0;transitions++}
   else{stage=0;elapsed=0;round++;transitions=0;helps=0}
   if(stage===STAGES.length-1)playing=false;
 }
 function update(dt){
   if(!playing)return;
   elapsed+=limit(dt);
   if(elapsed>=STAGES[stage].seconds)next();
 }
 function jump(){next();return snapshot()}
 function replay(){stage=0;elapsed=0;round++;helps=0;playing=true;transitions=0;return snapshot()}
 function toggle(){if(stage===STAGES.length-1)return replay();playing=!playing;return snapshot()}
 function help(){if(playing&&['prepare','attach','detach','postdip','cleaning'].includes(STAGES[stage].key))helps++;return snapshot()}
 function snapshot(){
   const item=STAGES[stage],seconds=item.seconds;
   return {stage:stage,key:item.key,label:item.label,hint:item.hint,
     progress:Number.isFinite(seconds)?Math.min(1,elapsed/seconds):1,
     elapsed,seconds,playing,round,helps,transitions,done:item.key==='complete'};
 }
 return {update,jump,replay,toggle,help,snapshot};
}
