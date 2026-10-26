// DAIRY 24HR P0.5.3 — corrected mobile D-pad world direction.
import {directionVelocity,safeTimeStep} from './controls.mjs';
import {installWorkingParlor} from './working-parlor.mjs';
// Original low-poly scene; does not depend on Fab24hr source or DairyLife 360.
const $=id=>document.getElementById(id);
const mobile=matchMedia('(max-width:700px)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let THREE;
for(const url of ['https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js','https://unpkg.com/three@0.160.1/build/three.module.js']){
 try{THREE=await import(url);break}catch(e){console.warn('3D library unavailable',url,e)}
}
if(!THREE){$('err').style.display='grid';throw new Error('Three.js network load failed')}
const canvas=$('view');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,powerPreference:'high-performance'})}
catch(e){$('err').style.display='grid';throw e}
// P0.5.1 mobile GPU stability
renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.15:1.85));
renderer.shadowMap.enabled=!mobile;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.28;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#b5d5da');
scene.fog=new THREE.Fog('#b5d5da',31,78);
const camera=new THREE.PerspectiveCamera(mobile?51:43,1,.15,180);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();console.warn('3D context lost');$('err').style.display='grid';$('err').querySelector('h2').textContent='3D 畫面暫時中斷';$('err').querySelector('p').textContent='可能是手機繪圖資源不足；請重新整理後再試，如仍發生可回報手機型號。';});
canvas.addEventListener('webglcontextrestored',()=>{$('err').style.display='none';resize()});
const hemi=new THREE.HemisphereLight(0xf1faff,0x698577,2.25);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe7c4,2.5);
sun.position.set(-10,19,9);sun.castShadow=true;
sun.shadow.mapSize.set(mobile?512:1024,mobile?512:1024);
Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:.5,far:68});
sun.shadow.bias=-.00028;sun.shadow.normalBias=.028;scene.add(sun);
const cache=new Map(),cube=new THREE.BoxGeometry(1,1,1);
function M(color,metal=0,rough=.85){
 const k=color+'|'+metal+'|'+rough;
 if(!cache.has(k))cache.set(k,new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,flatShading:true}));
 return cache.get(k)
}
const C={
 ivory:M('#eee9d8'),white:M('#f2f0e6'),spot:M('#21282c'),nose:M('#d9a69b'),
 skin:M('#dcb08c'),eyes:M('#1f262d'),shirt:M('#3678a5'),hat:M('#316a94'),
 navy:M('#304c68'),boot:M('#28363c'),pink:M('#bb6680'),hair:M('#332b2b'),
 steel:M('#a8c0c4',.56,.34),silvery:M('#d6dfe0',.62,.28),darkSteel:M('#668994',.56,.35),
 blue:M('#4b9ec7',.18,.44),floor:M('#b1c4ba'),tile:M('#c7cebf'),
 red:M('#c25548'),yellow:M('#e6bc48'),green:M('#61a17b'),grass:M('#84ab7d'),brown:M('#b89368')
};
const glow=new THREE.MeshBasicMaterial({color:0xfff3c6});
function box(g,x,y,z,w,h,d,m,sh=true){
 const o=new THREE.Mesh(cube,m);o.position.set(x,y,z);o.scale.set(w,h,d);
 o.castShadow=sh&&(!mobile||w*h*d>.30);o.receiveShadow=true;g.add(o);return o
}
function cyl(g,x,y,z,rt,rb,h,m,n=12){
 const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),m);
 o.position.set(x,y,z);o.castShadow=!mobile||rt*rt*h>.045;o.receiveShadow=true;g.add(o);return o
}
function ball(g,x,y,z,sx,sy,sz,m,n=10){
 const o=new THREE.Mesh(new THREE.SphereGeometry(1,n,7),m);
 o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=!mobile||sx*sy*sz>.10;o.receiveShadow=true;g.add(o);return o
}
function tube(g,pts,m,r=.034){
 const path=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)));
 const o=new THREE.Mesh(new THREE.TubeGeometry(path,16,r,6,false),m);o.castShadow=false;g.add(o);return o
}
function canvasTex(fn,w=256,h=128){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');fn(g,w,h);
 const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
 tx.magFilter=THREE.NearestFilter;tx.minFilter=THREE.NearestFilter;return tx
}
function sign(g,s,x,y,z,width=1.6,sub=''){
 const tex=canvasTex((q,w,h)=>{
  q.fillStyle='#183d45';q.fillRect(0,0,w,h);
  q.strokeStyle='#d8c27c';q.lineWidth=5;q.strokeRect(3,3,w-6,h-6);
  q.textAlign='center';q.fillStyle='#fff1d8';
  q.font='bold 37px sans-serif';q.fillText(s,w/2,72);
  if(sub){q.fillStyle='#a9d3d3';q.font='21px sans-serif';q.fillText(sub,w/2,103)}
 });
 const p=new THREE.Mesh(new THREE.PlaneGeometry(width,width*.5),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
 p.position.set(x,y,z);g.add(p);return p
}
function spot(g,z,coords){
 const sh=new THREE.Shape();
 sh.moveTo(coords[0][0],coords[0][1]);
 for(let i=1;i<coords.length;i++)sh.lineTo(coords[i][0],coords[i][1]);
 sh.closePath();
 const geo=new THREE.ShapeGeometry(sh);
 const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:'#242b2e',roughness:.94,side:THREE.DoubleSide}));
 m.position.z=z;g.add(m)
}
const farm=new THREE.Group();scene.add(farm);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),C.grass);
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const floorT=canvasTex((q,w,h)=>{
 q.fillStyle='#b7c4ba';q.fillRect(0,0,w,h);q.strokeStyle='#a3b0a6';q.lineWidth=2;
 for(let i=0;i<=w;i+=32){q.beginPath();q.moveTo(i,0);q.lineTo(i,h);q.stroke();q.beginPath();q.moveTo(0,i);q.lineTo(w,i);q.stroke()}
 for(let i=0;i<110;i++){q.fillStyle=i%3?'#cbd5c9':'#a6bcb0';q.fillRect((i*67)%w,(i*101)%h,i%4+2,i%3+1)}
},256,256);
floorT.wrapS=floorT.wrapT=THREE.RepeatWrapping;floorT.repeat.set(6,9);
floorT.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
const tileFloor=new THREE.Mesh(new THREE.PlaneGeometry(20,26),new THREE.MeshStandardMaterial({map:floorT,roughness:.92}));
tileFloor.rotation.x=-Math.PI/2;tileFloor.position.y=.027;tileFloor.receiveShadow=true;farm.add(tileFloor);
const outerGround=new THREE.Mesh(new THREE.PlaneGeometry(120,120),M('#93b18a'));outerGround.rotation.x=-Math.PI/2;outerGround.position.y=-.39;outerGround.receiveShadow=false;scene.add(outerGround);
box(farm,0,-.18,0,20,.36,26,M('#939f9d'),false);
// A realistic open-sided double-row milking parlor: two raised cow platforms and a central lower operators' pit.
for(const side of [-1,1]){
 box(farm,side*5.8,.17,0,7.7,.30,22,M('#c1c8ba'),false);
 box(farm,side*2.0,.35,0,.17,.14,21.6,C.darkSteel,false);
 for(const x of [side*9.65]){
  box(farm,x,.56,0,.19,1.14,23,C.tile);
  for(let z=-10;z<=10;z+=4)box(farm,x,2.03,z,.2,3.9,.21,C.steel)
 }
}
box(farm,0,.05,0,3.88,.045,21.6,M('#b2beb5'),false);
// Narrow drain along the center walkway
box(farm,0,.082,0,.78,.012,20.7,C.darkSteel,false);
for(let z=-10;z<=10;z+=.30)box(farm,0,.093,z,.76,.013,.043,C.silvery,false);
// Front and back lintels, no opaque roof (camera can orbit without occlusion).
for(const z of [-10.9,10.9])box(farm,0,3.95,z,19.1,.20,.23,C.steel);
for(const x of [-9.55,9.55])box(farm,x,4.02,0,.20,.17,22.5,C.steel);
for(const z of [-8,-2,4,9]){
 box(farm,0,3.84,z,3.9,.13,.20,C.silvery);
 box(farm,0,3.74,z,2.45,.09,.42,glow,false);
 if(!mobile || z===-2 || z===4){const light=new THREE.PointLight(0xffedc3,mobile?.48:.8,7.5,2);
 light.position.set(0,3.6,z);farm.add(light)}
}
for(const side of [-1,1]){
 box(farm,side*2.72,3.22,0,.10,.10,21.3,C.blue,false);
 for(let z=-9;z<=9;z+=3){
  box(farm,side*2.72,2.3,z,.09,1.65,.09,C.steel);
  cyl(farm,side*2.72,1.43,z,.13,.13,.20,C.darkSteel,8)
 }
}
// Rural surroundings visible when orbiting
for(const [x,z,h] of [[-16,-19,7],[-12.4,-19.2,6.4],[14,-19,8]]){
 cyl(scene,x,h/2,z,1.35,1.35,h,C.darkSteel,12);
 cyl(scene,x,h+.12,z,1.48,1.48,.2,C.silvery,12)
}
box(scene,-17,.65,15,7.8,1.1,3.4,C.brown);
box(scene,15,.76,-8,6,1.4,8,M('#d2c8a5'));
// Milking claw & hose assembly at every stall.
// Structural rails are kept; all machine units come from one consistent model.
function milkStation(side,z,i){
 const end=z+1.10;
 box(farm,side*4.05,1.25,end,3.2,.08,.085,C.steel);
 box(farm,side*4.9,.53,end,.11,1.0,.1,C.steel);
 box(farm,side*6.2,1.22,end,.14,1.8,.13,C.steel);
 if(i===2)sign(farm,side<0?'榨乳區 A':'榨乳區 B',side*5.1,3.45,end+.22,1.95,'MILKING')
}
for(const side of [-1,1])for(let i=0;i<5;i++)milkStation(side,-7.7+i*3.5,i);
// Cows: large Holstein with visible face, ears, nose, udder, legs and spotted flanks.
const cattle=[];
function cowMesh(number){
 const g=new THREE.Group();
 const legs=[];
 for(const x of [-.76,.86])for(const z of [-.40,.40]){
  const leg=new THREE.Group();leg.position.set(x,.76,z);
  box(leg,0,-.28,0,.29,.6,.30,C.ivory);
  box(leg,.03,-.61,0,.35,.17,.34,C.darkSteel);
  g.add(leg);legs.push(leg)
 }
 // torso and shoulders
 box(g,0,1.55,0,2.54,1.36,1.32,C.ivory);
 ball(g,-.40,1.45,0,.95,.61,.60,C.white,10);
 box(g,1.02,1.52,0,.61,1.14,1.02,C.ivory);
 // Holstein pattern applied to both physical sides of torso
 const patches=[
  [[-.98,2.11],[-.42,2.17],[-.07,1.89],[-.33,1.42],[-.75,1.35],[-1.06,1.66]],
  [[.36,2.15],[.83,2.18],[1.08,1.78],[.80,1.46],[.52,1.56]],
  [[-.57,1.20],[-.26,1.16],[.03,1.34],[-.19,1.53],[-.53,1.49]]
 ];
 for(const z of [-.674,.674])for(const points of patches)spot(g,z,points);
 // black back patches / spotted near shoulder
 box(g,-.45,2.247,-.12,.6,.045,.64,C.spot);
 // Keep the original head geometry; introduce a pivot for subtle cow gestures.
 const headPivot=new THREE.Group();headPivot.position.set(.95,1.63,0);
 const head=new THREE.Group();head.position.set(-.95,-1.63,0);
 headPivot.add(head);g.add(headPivot);
 // face looking outward along +X
 box(head,1.42,1.64,0,.64,.71,.70,C.white);
 ball(head,1.80,1.43,0,.38,.25,.38,C.nose,9);
 for(const z of [-.235,.235]){
  ball(head,1.875,1.48,z,.033,.035,.029,C.darkSteel,8);
  box(head,1.48,1.88,z>.0?.352:-.352,.24,.18,.24,C.ivory);
  ball(head,1.765,1.78,z>.0?.275:-.275,.055,.056,.025,C.spot,9);
 }
 // large ears and bright ear tags
 for(const side of [-1,1]){
  const ear=box(head,1.48,1.93,side*.51,.36,.18,.4,C.ivory);ear.rotation.x=side*.22;
  box(head,1.50,1.96,side*.738,.14,.17,.055,C.yellow,false)
 }
 // All udder and teat geometry comes from the ten-stall working-parlor model.
 const tail=new THREE.Group();tail.position.set(-1.33,1.74,0);
 box(tail,-.15,-.25,0,.13,.56,.14,C.white);
 box(tail,-.18,-.54,0,.17,.22,.18,C.spot);
 g.add(tail);
 const tag=sign(g,String(number),.0,2.45,.0,1.02,'HOLSTEIN');tag.visible=false;
 return {group:g,tail,legs,tag,head:headPivot}
}
for(const side of [-1,1])for(let i=0;i<5;i++){
 const c=cowMesh(1241+i+((side+1)/2)*10);
 c.group.position.set(side*5.35,.38,-7.65+i*3.5);
 c.group.rotation.y=side<0?Math.PI:0;
 scene.add(c.group);
 cattle.push(c)
}
// Distinctive exterior tractor and feed cart visible in the distance.
function vehicle(x,z){
 const v=new THREE.Group();v.position.set(x,0,z);
 box(v,0,.81,0,2.7,1.1,1.5,C.red);
 box(v,.8,1.62,0,1.05,1.05,1.38,C.blue);
 box(v,.80,1.79,-.71,.87,.60,.05,C.darkSteel,false);
 for(const xx of [-.95,1.0])for(const zz of [-.66,.66]){
  const wheel=cyl(v,xx,.52,zz,.45,.45,.25,C.darkSteel,14);wheel.rotation.x=Math.PI/2;
  cyl(v,xx,.52,zz+Math.sign(zz)*.15,.21,.21,.04,C.steel,10).rotation.x=Math.PI/2
 }
 scene.add(v)
}
vehicle(-14,10);
// Person: articulated arms / legs and detailed face and uniform.
function person(name,color,x,z,withCap=true){
 const root=new THREE.Group();root.position.set(x,0,z);
 const torso=new THREE.Group();torso.position.y=.91;root.add(torso);
 box(torso,0,.26,0,.72,.86,.39,color);
 box(torso,0,.22,-.23,.51,.59,.05,C.navy);
 const straps=withCap?C.yellow:C.ivory;
 for(const xx of [-.25,.25])box(torso,xx,.42,-.265,.11,.55,.036,straps,false);
 const limbs={};
 for(const [label,xx] of [['left',-.23],['right',.23]]){
  const leg=new THREE.Group();leg.position.set(xx,.83,0);
  box(leg,0,-.25,0,.23,.57,.28,C.navy);
  box(leg,0,-.61,-.06,.30,.24,.38,C.boot);
  root.add(leg);limbs[label+'Leg']=leg
 }
 for(const [label,xx] of [['left',-.48],['right',.48]]){
  const arm=new THREE.Group();arm.position.set(xx,1.56,0);
  box(arm,0,-.26,0,.23,.55,.26,color);
  box(arm,0,-.59,0,.21,.21,.23,C.skin);
  root.add(arm);limbs[label+'Arm']=arm
 }
 box(root,0,1.91,0,.53,.51,.48,C.skin);
 box(root,0,2.21,.06,.55,.13,.48,C.hair);
 if(withCap){box(root,0,2.27,0,.67,.17,.64,name==='美玲姐'?C.pink:C.hat);box(root,0,2.23,-.38,.72,.075,.22,name==='美玲姐'?C.pink:C.hat)}
 for(const xx of [-.14,.14]){
  box(root,xx,1.95,-.254,.072,.072,.032,C.eyes,false)
 }
 box(root,0,1.81,-.258,.11,.035,.021,M('#9e6c55'),false);
 if(name==='美玲姐'){box(root,0,1.86,.34,.34,.58,.19,C.hair)}
 scene.add(root);
 return {root,limbs,name}
}
const player=person('你',C.shirt,0,7.2,true);
const meiling=person('美玲姐',C.pink,-.78,-2.75,true);
meiling.root.rotation.y=1.18;
const worker=person('阿力',M('#5b9b76'),1.05,-7.0,true);
worker.root.rotation.y=.5;
// P0.5.5: ten detailed clusters, progressive tasks and natural workplace motion.
// P0.5.3 movement, camera and input handling remain byte-identical.
const parlor=installWorkingParlor({THREE,farm,cattle,meiling,worker,mobile});
let workStatusLast=-3;
// Help station visuals & interactive surfaces
const consoleX=1.62,consoleZ=-4.2;
box(farm,consoleX,1.48,consoleZ,.58,1.72,.5,C.steel);
box(farm,consoleX,2.0,consoleZ-.29,.48,.55,.06,C.darkSteel);
box(farm,consoleX,2.04,consoleZ-.327,.36,.31,.015,new THREE.MeshBasicMaterial({color:0x62bad0}),false);
for(const zz of [-4.37,-4.21,-4.05])ball(farm,consoleX-.14,1.64,zz,.055,.045,.055,C.yellow,7);
sign(farm,'乳牛榨乳室',0,3.23,-10.8,3.8,'M I L K I N G   P A R L O R');
// Incident-free everyday exploration, each station is optional
const stations=[
 {id:'mei',name:'美玲姐',x:-.78,z:-2.75,r:1.35,read:['你來得剛好，紙巾在旁邊架上。先別站牛後面啦。','這排還算乖。等我這頭弄好，你幫我拿一下東西。','欸，地有點濕，走慢一點啦。'],btns:['問問今天忙不忙','幫忙看一頭']},

 {id:'machine',name:'榨乳設備',x:-1.65,z:-7.3,r:1.75,read:['旁邊的管線正在運作，乳杯和管線都有固定位置。','機器聲有節奏，站在旁邊能看清楚每組乳杯。'],btns:['看看乳杯和軟管','詢問美玲姐']},
 {id:'console',name:'設備顯示器',x:1.6,z:-4.2,r:1.75,read:['目前面板是一般運轉狀態。單看這個數值沒有辦法判斷整個榨乳品質。','畫面顯示正在運轉，其他資料要另外翻當班紀錄。'],btns:['看看面板','轉頭看牛群']},
 {id:'drain',name:'走道與排水',x:.0,z:3.2,r:2.45,read:['走道中央有排水溝，地板潮濕，走起來要注意。','早班有人剛沖過地板，現在清潔工具已經收起來了。'],btns:['看看地面','繼續往前走']},
 {id:'worker',name:'阿力',x:1.05,z:-7.0,r:1.8,read:['後面那排我顧啦。你如果要看，記得不要站在牛要走的地方。','等這排弄好，我再去推一下料。今天早上還算順。'],btns:['聊兩句','看看這排牛']}
];
// Observations are optional. There is no scripted abnormality or diagnosis.
for(let i=0;i<cattle.length;i++){
 const side=i<5?-1:1;
 const number=1241+(i%5)+(side===1?10:0);
 const z=cattle[i].group.position.z;
 stations.push({id:'cow-'+number,name:number+' 號牛',cowIndex:i,
   x:side*1.69,z,r:1.35,
   read:[
     '牠就這頭啦，旁邊看就好，別跟牠擠在一起。',
     '乳杯、集乳座跟管線就在這邊，你自己看一下。',
     '今天就照平常做啊。要是有看到什麼再記。'
   ],
   btns:['看看牛位','先去忙別的']
 });
}
const observed=new Set(),tip=$('toast'),prompt=$('prompt'),act=$('act');
let toastTimer=0,near=null,dialogOpen=false,started=false;
function sayToast(t){tip.textContent=t;tip.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>tip.classList.remove('show'),2450)}
function closeDialog(){$('dialog').style.display='none';dialogOpen=false}
function showDialog(who,words,buttons){
 dialogOpen=true;
 $('who').textContent=who;$('line').textContent=words;
 const actions=$('dialogActions');actions.replaceChildren();
 for(const b of buttons){
  const btn=document.createElement('button');btn.textContent=b.title;
  if(b.primary)btn.classList.add('primary');
  btn.onclick=()=>{closeDialog();b.run&&b.run()};
  actions.appendChild(btn)
 }
 $('dialog').style.display='block'
}
function inspect(st,what){
 observed.add(st.id);
 if(what==='help'){
  sayToast('美玲姐：可以啊，你先在旁邊看我做一次。');
  showDialog('美玲姐','那個先不用碰啦，我做給你看。等你熟一點再幫忙。',[
   {title:'好，我看著',primary:true,run:()=>sayToast('你看了一輪。美玲姐：好啦，慢慢來。')}
  ]);return
 }
 if(st.id==='machine'){
  sayToast('看清楚乳杯、短乳管與上方管線的位置。');
 }else if(st.id.startsWith('cow-'))sayToast(st.name+'｜'+parlor.getStage(st.cowIndex)+'。先看現場，不急著下結論。');
 else if(st.id==='console')sayToast('目前一般運轉中，沒有跳出警示。');
 else if(st.id==='drain')sayToast('你留意到走道比較濕，經過時慢慢走。');
 else if(st.id==='mei')sayToast('美玲姐：你先看看，等一下有空再找我。');
 else sayToast('阿力：那排正在做，你先看就好。');
 $('instruction').querySelector('p').textContent='剛剛看過 '+observed.size+' 個地方。沒有一定要找出異常，照自己的步調走就好。'
}
function talk(st){
 const n=st.read[Math.floor(Math.random()*st.read.length)];
 const buttons=st.btns.map((txt,i)=>({title:txt,primary:i===0,run:()=>{
  if(st.id==='mei'&&i===1)inspect(st,'help');
  else if(st.id==='worker'&&i===0){observed.add(st.id);sayToast('阿力：嗯，差不多就這樣。你去看別的啦。')}
  else inspect(st,'look')
 }}));
 buttons.push({title:'先去別的地方'});
 showDialog(st.name,n,buttons)
}
function updateNear(){
 if(!started||dialogOpen){act.disabled=true;prompt.style.display='none';return}
 let best=null,bestD=999;
 for(const s of stations){
  const d=Math.hypot(player.root.position.x-s.x,player.root.position.z-s.z);
  if(d<bestD&&d<s.r){best=s;bestD=d}
 }
 near=best;
 act.disabled=!best;
 act.textContent=best?'✦ '+best.name:'靠近再互動';
 prompt.textContent=best?'按 E 或右下角按鈕 · '+best.name:'';
 prompt.style.display=best?'block':'none'
}
function interact(){
 if(dialogOpen){closeDialog();return}
 if(near)talk(near);
 else sayToast('走近人物、乳牛或設備，再試試看。')
}
act.onclick=interact;$('pad').querySelector('[data-k=interact]').addEventListener('click',interact);
$('begin').onclick=()=>{started=true;$('start').style.display='none';sayToast('美玲姐在裡面，靠近後就能聊聊。')};
const keys={up:false,down:false,left:false,right:false};
function dirFromCode(code){
 return {KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'}[code]
}
addEventListener('keydown',e=>{
 if(e.target?.tagName==='INPUT'||e.target?.tagName==='TEXTAREA')return;
 const d=dirFromCode(e.code);
 if(d){e.preventDefault();keys[d]=true;recordMove('鍵盤 '+d);return}
 if(e.code==='KeyE'||e.code==='Space'){if(!e.repeat){e.preventDefault();interact()}}
 if(e.code==='KeyQ')orbit.yaw-=.17;
 if(e.code==='KeyR')orbit.yaw+=.17;
 if(e.code==='Escape')closeDialog()
});
addEventListener('keyup',e=>{const d=dirFromCode(e.code);if(d){e.preventDefault();keys[d]=false}});
function releaseKeys(){Object.keys(keys).forEach(k=>keys[k]=false);document.querySelectorAll('#pad button.active').forEach(b=>b.classList.remove('active'))}
addEventListener('blur',releaseKeys);
document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseKeys()});
const padPointers=new Map();
for(const b of document.querySelectorAll('#pad button[data-k]')){
 const d=b.dataset.k;if(d==='interact')continue;
 const stop=e=>{if(e && padPointers.get(e.pointerId)!==d)return;if(e)padPointers.delete(e.pointerId);keys[d]=false;b.classList.remove('active')};
 b.addEventListener('pointerdown',e=>{if(!started||dialogOpen)return;e.preventDefault();padPointers.set(e.pointerId,d);keys[d]=true;recordMove('方向鍵 '+d);b.classList.add('active');try{b.setPointerCapture(e.pointerId)}catch(_){}});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,stop);
 b.addEventListener('contextmenu',e=>e.preventDefault());
}
for(const ev of ['pointerup','pointercancel'])document.addEventListener(ev,e=>{const d=padPointers.get(e.pointerId);if(d){padPointers.delete(e.pointerId);keys[d]=false;document.querySelector('#pad button[data-k="'+d+'"]')?.classList.remove('active')}});
const orbit={yaw:.72,pitch:.72,dist:mobile?11.2:13.5},target=new THREE.Vector3(),eye=new THREE.Vector3(),smoothEye=new THREE.Vector3(),vel=new THREE.Vector2();
const lastValidPosition=player.root.position.clone();
let moveSource='待機',lastInputUpdate=performance.now();
const debugEl=$('debugMove');let debugVisible=false;
$('debugBtn').onclick=()=>{debugVisible=!debugVisible;debugEl.hidden=!debugVisible};
function recordMove(source){moveSource=source;lastInputUpdate=performance.now()}
function tickDebug(){
 if(!debugVisible)return;
 const p=player.root.position;
 debugEl.textContent='角色 X/Z: '+p.x.toFixed(2)+' / '+p.z.toFixed(2)+'\n鏡頭 X/Z: '+target.x.toFixed(2)+' / '+target.z.toFixed(2)+'\n操作: '+moveSource+'\n方向: '+(Object.entries(keys).filter(([,v])=>v).map(([k])=>k).join(',')||'-');
}
$('resetCam').onclick=()=>{orbit.yaw=.72;orbit.pitch=.72;orbit.dist=mobile?11.2:13.5;targetPoint=null;vel.set(0,0);releaseKeys();sayToast('鏡頭已回正')};
let targetPoint=null,holdMap=new Map(),dragging=false,down=null,pinchDistance=0,time=0;
function resize(){
 const w=canvas.clientWidth,h=canvas.clientHeight;
 if(!w||!h)return;
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()
}
addEventListener('resize',resize);
resize();
$('turnL').onclick=()=>orbit.yaw-=Math.PI/5;
$('turnR').onclick=()=>orbit.yaw+=Math.PI/5;
$('zoomIn').onclick=()=>orbit.dist=clamp(orbit.dist-1.5,6.7,19);
$('zoomOut').onclick=()=>orbit.dist=clamp(orbit.dist+1.5,6.7,19);
const ray=new THREE.Raycaster(),screen=new THREE.Vector2(),floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.05);
canvas.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 holdMap.set(e.pointerId,{x:e.clientX,y:e.clientY});
 try{canvas.setPointerCapture(e.pointerId)}catch(_){}
 if(holdMap.size===1){down={x:e.clientX,y:e.clientY};dragging=false}
 else{const a=[...holdMap.values()];pinchDistance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);dragging=true}
});
canvas.addEventListener('pointermove',e=>{
 const p=holdMap.get(e.pointerId);if(!p)return;
 const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(holdMap.size===1){
  if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)dragging=true;
  if(dragging){orbit.yaw-=dx*.009;orbit.pitch=clamp(orbit.pitch+dy*.005,.48,1.18)}
 }else if(holdMap.size===2){
  const a=[...holdMap.values()],distance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
  if(pinchDistance)orbit.dist=clamp(orbit.dist*pinchDistance/distance,6.7,19);
  pinchDistance=distance
 }
});
function ptrEnd(e){
 if(!holdMap.has(e.pointerId))return;
 const tapped=!dragging&&e.type==='pointerup'&&started&&!dialogOpen;
 holdMap.delete(e.pointerId);if(holdMap.size<2)pinchDistance=0;
 if(!tapped)return;
 const rect=canvas.getBoundingClientRect();
 screen.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 ray.setFromCamera(screen,camera);
 const pt=new THREE.Vector3();
 if(ray.ray.intersectPlane(floorPlane,pt)){
  targetPoint=new THREE.Vector2(clamp(pt.x,-1.78,1.78),clamp(pt.z,-9.65,9.7));
  recordMove('點擊地面');sayToast('走過去看看')
 }
}
canvas.addEventListener('pointerup',ptrEnd);canvas.addEventListener('pointercancel',ptrEnd);
canvas.addEventListener('wheel',e=>{e.preventDefault();orbit.dist=clamp(orbit.dist*(1+Math.sign(e.deltaY)*.075),6.7,19)},{passive:false});
function playerMove(dt){
 const pad=directionVelocity(keys,orbit.yaw,3.2);
 const move=new THREE.Vector2();
 if(pad){
  // Shared, unit-tested math: no nonexistent orbit.y field.
  targetPoint=null;move.set(pad.x,pad.z);
 }else if(targetPoint){
  move.copy(targetPoint).sub(new THREE.Vector2(player.root.position.x,player.root.position.z));
  if(move.length()<.18){targetPoint=null;move.set(0,0)}
  else move.normalize().multiplyScalar(3.0)
 }
 const step=safeTimeStep(dt);
 const alpha=1-Math.exp(-step*13);
 // A broken external value must stop motion; it must never poison position.
 if(!Number.isFinite(move.x)||!Number.isFinite(move.y)){move.set(0,0);recordMove('速度輸入異常')}
 if(!Number.isFinite(vel.x)||!Number.isFinite(vel.y))vel.set(0,0);
 vel.lerp(move,alpha);
 if(!Number.isFinite(vel.x)||!Number.isFinite(vel.y))vel.set(0,0);
 const oldX=player.root.position.x,oldZ=player.root.position.z;
 const nx=oldX+vel.x*step,nz=oldZ+vel.y*step;
 player.root.position.x=Number.isFinite(nx)?clamp(nx,-1.82,1.82):oldX;
 player.root.position.z=Number.isFinite(nz)?clamp(nz,-9.7,9.75):oldZ;
 if(Math.abs(oldX-player.root.position.x)<.001)vel.x=0;
 if(Math.abs(oldZ-player.root.position.z)<.001)vel.y=0;
 const moving=vel.length()>.20;
 if(moving){
  const direction=Math.atan2(-vel.x,-vel.y);
  let delta=direction-player.root.rotation.y;delta=Math.atan2(Math.sin(delta),Math.cos(delta));
  player.root.rotation.y+=delta*Math.min(1,dt*11)
 }
 const swing=moving?Math.sin(time*11)*.46:Math.sin(time*1.3)*.018;
 player.limbs.leftLeg.rotation.x=swing;player.limbs.rightLeg.rotation.x=-swing;
 player.limbs.leftArm.rotation.x=-swing*.7;player.limbs.rightArm.rotation.x=swing*.7;
 meiling.limbs.rightArm.rotation.x=Math.sin(time*1.3)*.11;
 worker.limbs.leftArm.rotation.x=Math.sin(time*1.1)*.07;
 for(let i=0;i<cattle.length;i++){
  const c=cattle[i];c.tail.rotation.x=Math.sin(time*2.2+i*1.37)*.22;
  c.group.position.y=.38+Math.sin(time*1.4+i)*.009;
 }
}
const clock=new THREE.Clock();
function tick(){
 const dt=safeTimeStep(clock.getDelta());time+=dt;
 if(started&&!dialogOpen)playerMove(dt);
 if(started){
   parlor.animate(time);
   if(time-workStatusLast>1.4){
     workStatusLast=time;
     const state=parlor.outputs;
     $('workStatus').textContent='10 牛位｜榨乳 '+state.milking+'・準備 '+state.preparing+'・完成 '+state.finished;
   }
 }
 const p=player.root.position;
 if(!Number.isFinite(p.x)||!Number.isFinite(p.z)){
   p.copy(lastValidPosition);vel.set(0,0);targetPoint=null;releaseKeys();
   recordMove('座標異常，保留位置');sayToast('移動資料異常，已留在原位置');
 }else lastValidPosition.copy(p);
 // Follow the player for both touch-pad and tap-to-walk. Never clamp the camera
 // to a smaller box or reset the player to the spawn point when input changes.
 const t=new THREE.Vector3(p.x,1.42,p.z-.65);
 target.lerp(t,1-Math.exp(-dt*7));
 const hz=Math.cos(orbit.pitch)*orbit.dist;
 eye.set(target.x+Math.sin(orbit.yaw)*hz,target.y+Math.sin(orbit.pitch)*orbit.dist,target.z+Math.cos(orbit.yaw)*hz);
 smoothEye.lerp(eye,1-Math.exp(-dt*9));
 camera.position.copy(smoothEye);camera.lookAt(target);
 updateNear();tickDebug();renderer.render(scene,camera)
}
target.set(player.root.position.x,1.42,player.root.position.z-.65);
smoothEye.set(target.x+Math.sin(orbit.yaw)*orbit.dist*.8,target.y+orbit.dist*.7,target.z+Math.cos(orbit.yaw)*orbit.dist*.8);
renderer.setAnimationLoop(tick);
