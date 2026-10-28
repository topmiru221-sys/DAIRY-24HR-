// DAIRY 24HR P0.6.7: optional barn systems, NOT real farm telemetry.
export function createBarnOperations({THREE,barn,cowInfo,feedPusher,mobile=false}){
 const mat=(hex,glow=0)=>new THREE.MeshStandardMaterial({color:hex,roughness:.64,emissive:hex,emissiveIntensity:glow});
 const steel=mat(0x849ba2),lit=mat(0xfff1be,.35),off=mat(0x778b92,.05),amber=mat(0xffb749,.65),green=mat(0x46c7a5,.45);
 const cube=new THREE.BoxGeometry(1,1,1);
 function group(name,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);barn.add(g);return g}
 function box(parent,name,x,y,z,w,h,d,m){
  const o=new THREE.Mesh(cube,m);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);parent.add(o);return o;
 }
 // Overhead LED housings: no heavy shadow-casting light on phones.
 const lamps=[];
 for(const x of [-12.5,0,12.5])for(const z of [-22,-10,2]){
  const assembly=group('Barn overhead LED fixture',x,5.9,z);
  box(assembly,'LED casing',0,0,0,1.45,.13,.33,steel);
  const lens=box(assembly,'Barn LED glow panel',0,-.09,0,1.31,.04,.27,lit);
  lamps.push(lens);
 }
 const fillLights=[];
 if(!mobile&&typeof THREE.PointLight==='function')for(const z of [-15,1]){
  const p=new THREE.PointLight(0xffe8b7,0,18,2);p.position.set(0,4.7,z);barn.add(p);fillLights.push(p);
 }
 let lighting='day', headlock=false,obstacle=false,time=0,monitorAccum=0;
 const lightingModes=['day','dusk','night'];
 const lockIndicators=[];
 for(const side of [-1,1])for(const z of [-20,-13,-6,1]){
  const frame=group('Selectable feed headlock indicator',side*5.39,1.40,z);
  const arm=box(frame,'Selectable headlock swinging latch',0,0,0,.11,.60,.11,green);
  lockIndicators.push(arm);
 }
 const barrier=group('Feed-robot removable service obstruction',-3.30,0,-11.10);
 box(barrier,'Maintenance block safety demonstration',0,.32,0,1.25,.64,1.10,amber);
 box(barrier,'Safety hazard high-visibility stripe',0,.69,0,1.27,.09,1.12,off);
 barrier.visible=false;
 const herdIds=[1204,1227,1207];
 const herd=herdIds.map(id=>cowInfo.find(c=>c.id===id)).filter(Boolean).map(c=>{
  const from={x:c.base.x,z:c.base.z};
  const side=from.x<0?-1:1;
  const route=[from,{x:side*12.5,z:from.z},{x:side*12.5,z:-26.7},
               {x:side*23.2,z:-27.6},{x:side*24.7,z:-29.2}];
  return {cow:c,route};
 });
 let transfer='idle',transferProgress=0;
 const monitors=new Map(cowInfo.map(c=>[c.id,{history:[],activity:0,rumination:0}]));
 let sampleIndex=0,selectedCow=cowInfo[0]?.id||1201;
 function setLighting(mode){
  if(!lightingModes.includes(mode))return lighting;
  lighting=mode;
  const power=mode==='night'?1.35:mode==='dusk'?.7:.24;
  for(const l of lamps)l.material=mode==='day'?off:lit;
  for(const p of fillLights)p.intensity=power;
  return lighting;
 }
 function cycleLighting(){return setLighting(lightingModes[(lightingModes.indexOf(lighting)+1)%3])}
 function toggleHeadlocks(){
  headlock=!headlock;
  for(const latch of lockIndicators){
   latch.rotation.z=headlock?.50:0;
   latch.material=headlock?amber:green;
  }
  return headlock?'示範頭鎖已鎖定指定欄位（非整群）':'示範頭鎖已全部釋放';
 }
 function toggleObstacle(){obstacle=!obstacle;barrier.visible=obstacle;return obstacle?'推料通道加入維修障礙，機器人靠近會安全停車':'維修障礙已移除，推料機可繼續巡航'}
 feedPusher.setSafetyCheck?.((x,z)=>!obstacle||Math.hypot(x+3.3,z+11.1)>1.70);
 function startTransfer(){
  if(transfer!=='idle'&&transfer!=='returned')return '牛群示範正在進行中';
  transfer='departing';transferProgress=0;
  return '3 頭示範乳牛將沿牛舍走道抵達出口，接續榨乳室場景';
 }
 function returnHerd(){
  if(transfer==='idle')return '目前沒有外出的示範牛群';
  transfer='returning';transferProgress=0;
  return '示範牛群從榨乳動線返回原牛舍位置';
 }
 function pickCow(){const a=cowInfo.map(c=>c.id),i=a.indexOf(selectedCow);selectedCow=a[(i+1)%a.length];return selectedCow}
 function sensor(){
  const s=monitors.get(selectedCow);
  return {id:selectedCow,activity:s?.activity||0,rumination:s?.rumination||0,
   history:s?.history.slice(-12)||[],kind:'SIMULATED BEHAVIOR INDICES (0–100), NOT CLINICAL DATA'};
 }
 function update(t,dt=.016){
  time=t;const d=Math.max(0,Math.min(.07,Number.isFinite(dt)?dt:0));
  // Deliberately understated feed/rumination motion, without teleporting stall cows.
  for(const c of cowInfo){
   if(transfer!=='idle'&&herd.some(e=>e.cow.id===c.id))continue;
   const feeding=c.behavior==='feeding';
   const resting=c.behavior.includes('lying');
   c.head.rotation.x=(feeding?.052:resting?.025:.012)*Math.sin(t*(feeding?2.5:1.1)+c.id);
   if(resting)c.head.rotation.y=.045*Math.sin(t*.48+c.id);
  }
  // A scripted transit path through the existing cow passage to the barn exit.
  if(transfer==='departing'||transfer==='returning'){
   transferProgress=Math.min(1,transferProgress+d/21);
   for(const [i,item] of herd.entries()){
    const phase=Math.max(0,Math.min(1,(transferProgress-i*.1)/.8));
    const q=transfer==='returning'?1-phase:phase;
    const route=item.route,part=q*(route.length-1),j=Math.min(route.length-2,Math.floor(part)),f=part-j;
    const a=route[j],b=route[j+1];
    const x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f;
    item.cow.root.position.set(x,.12,z);
    const angle=Math.atan2(-(b.z-a.z),b.x-a.x);
    item.cow.root.rotation.y=angle;
    for(const [li,leg] of item.cow.legs.entries())leg.rotation.z=.20*Math.sin(t*4.1+li*Math.PI);
    item.cow.root.visible=q<.99;
   }
   if(transferProgress>=1){
    transfer=transfer==='departing'?'parlor-ready':'returned';
    for(const item of herd){item.cow.root.visible=transfer==='returned';if(transfer==='returned'){item.cow.root.position.set(item.cow.base.x,.12,item.cow.base.z)}}
    if(transfer==='returned')transfer='idle';
   }
  }else if(transfer==='parlor-ready')for(const item of herd)item.cow.root.visible=false;
  // Simulated indices are intentionally dimensionless and non-diagnostic.
  monitorAccum+=d;
  if(monitorAccum>=3.0){
   monitorAccum=0;sampleIndex++;
   for(const c of cowInfo){
    const m=monitors.get(c.id),rest=c.behavior.includes('lying'),eat=c.behavior==='feeding';
    m.activity=Math.max(0,Math.min(100,Math.round((rest?20:eat?46:63)+13*Math.sin(sampleIndex*.31+c.id*.37))));
    m.rumination=Math.max(0,Math.min(100,Math.round((rest?64:eat?43:34)+9*Math.sin(sampleIndex*.23+c.id*.20))));
    m.history.push({sample:sampleIndex,activity:m.activity,rumination:m.rumination});
    if(m.history.length>24)m.history.shift();
   }
  }
  feedPusher.consume?.(d,6);
 }
 function state(){
  const f=feedPusher.status;
  return {lighting,headlock,headlockCount:headlock?lockIndicators.length:0,
   obstruction:obstacle,transfer,transferProgress,transitCows:herd.length,
   rationPercent:f.remaining===undefined?100:Math.round(f.remaining*100),
   sensor:sensor()};
 }
 setLighting('day');
 return {cycleLighting,setLighting,toggleHeadlocks,toggleObstacle,startTransfer,returnHerd,pickCow,update,state};
}
