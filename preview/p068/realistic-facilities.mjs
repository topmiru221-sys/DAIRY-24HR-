// DAIRY 24HR P0.6.1 — research-led dairy facility interiors.
import {buildExpandedLactatingBarn} from './lactating-barn.mjs';
import {createTransitionBarns,TRANSITION_BARN_POINTS} from './transition-barns.mjs';
// Layout families: lactating freestall, dry/transition bedded pack,
// calf pens, growing heifer groups, feed center, silage bunkers,
// independent treatment room, manure works, agricultural workshop.
// REFERENCES and limitations: see REAL_FARM_REFERENCES.md.
// Geometry/game proportions are NOT precise engineering dimensions.
export const FACILITY_IDS=Object.freeze(['lactating','dry','closeup','fresh','calf','heifer','feed','silage','veterinary','manure','machinery']);
export const FACILITY_LABELS=Object.freeze({
 lactating:'TMR 採食、推料安全、LED 照明、牛群動線與監測展示',dry:'乾乳牛分群＋深墊料區',closeup:'Close-up 預產群＋獨立產房',fresh:'Fresh 產後觀察群＋採食區',
 calf:'個別犢牛欄＋中央服務通道',heifer:'育成牛分齡群欄＋採食前緣',feed:'原料分格儲區＋TMR 攪拌車',
 silage:'開放式青貯窖＋乾草儲棚',veterinary:'隔離欄＋處置保定通道',manure:'固液分離＋安全圍欄處理池',machinery:'曳引機維修工位＋工具倉'
});
export const REAL_WORLD_SOURCES=Object.freeze({
 lactating:'https://thedairylandinitiative.vetmed.wisc.edu/adult-cow-housing/stall-layout/',
 dry:'https://extension.psu.edu/pre-fresh-maternity-and-post-fresh-space-getting-the-numbers-right',
 closeup:'https://extension.psu.edu/pre-fresh-maternity-and-post-fresh-space-getting-the-numbers-right',
 fresh:'https://extension.psu.edu/pre-fresh-maternity-and-post-fresh-space-getting-the-numbers-right',
 calf:'https://dairy.extension.wisc.edu/articles/renovating-tie-stall-barns-for-indoor-calf-housing/',
 heifer:'https://extension.psu.edu/precision-feeding-dairy-heifers-strategies-and-recommendations',
 feed:'https://www.dairyconservation.org/practices/feed-center',
 silage:'https://www.dairyconservation.org/practices/feed-center',
 veterinary:'https://extension.psu.edu/restraint-and-treatment-facilities-for-dairy-animals',
 manure:'https://extension.psu.edu/manure-separation-facilities',
 machinery:'https://farmplanning.ces.ncsu.edu/land-and-water/farm-layout-and-infrastructure/'
});
export function rebuildDairyFacilities({THREE,master,mobile=false}){
 const material=(color,metalness=0,roughness=.76)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const M={
  concrete:material(0xbcc8c3),light:material(0xe7e8df),bedding:material(0xcbae72),sand:material(0xd2c3a1),
  silage:material(0x787c46),feed:material(0x9c865e),hay:material(0xc1a269),
  steel:material(0xa0b2b8,.55,.40),bright:material(0xd9e2df,.61,.29),
  wall:material(0xeeeae0),gray:material(0x6d7779),dark:material(0x2b3740),
  blue:material(0x4887a2),green:material(0x648d71),red:material(0xb96343),yellow:material(0xd4ad51),
  white:material(0xf4f2e8),black:material(0x272c2d),pink:material(0xdaaca4),hoof:material(0x4b4946),
  milk:material(0xf6e9d8),water:material(0x589aaf,.12,.40),
  rubber:material(0x252a2e),cover:material(0x324b46),office:material(0xa17d54),
  lit:new THREE.MeshBasicMaterial({color:0xa0dec4}),off:new THREE.MeshBasicMaterial({color:0x4f6162})
 };
 const bGeo=new THREE.BoxGeometry(1,1,1),sphereGeo=new THREE.SphereGeometry(1,mobile?9:14,mobile?7:10);
 const cylCache=new Map(),animations=new Map(),interactables=[],structureCounts={};
 function sceneGroup(p,x=0,y=0,z=0,name=''){
  const g=new THREE.Group();g.name=name;g.position.set(x,y,z);p.add(g);return g;
 }
 function box(p,x,y,z,w,h,d,m=M.steel){
  const a=new THREE.Mesh(bGeo,m);a.position.set(x,y,z);a.scale.set(w,h,d);
  a.castShadow=!mobile&&w*h*d>.65;p.add(a);return a;
 }
 function cyl(p,x,y,z,ra,rb,h,m=M.bright,segments=mobile?10:16){
  const key=[ra,rb,h,segments].join(':');
  if(!cylCache.has(key))cylCache.set(key,new THREE.CylinderGeometry(ra,rb,h,segments));
  const a=new THREE.Mesh(cylCache.get(key),m);a.position.set(x,y,z);p.add(a);return a;
 }
 function ball(p,x,y,z,w,h,d,m=M.white){
  const a=new THREE.Mesh(sphereGeo,m);a.position.set(x,y,z);a.scale.set(w,h,d);p.add(a);return a;
 }
 function registerAnimation(zone,fn){
  if(!animations.has(zone))animations.set(zone,[]);
  animations.get(zone).push(fn);
 }
 function caption(p,title,sub,x,y,z,w=3.2,rot=0){
  const cv=document.createElement('canvas');cv.width=512;cv.height=150;
  const t=cv.getContext('2d');t.fillStyle='#173742';t.fillRect(0,0,512,150);
  t.strokeStyle='#ddb775';t.lineWidth=6;t.strokeRect(4,4,504,142);
  t.textAlign='center';t.fillStyle='#fff4db';t.font='bold 39px "Noto Sans TC",sans-serif';t.fillText(title,256,68);
  t.fillStyle='#c4e7e2';t.font='25px sans-serif';t.fillText(sub,256,112);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.293),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));
  mesh.position.set(x,y,z);mesh.rotation.y=rot;p.add(mesh);return mesh;
 }
 function tube(p,coords,r=.04,m=M.steel){
  const curve=new THREE.CatmullRomCurve3(coords.map(c=>new THREE.Vector3(...c)));
  const shape=new THREE.Mesh(new THREE.TubeGeometry(curve,mobile?9:20,r,5,false),m);
  p.add(shape);return shape;
 }
 function fence(p,x,z0,z1,{front=true,spacing=.92,height=1.34,post=M.steel}={}){
  const n=Math.max(1,Math.round((z1-z0)/spacing));
  for(let j=0;j<=n;j++){
   const z=z0+(z1-z0)*j/n;
   box(p,x,height/2,z,.065,height,.075,post);
  }
  for(const yy of [height*.3,height*.74])box(p,x,yy,(z0+z1)/2,.095,.085,z1-z0,post);
  if(front)for(let j=0;j<n;j++){
   const zz=z0+(z1-z0)*(j+.5)/n;
   const slant=box(p,x,1.01,zz,.065,.56,.07,post);slant.rotation.x=j%2?.46:-.46;
  }
 }
 function gateAcross(p,z,x0,x1,m=M.steel){
  const g=sceneGroup(p,0,0,0,'gate');
  for(const yy of [.60,1.14])box(g,(x0+x1)/2,yy,z,Math.abs(x1-x0),.075,.075,m);
  for(const xx of [x0,x1])box(g,xx,.85,z,.08,1.4,.08,m);
  return g;
 }
 function overhead(p,{airTube=false,open=true}={}){
  // Open-roof trusses preserve visibility with third-person mobile camera.
  for(const z of [-8.7,-4.4,0,4.4,8.5]){
   for(const x of [-5.9,5.9])box(p,x,2.06,z,.14,3.55,.14,M.steel);
   for(const x of [-4.3,4.3]){
    const beam=box(p,x,3.80,z,4.0,.11,.12,M.steel);
    beam.rotation.z=x<0?.15:-.15;
   }
   box(p,0,4.09,z,3.1,.09,.10,M.steel);
  }
  if(open){
   for(const xx of [-5.85,5.85]){
    for(const z of [-6.5,0,6.5])box(p,xx,1.9,z,.08,1.12,2.3,M.green);
   }
  }
  // Suspended circular fans are unmistakable but non-functional decoration.
  for(const z of [-5.4,3.7]){
   const assembly=sceneGroup(p,0,3.58,z,'Barn roof fan');
   const disk=cyl(assembly,0,0,0,.49,.49,.07,M.dark,14);disk.rotation.x=Math.PI/2;
   for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const blade=box(assembly,Math.cos(angle)*.24,0,Math.sin(angle)*.24,.52,.035,.17,M.bright);
    blade.rotation.y=angle;
   }
  }
  if(airTube){
   tube(p,[[0,3.65,-9],[0,3.65,-5],[0,3.65,0],[0,3.65,5],[0,3.65,9]],.21,M.white);
   for(let z=-8;z<=8;z+=2)for(const x of [-.16,.16])
    cyl(p,x,3.39,z,.045,.045,.08,M.gray,7);
  }
 }
 function addCow(p,x,z,{zone,scale=1,face=1,lying=false,seed=1}={}){
  const root=sceneGroup(p,x,lying?.28:.14,z,'Holstein '+seed);
  root.scale.set(scale,scale,scale);root.rotation.y=face<0?Math.PI:0;
  const core=sceneGroup(root,0,0,0,'Cow core');
  ball(core,0,lying?.65:1.13,0,.90,lying?.40:.58,.44,M.white);
  ball(core,-.30,lying?.76:1.26,-.30,.42,.32,.18,M.black);
  ball(core,.15,lying?.70:1.03,.38,.46,.27,.15,M.black);
  const head=sceneGroup(root,.87,lying?.94:1.46,0,'Cow head pivot');
  ball(head,.18,0,0,.37,.37,.29,M.white);
  ball(head,.43,-.15,0,.25,.17,.24,M.pink);
  for(const side of [-1,1]){
   ball(head,-.10,.23,side*.30,.22,.10,.13,M.white);
   ball(head,.27,.065,side*.25,.045,.048,.034,M.black);
  }
  const udder=lying?null:ball(core,-.12,.62,0,.24,.18,.22,M.pink);
  if(udder)for(const side of [-1,1])for(const dx of [-.105,.11])cyl(core,-.12+dx,.40,side*.12,.043,.048,.20,M.pink,7);
  const legs=[];
  for(const dx of [-.62,.62])for(const dz of [-.31,.31]){
   const limb=sceneGroup(root,dx,lying?.45:.79,dz,'Cow leg');
   box(limb,0,-.29,0,.20,lying?.25:.61,.20,M.white);
   box(limb,.04,lying?-.45:-.56,0,.23,.11,.24,M.hoof);
   legs.push(limb);
  }
  const tail=sceneGroup(root,-.85,lying?.88:1.42,0,'Cow tail');
  box(tail,-.12,-.25,0,.11,.45,.095,M.white);
  box(tail,-.15,-.44,0,.13,.16,.12,M.black);
  registerAnimation(zone,t=>{
   const cycle=t+seed*.83;
   head.rotation.z=.025*Math.sin(cycle*.53);
   tail.rotation.x=.16*Math.sin(cycle*.86);
   for(let i=0;i<legs.length;i++)legs[i].rotation.z=.009*Math.sin(cycle*.5+i);
  });
  return root;
 }
 function water(p,x,z){
  box(p,x,.57,z,.64,.90,1.16,M.steel);
  box(p,x,1.01,z,.58,.08,1.10,M.water);
  box(p,x,.13,z,.80,.08,1.40,M.concrete);
 }
 function strawPad(p,x,z,w=2.35,d=3.25){
  box(p,x,.22,z,w,.28,d,M.bedding);
  for(let i=0;i<4;i++)box(p,x-.64+i*.43,.37,z+.24,.41,.018,.55,M.hay);
 }
 function feedFront(p,side,z0=-8,z1=7.7,{locking=true}={}){
  const x=side*1.98;
  box(p,side*1.34,.26,(z0+z1)/2,1.25,.35,z1-z0,M.concrete);
  box(p,side*1.34,.47,(z0+z1)/2,1.02,.16,z1-z0,M.feed);
  fence(p,x,z0,z1,{front:locking,spacing:1.35});
  return x;
 }
 function freeStalls(p,side){
  const x=side*4.67;
  for(const z of [-7,-4.8,-2.6,-.4,1.8,4.0,6.2]){
   box(p,x,.19,z,2.15,.22,1.88,M.sand);
   // Each free stall has a two-post loop, brisket locator and neck rail.
   for(const zz of [z-.91,z+.91]){
    box(p,side*3.62,.97,zz,.075,1.06,.075,M.steel);
    box(p,side*5.55,.87,zz,.07,.85,.07,M.steel);
    tube(p,[[side*3.62,1.43,zz],[side*4.16,1.52,zz],
            [side*5.06,1.21,zz],[side*5.55,.92,zz]],.038,M.bright);
   }
   box(p,side*5.38,.40,z,.13,.19,1.54,M.concrete);
  }
  box(p,side*3.75,1.48,-.4,.07,.06,15.4,M.steel);
 }
 function floorGrooves(p,x,z){
  for(let i=0;i<8;i++)box(p,x,.055,z-1.0+i*.28,1.55,.012,.026,M.gray);
 }
 function startRoom(id){
  const p=master.interiors.get(id);
  if(!p)throw Error('Facility not found: '+id);
  const g=sceneGroup(p,0,0,0,'Real-farm redesign '+id);
  // Keep entry and central lane collision-free (player x clamped to ±1.82).
  if(!['manure','silage'].includes(id))overhead(g,{airTube:id==='calf',open:true});
  // Taiwan-type open dairy barns commonly mount fans above feed/resting lines.
  // Pipework below represents OFF/available sprinkling hardware, not an
  // automatic soaking schedule or a claim that misting is always suitable.
  if(['lactating','dry','closeup','fresh','heifer'].includes(id)){
   for(const side of [-1,1]){
    const xx=side*2.45;
    tube(g,[[xx,3.08,-8],[xx,3.08,-3],[xx,3.08,3],[xx,3.08,8]],.042,M.blue);
    for(const z of [-6,0,6]){
      cyl(g,xx,2.96,z,.078,.083,.10,M.steel,8);
      const fan=sceneGroup(g,side*4.80,2.96,z,'Cow cooling fan');
      const frame=cyl(fan,0,0,0,.36,.36,.10,M.dark,10);frame.rotation.x=Math.PI/2;
      for(let k=0;k<3;k++){
       const blade=box(fan,0,0,0,.52,.035,.11,M.bright);
       blade.rotation.y=k*(Math.PI*2/3);
      }
    }
   }
  }
  caption(g,FACILITY_LABELS[id],id==='manure'?'安全圍欄區｜不可下池':'依真實牧場配置重建',0,3.05,-9.64,5.0);
  return g;
 }
 function hot(area,id,name,statement,x,z){
  interactables.push({area,id:'real-'+area+'-'+id,name,
   x,z,r:1.65,kind:'real-facility',text:statement,source:REAL_WORLD_SOURCES[area]});
 }
 // A separate large freestall / connected paddock replaces the small cloned
 // lactating room, without changing other ten already researched facilities.
 const lactating=buildExpandedLactatingBarn({THREE,master,mobile,hot,registerAnimation});
 for(const marker of lactating.allHotspots)interactables.push(marker);
 registerAnimation('lactating',(t,dt)=>lactating.animate(t,dt));
 // Far-off dry: separate loose housing, headlocks, large bedded group areas.
 {
  const id='dry',g=startRoom(id);
  for(const side of [-1,1]){
   feedFront(g,side,-7.9,6.0);
   box(g,side*4.28,.20,-.9,3.25,.19,14.0,M.bedding);
   gateAcross(g,5.9,side*2.05,side*5.77);
   gateAcross(g,-7.9,side*2.05,side*5.77);
   water(g,side*2.7,7.2);
   addCow(g,side*4.2,-4.2,{zone:id,seed:43+side,face:-side,lying:true});
   addCow(g,side*4.3,1.3,{zone:id,seed:49+side,face:-side});
  }
  caption(g,'分群深墊料牛欄','圍欄／採食／休息分開',0,2.21,4.9,3.0);
  hot(id,'pack','乾乳牛深墊料休息區','乾乳牛使用獨立群欄與較寬的墊料休息區，而非密集小格牛床。',-1.52,-4);
  hot(id,'gate','牛群分群門與側欄','欄門用來引導牛群，飼餵線設有頭鎖，維持日常分群作業。',1.48,.7);
  hot(id,'water','採食前緣與水槽','乾乳期仍需要良好飲水與飼槽空間，這裡已明確留出服務通道。',1.48,6.6);
 }
 // Close up: calm group bedded area and separate calving privacy enclosure.
 {
  const id='closeup',g=startRoom(id);
  for(const side of [-1,1]){
   feedFront(g,side,-8.0,6.2,{locking:true});
   strawPad(g,side*4.25,-4.1,3.1,5.9);
   water(g,side*2.80,6.4);
  }
  gateAcross(g,0.25,-5.80,-2.15,M.steel);
  gateAcross(g,0.25,2.15,5.80,M.steel);
  for(const z of [.25,7.7])for(const side of [-1,1])
   box(g,side*5.65,1.1,(z+.25)/2,.10,1.7,Math.abs(z-.25),M.steel);
  for(const side of [-1,1]){
   strawPad(g,side*4.12,3.45,2.9,5.2);
   addCow(g,side*4.32,-4.2,{zone:id,lying:true,face:-side,seed:53+side});
  }
  caption(g,'預產牛群','獨立產房／乾爽墊料',0,2.20,2.95,3);
  hot(id,'prefresh','預產牛群深墊料欄','待產牛需要充分休息、採食與低干擾的環境；這裡與乳牛一般牛床區不同。',-1.48,-4.5);
  hot(id,'calving','獨立產房及隔欄','產房以可開關的隔欄保留較安靜的分娩空間，不會把整群直接塞進小格。',1.48,3.45);
  hot(id,'feed','待產前飼槽與飲水','中央服務走道兩側有飲水與採食區，未虛構分娩日期。',1.48,7.0);
 }
 // P0.6.8 overlays retain the proven room shells and add richer herds,
 // operable group gates, calving pens, supplies and inspection lighting.
 const transition=createTransitionBarns({THREE,master,mobile});
 for(const area of ['dry','closeup'])for(const point of TRANSITION_BARN_POINTS[area]){
  interactables.push({...point,area,r:1.65,kind:'transition-feature',
   source:REAL_WORLD_SOURCES[area]});
 }
 registerAnimation('dry',t=>transition.animate(t,'dry'));
 registerAnimation('closeup',t=>transition.animate(t,'closeup'));
 // Fresh: observation group and comfortable separated pens, no pre-set illness.
 {
  const id='fresh',g=startRoom(id);
  for(const side of [-1,1]){
   feedFront(g,side,-7.8,6.7);
   box(g,side*4.3,.21,-2.5,3.05,.23,9.5,M.bedding);
   water(g,side*2.9,6.9);
   addCow(g,side*4.24,-5.2,{zone:id,seed:74+side,face:-side});
   addCow(g,side*4.15,-.8,{zone:id,seed:77+side,face:-side,lying:true});
   gateAcross(g,2.55,side*2.13,side*5.75);
  }
  caption(g,'產後觀察群','休息區／分群動線',0,2.24,4.4,3.0);
  hot(id,'pens','產後獨立觀察群欄','產後觀察群有清楚的分區與乾爽的休息面，不等於牛隻一定生病。',-1.5,-5.6);
  hot(id,'water','飲水與採食前緣','產後牛靠近採食線與水槽，走道能讓工作人員巡視。',1.48,-.8);
  hot(id,'board','產後工作紀錄位置','這裡留有管理看板位置，但不顯示虛構病歷或牛隻測值。',-1.5,4.6);
  box(g,-5.82,2.18,4.3,.16,1.05,2.15,M.white);
 }
 // Calves: small individual pens with SOLID side dividers and service aisle.
 {
  const id='calf',g=startRoom(id);
  const penZ=[-7.35,-3.95,-.55,2.85,6.25];
  for(const side of [-1,1])for(let i=0;i<penZ.length;i++){
   const z=penZ[i],x=side*4.25;
   strawPad(g,x,z,2.66,2.86);
   // Interior pen sides are solid; front remains open bars for feeding.
   for(const zz of [z-1.41,z+1.41])box(g,x,.77,zz,2.74,1.30,.10,M.wall);
   fence(g,side*2.43,z-1.35,z+1.35,{front:false,spacing:.45,height:1.15});
   if(!mobile||i%2===0)addCow(g,x,z,{zone:id,scale:.43,face:-side,seed:120+i+side});
   cyl(g,side*2.26,.57,z-.61,.20,.22,.30,M.blue,9);
   cyl(g,side*2.26,.53,z+.48,.20,.22,.26,M.feed,9);
  }
  caption(g,'個別犢牛欄','實牆分隔／中央餵乳道',0,2.18,1.40,3.25);
  hot(id,'pens','獨立犢牛欄','犢牛各有乾燥墊料、小欄前門及實體隔板，面向中央服務走道。',-1.48,-6.6);
  hot(id,'buckets','餵奶與飲水桶','各欄前緣都有餵乳與飲水桶；清洗和準備作業應和欄內分開。',1.48,-.45);
  hot(id,'ventilation','上方新風通風管','天花板中央有正壓新風管的概念模型，並不是直接對犢牛吹強風。',-.2,6.85);
 }
 // Heifer grower: different age/size groups, partition gates, feed headlocks.
 {
  const id='heifer',g=startRoom(id);
  const bounds=[-8.0,-2.8,2.35,7.7];
  for(const side of [-1,1]){
   feedFront(g,side);
   for(let k=0;k<3;k++){
    const start=bounds[k],end=bounds[k+1];
    strawPad(g,side*4.28,(start+end)/2,3.10,end-start-.24);
    gateAcross(g,start,side*2.20,side*5.80);
    if(!mobile||k!==1)addCow(g,side*4.25,(start+end)/2,{zone:id,scale:.65+k*.09,face:-side,seed:155+k+side});
   }
   gateAcross(g,7.7,side*2.20,side*5.80);
   water(g,side*2.85,6.7);
  }
  caption(g,'分齡育成牛','依體型分群／採食前緣',0,2.15,-.5,3.0);
  box(g,5.85,1.28,7.3,.12,2.56,.10,M.yellow);
  for(let n=0;n<6;n++)box(g,5.92,.45+n*.31,7.3,.05,.025,.09,M.black);
  hot(id,'groups','分齡育成群欄','這裡按生長階段分群，牛的模型大小依欄別略有不同，不是全舍同體型。',-1.48,-5.6);
  hot(id,'front','育成牛頭鎖與飼槽','可看到分群門、採食線與水槽，與犢牛個別欄的配置不同。',1.48,-.8);
  hot(id,'measure','體尺量測區','欄邊保留安全的量測位置；這版不生成實際牛隻身高數字。',1.48,6.3);
 }
 // Feed center: roofed commodity bays, separated ingredients, mixer and loader lane.
 {
  const id='feed',g=startRoom(id);
  // Low divider walls produce visible U-shaped commodity bays.
  for(const side of [-1,1])for(let k=0;k<3;k++){
   const z=-6.3+k*5.55,x=side*4.6;
   box(g,side*5.88,.92,z, .22,1.75,4.7,M.concrete);
   for(const dz of [-2.27,2.27])box(g,x,.85,z+dz,2.78,1.57,.15,M.concrete);
   box(g,x,.44,z,2.4,.62,3.6,k===0?M.silage:k===1?M.hay:M.feed);
  }
  const mixer=sceneGroup(g,3.90,0,5.5,'TMR wagon');
  box(mixer,0,1.47,0,2.6,1.68,2.8,M.red);
  box(mixer,0,2.35,0,2.78,.13,2.75,M.bright);
  for(const x of [-1.24,1.24])for(const z of [-1,1]) {
   const wheel=cyl(mixer,x,.46,z,.45,.45,.28,M.rubber,12);wheel.rotation.z=Math.PI/2;
  }
  const auger=sceneGroup(mixer,0,2.42,0,'Auger');
  for(let i=0;i<4;i++)box(auger,-.78+i*.50,0,0,.30,.11,.20,M.steel);
  registerAnimation(id,t=>{auger.rotation.y=t*.24});
  box(g,-4.15,1.75,7.7,1.06,.72,.38,M.blue);
  box(g,-4.15,1.80,7.94,.77,.46,.05,M.lit);
  caption(g,'原料分格存放','裝料區／TMR 攪拌車',0,2.25,-.4,3.3);
  hot(id,'bays','獨立原料儲格','原料依類別分在開口混凝土料格內，前方保留裝載機作業道路。',-1.48,-5.0);
  hot(id,'mixer','TMR 攪拌車','TMR 車有大槽體、輪胎及槽內攪拌示意，停在裝料動線旁。',1.48,5.25);
  hot(id,'weigh','配料秤重控制','稱重控制台是空白示意面板；不提供虛構配方公斤數。',-1.48,7.15);
 }
 // Silage: long low-walled bunkers, weighted covers, covered hay and loader.
 {
  const id='silage',g=startRoom(id);
  for(const side of [-1,1]){
   const x=side*4.15;
   box(g,side*5.78,1.01,-3.4,.24,1.95,9.8,M.concrete);
   box(g,side*2.6,1.02,-3.4,.20,1.95,9.8,M.concrete);
   box(g,x,1.01,-8.23,3.1,1.90,.23,M.concrete);
   box(g,x,.72,-3.40,2.75,1.15,8.7,M.silage);
   box(g,x,1.33,-5.2,2.75,.12,4.0,M.cover);
   for(const z of [-7.5,-6.3,-5.1,-4.0]){
    cyl(g,side*2.88,1.46,z,.13,.13,.065,M.rubber,8);
    cyl(g,side*5.43,1.46,z,.13,.13,.065,M.rubber,8);
   }
  }
  for(const side of [-1,1])for(const z of [3.1,4.5,5.9]){
   const bale=cyl(g,side*4.48,.70,z,.66,.66,1.15,M.hay,12);
   bale.rotation.x=Math.PI/2;
  }
  const loader=sceneGroup(g,3.55,0,7.8,'Loader model');
  box(loader,0,1.08,0,2.25,1.30,1.05,M.yellow);
  for(const x of [-1.15,1.15]){
   const wheel=cyl(loader,x,.40,0,.45,.45,.30,M.rubber);wheel.rotation.z=Math.PI/2;
  }
  box(loader,-1.44,1.80,0,1.1,.15,.15,M.steel);
  box(loader,-2.0,1.19,0,.12,1.25,1.10,M.steel);
  caption(g,'青貯窖與乾草捆','分區貯存／可進出裝卸',0,2.15,1.0,3.15);
  hot(id,'bunker','青貯窖與覆蓋','青貯飼料放在有擋牆的長型窖中，部分有覆蓋布與壓重輪胎。',-1.48,-5.7);
  hot(id,'bales','乾草捆儲放區','乾草捆與青貯窖分開堆放，並保留機具取料空間。',1.48,4.7);
  hot(id,'loader','裝載機車道','鏟裝機停在側邊，前方長通道供取料與作業車輛出入。',1.48,7.65);
 }
 // Veterinary: separated treatment pens + gated restraint chute, clean tools.
 {
  const id='veterinary',g=startRoom(id);
  for(const z of [-5.8,-1.2,3.4]){
   strawPad(g,-4.2,z,2.9,3.7);
   for(const zz of [z-1.83,z+1.83])gateAcross(g,zz,-5.7,-2.45);
   fence(g,-2.45,z-1.83,z+1.83,{front:false});
  }
  const chute=sceneGroup(g,4.15,0,-2.0,'Treatment restraint chute');
  for(const zz of [-2.6,2.6]){
   gateAcross(chute,zz,-1.35,1.35,M.steel);
  }
  for(const x of [-1.30,1.30]){
   for(const z of [-2.2,2.2])box(chute,x,1.24,z,.14,2.2,.16,M.steel);
   for(const y of [.68,1.48])box(chute,x,y,0,.10,.08,5.2,M.steel);
  }
  caption(g,'保定處置區','頭鎖／獨立隔離欄',0,2.35,-5.1,3);
  const desk=sceneGroup(g,4.25,0,6.1,'Clean record table');
  box(desk,0,1.06,0,2.2,.14,1.2,M.office);
  for(const x of [-.9,.9])box(desk,x,.55,0,.09,1.0,.1,M.steel);
  box(desk,0,1.18,0,1.30,.04,.8,M.white);
  const sink=sceneGroup(g,-4.25,0,6.4,'Hand wash');
  box(sink,0,1.17,0,1.6,.22,.8,M.bright);
  box(sink,0,.78,0,1.3,.57,.65,M.steel);
  tube(sink,[[-.2,1.28,-.18],[-.2,1.58,-.18],[0,1.61,-.18],[0,1.38,0]],.034,M.steel);
  hot(id,'pens','隔離觀察牛欄','獨立牛欄與可開關欄門，讓觀察或處置動線不與一般牛群混在一起。',-1.48,-5.3);
  hot(id,'chute','保定處置與安全欄','現場處置可使用保定通道，空間應避免尖角與夾傷風險。',1.48,-1.8);
  hot(id,'wash','清潔與空白紀錄','出口側有洗手台及工作台；這裡不會生成虛構病歷或給藥資料。',-1.48,6.5);
 }
 // Manure: open, FENCED industrial area; solids separator, conveyor and liquid basin.
 {
  const id='manure',g=startRoom(id);
  // Different from barns: perimeter work pad, tanks, pits behind permanent rail.
  const area=sceneGroup(g,0,0,0,'Manure industrial equipment');
  box(area,0,.075,-.1,12.0,.12,19.1,M.concrete);
  const sep=sceneGroup(area,-4.0,0,-5.7,'Inclined screw-press solids separator');
  box(sep,0,1.83,0,1.75,1.18,1.4,M.steel);
  const screw=cyl(sep,0,2.42,0,.39,.39,1.2,M.bright,12);screw.rotation.z=Math.PI/2;
  box(sep,.93,.60,1.7,.76,.23,3.55,M.green);
  box(sep,1.15,1.25,0,.15,1.8,.15,M.steel);
  box(area,-4.05,.38,-2.4,2.8,.66,2.2,M.bedding);
  // A walled liquid retention basin, fenced against player access.
  const basin=sceneGroup(area,4.20,0,-4.2,'Liquid containment');
  box(basin,0,.56,0,3.1,1.05,8.0,M.concrete);
  box(basin,0,1.11,0,2.6,.07,7.55,M.water);
  for(const x of [-2.25,2.25])fence(basin,x,-4.1,4.1,{front:false,height:1.45});
  for(const z of [-4.1,4.1])gateAcross(basin,z,-2.3,2.3,M.yellow);
  const pump=sceneGroup(area,-4.35,0,4.4,'Manure pump station');
  cyl(pump,0,.70,0,.55,.59,1.15,M.blue,12);
  box(pump,0,.13,0,1.60,.25,1.36,M.steel);
  tube(pump,[[.55,.7,0],[1.24,.7,0],[1.24,1.6,0],[4.15,1.6,0]],.09,M.gray);
  registerAnimation(id,t=>{screw.rotation.x=t*.12});
  caption(g,'糞污分離與暫存','固體／液體分流・圍欄安全',0,2.48,2.6,4.0);
  hot(id,'separator','固液分離與輸送','固液分離機和輸送槽在左側，分出固體與液體處理流向。',-1.48,-5.7);
  hot(id,'basin','安全圍欄液體處理區','液體處理池有防護欄，切勿進入池內；這只是流程配置示意。',1.48,-4.1);
  hot(id,'pump','輸送泵浦與管線','右後方的管路與泵浦相連；現場真實設備需依安全程序操作。',-1.48,4.55);
 }
 // Machinery: realistic tractor with separate maintenance work zone and tool racks.
 {
  const id='machinery',g=startRoom(id);
  for(const side of [-1,1]){
   box(g,side*4.50,.24,-2.8,3.2,.22,10,M.concrete);
   for(const z of [-8.1,1.8])gateAcross(g,z,side*2.8,side*5.8);
  }
  const tractor=sceneGroup(g,-4.30,0,-4.5,'Parked tractor');
  box(tractor,0,1.04,0,2.50,1.04,3.7,M.red);
  box(tractor,0,1.87,-.78,1.92,1.62,1.50,M.blue);
  box(tractor,0,2.72,-.78,2.1,.12,1.74,M.steel);
  for(const x of [-1.30,1.30])for(const z of [-1.25,1.25]){
   const wheel=cyl(tractor,x,.55,z,.67,.67,.32,M.rubber,12);wheel.rotation.z=Math.PI/2;
   cyl(tractor,x,.55,z,.27,.27,.34,M.gray,10).rotation.z=Math.PI/2;
  }
  const bay=sceneGroup(g,4.25,0,-2.8,'Workshop storage and inspection');
  for(const z of [-6,-4,-2,0,2,4]){
   box(bay,0,1.72,z,2.6,.20,1.2,M.office);
   for(const yy of [.50,1.18])box(bay,0,yy,z,2.6,.15,1.0,M.gray);
  }
  const work=sceneGroup(g,-4.30,0,6.25,'Maintenance table');
  box(work,0,1.05,0,2.85,.17,1.45,M.office);
  for(const x of [-1.16,1.16])box(work,x,.55,0,.11,1.00,.14,M.steel);
  for(let i=0;i<5;i++)box(work,-.95+i*.44,1.20,0,.09,.20,.12,M.bright);
  caption(g,'機具停放與保養','曳引機／工具架／工作台',0,2.45,-.65,3.3);
  hot(id,'tractor','農機停車與維修工位','曳引機停在側邊機具車位，保留中央牽引與搬運通道。',-1.48,-4.65);
  hot(id,'shelves','工具及零件架','工具架與保養零件位於維修工位側邊，便於取用與管理。',1.48,0);
  hot(id,'bench','工作台與清點區','工作台設在通道外側，維修器具和零件可在這裡整理。',-1.48,6.2);
 }
 const counts=Object.fromEntries(FACILITY_IDS.map(id=>[id,interactables.filter(v=>v.area===id).length]));
 for(const id of FACILITY_IDS){
  const expected=id==='lactating'?16:['dry','closeup'].includes(id)?8:3;
  if(counts[id]!==expected)throw Error('Expected correct points in '+id+':'+counts[id]);
 }
 function animate(time,area,dt=.016){
  if(!Number.isFinite(time)||!animations.has(area))return;
  for(const update of animations.get(area))update(time,dt);
 }
 return {interactables,counts,animate,areaIds:FACILITY_IDS,labels:FACILITY_LABELS,sources:REAL_WORLD_SOURCES,lactating,transition};
}
