// DAIRY 24HR P0.6.2 — stand-alone larger lactating cow freestall + loafing yard.
// Original geometry, informed by PSU Freestalls; DairyNZ and EFSA outdoor loafing;
// Ontario/Missouri extension feedline soakers and fans; DairyNZ PN29 alley scrapers;
// Dairy Conservation monitoring collars. Not scaled engineering or animal-welfare certification.
export const LACTATING_AREA=Object.freeze({
 id:'lactating',barn:{width:46,depth:34,zCenter:-10},yard:{width:46,depth:25,zCenter:19},
 bounds:{xmin:-24,xmax:24,zmin:-28,zmax:31},entry:{x:0,z:27},
 feedAlley:{xmin:-4.1,xmax:4.1,zmin:-25,zmax:6},soakerDefault:false,
 landmarks:['freestall','feed','cooling','yard','sensor','scraper']
});
export function buildExpandedLactatingBarn({THREE,master,mobile=false,hot,registerAnimation}){
 const p=master.interiors.get('lactating');
 if(!p)throw Error('Missing lactating zone');
 const color=(v,metalness=0,roughness=.72)=>new THREE.MeshStandardMaterial({color:v,metalness,roughness});
 const C={
  ground:color(0x8dae78),concrete:color(0xb1b9b0),floor:color(0x899993),sand:color(0xcbba97),walk:color(0x97a4a0),
  steel:color(0x94a6ab,.60,.36),shiny:color(0xc7d4d3,.63,.30),pipe:color(0x438ca5,.32,.40),
  black:color(0x252c2b),white:color(0xf2f0e8),patch:color(0x282c2c),nose:color(0xdab2ab),
  hoof:color(0x44433f),sensor:color(0x236563),indicator:new THREE.MeshBasicMaterial({color:0x76e3a4}),
  straw:color(0xc3ad7d),feed:color(0x837951),blue:color(0x527f90),water:color(0x508ea6,.1,.32),
  warning:color(0xe8c76b),drain:color(0x4f605e),shade:color(0xb4c4b4),wood:color(0x9c815d)
 };
 const boxGeo=new THREE.BoxGeometry(1,1,1);
 const sphereGeo=new THREE.SphereGeometry(1,mobile?9:15,mobile?7:10);
 const ringGeo=new THREE.TorusGeometry(.93,.075,6,mobile?13:22);
 const cylGeos=new Map(),moves=[], fans=[], droplets=[],scrapers=[];
 const cowInfo=[];
 const numTextures=[];
 const streams={};
 let soakerOn=false,sprayElapsed=0,scraperRunning=false,scraperElapsed=0;
 function group(parent,name,x=0,y=0,z=0){
   const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g;
 }
 function box(parent,x,y,z,w,h,d,m=C.steel,name=''){
   const mesh=new THREE.Mesh(boxGeo,m);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);
   mesh.name=name;mesh.castShadow=!mobile&&w*h*d>.9;
   mesh.receiveShadow=!mobile;parent.add(mesh);return mesh;
 }
 function cylinder(parent,x,y,z,radius,height,m=C.steel,n=mobile?9:14){
   const key=radius+':'+height+':'+n;
   if(!cylGeos.has(key))cylGeos.set(key,new THREE.CylinderGeometry(radius,radius,height,n));
   const mesh=new THREE.Mesh(cylGeos.get(key),m);mesh.position.set(x,y,z);parent.add(mesh);
   return mesh;
 }
 function sphere(parent,x,y,z,sx,sy,sz,m=C.white){
   const mesh=new THREE.Mesh(sphereGeo,m);
   mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;
 }
 function pipe(parent,coords,r=.055,m=C.pipe){
   const curve=new THREE.CatmullRomCurve3(coords.map(v=>new THREE.Vector3(...v)));
   const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,mobile?12:24,r,6,false),m);
   parent.add(mesh);return mesh;
 }
 function sign(parent,title,subtitle,x,y,z,width=4,rotation=0){
   const cv=document.createElement('canvas');cv.width=512;cv.height=160;
   const ctx=cv.getContext('2d');ctx.fillStyle='#133643';ctx.fillRect(0,0,512,160);
   ctx.strokeStyle='#e4c477';ctx.lineWidth=6;ctx.strokeRect(4,4,504,152);
   ctx.fillStyle='#fff4db';ctx.textAlign='center';ctx.font='bold 40px "Noto Sans TC",sans-serif';
   ctx.fillText(title,256,73);ctx.font='25px "Noto Sans TC",sans-serif';ctx.fillStyle='#c9e5e0';ctx.fillText(subtitle,256,121);
   const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
   const face=new THREE.Mesh(new THREE.PlaneGeometry(width,width*.313),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
   face.position.set(x,y,z);face.rotation.y=rotation;parent.add(face);return face;
 }
 function cowNumberBadge(number){
   const cv=document.createElement('canvas');cv.width=256;cv.height=128;
   const ctx=cv.getContext('2d');ctx.fillStyle='#fff9d8';ctx.fillRect(0,0,256,128);
   ctx.fillStyle='#1d343a';ctx.fillRect(6,6,244,116);
   ctx.fillStyle='#ffd579';ctx.fillRect(12,12,232,104);
   ctx.fillStyle='#1d343a';ctx.textAlign='center';ctx.font='bold 80px monospace';
   ctx.fillText(String(number),128,92);
   const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;
   numTextures.push(texture);
   return new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,depthWrite:false});
 }
 // Real housing differentiation: central FEED DELIVERY corridor, cow-only
 // feed stance lanes further out, dedicated scraping alleys, and free stalls.
 const barn=group(p,'Expanded 46-wide lactating freestall barn');
 box(barn,0,-.20,-10,46,.32,36,C.concrete);
 box(barn,0,.012,-10,8.0,.07,33,C.floor,'FEED_DELIVERY_ALLEY_COW_FREE');
 sign(barn,'中央飼料車道','牛隻在頭鎖外側採食',0,4.65,-24.6,4.8);
 for(const sx of [-1,1]){
   box(barn,sx*4.55,.23,-10,1.25,.33,32,C.concrete);
   box(barn,sx*4.55,.43,-10,1.05,.14,31.6,C.feed,'Feed trough');
   // Proper feed front separates cows from the vehicle feed lane.
   for(let zz=-25;zz<=5;zz+=1.8){
     box(barn,sx*5.43,1.05,zz,.09,1.68,.09,C.steel,'Headlock upright');
     const slant=box(barn,sx*5.45,1.13,zz+.54,.09,.77,.09,C.steel);
     slant.rotation.x=sx*.20;
   }
   for(const y of [.65,1.86])box(barn,sx*5.43,y,-10,.13,.10,31.4,C.shiny);
   box(barn,sx*8.1,.12,-10,4.85,.15,32,C.walk,'Feed standing alley');
   box(barn,sx*12.4,.11,-10,3.35,.15,32,C.floor,'Scraper cow lane');
   box(barn,sx*19.0,.22,-10,7.0,.34,32,C.sand,'Deep sand stall beds');
   // One row of accurately identifiable individual freestalls.
   for(let zz=-24.2;zz<=4.6;zz+=3.14){
     box(barn,sx*19.05,.43,zz,6.35,.11,2.75,C.sand);
     for(const dz of [-1.37,1.37]){
       const x1=sx*16.2,x2=sx*21.55;
       pipe(barn,[[x1,1.29,zz+dz],[sx*17.3,1.52,zz+dz],
          [sx*20.65,1.48,zz+dz],[x2,.98,zz+dz]],.055,C.shiny);
     }
     box(barn,sx*21.65,.52,zz,.18,.17,2.40,C.concrete,'Brisket locator');
   }
   box(barn,sx*15.88,.31,-10,.18,.35,31,C.concrete,'Stall alley curb');
   pipe(barn,[[sx*16.75,1.58,-24.6],[sx*16.75,1.58,-14],
     [sx*16.75,1.58,-3],[sx*16.75,1.58,6]],.058,C.steel);
   // Floor guide is recessed below hooves, scraper collects only cow alleys.
   box(barn,sx*12.40,.048,-10,.07,.017,31.3,C.drain,'Recessed scraper cable guide');
   const scraper=group(barn,'Slow moving barn manure scraper',sx*12.4,.14,-19);
   box(scraper,0,.10,0,3.20,.18,.12,C.shiny,'Cross alley blade');
   for(const dx of [-1.52,1.52])box(scraper,dx,.09,0,.16,.16,.95,C.steel);
   box(scraper,0,.065,-.42,.25,.11,.85,C.drain,'Scraper drawbar');
   scrapers.push(scraper);
   box(barn,sx*12.4,.09,6.0,3.8,.05,.32,C.drain,'End manure catch channel');
   // Water troughs adjacent cross-over, not blocking cow feed fronts.
   const drink=group(barn,'Cross-over drinker',sx*11.3,0,5.15);
   box(drink,0,.79,0,1.4,.75,2.1,C.shiny);
   box(drink,0,1.19,0,1.20,.08,1.9,C.water);
   // Feedline SOAKERS intentionally point at cows from the cow side of
   // headlock; do not spray feed, beds or udders.
   pipe(barn,[[sx*6.28,3.18,-24.6],[sx*6.28,3.18,-16],
     [sx*6.28,3.18,-7],[sx*6.28,3.18,5.0]],.068,C.pipe);
   for(const zz of [-22,-16,-10,-4,2]){
     cylinder(barn,sx*6.28,3.02,zz,.086,.22,C.shiny);
     const stream=group(barn,'Intermittent cow-only soaking droplets',sx*6.52,2.75,zz);
     for(let i=0;i<(mobile?3:5);i++){
       const drop=sphere(stream,(i-2)*.22,-.18-i*.20,0,.036,.10,.055,C.water);
       droplets.push({mesh:drop,i,side:sx});
     }
     stream.visible=false;
     // Retain nozzle reference for toggling the whole stream, not each bead.
     if(!streams[sx])streams[sx]=[];
     streams[sx].push(stream);
   }
 }
 // Four overhead fan banks mounted just under an OPEN sided pitched roof.
 const roof=group(barn,'High open-sided roof, rafters and industrial fans');
 for(const z of [-26,-20,-14,-8,-2,5.5]){
   for(const x of [-22.2,22.2]){
     box(roof,x,2.65,z,.18,5.25,.18,C.steel,'Roof column');
   }
   for(const side of [-1,1]){
     const beam=box(roof,side*12.2,5.3,z,23.2,.14,.20,C.shiny);
     beam.rotation.z=side<0?.12:-.12;
   }
   box(roof,0,6.70,z,3.5,.15,.25,C.steel,'Open roof ridge beam');
 }
 for(const x of (mobile?[-20,-7,7,20]:[-20,-13.6,-7,7,13.6,20])){
   for(const z of [-21,-8,3]){
     const fan=group(roof,'Suspended fan blowing into occupied zone',x,4.75,z);
     cylinder(fan,0,.30,0,.15,.62,C.steel);
     const ring=new THREE.Mesh(ringGeo,C.dark);ring.rotation.x=Math.PI/2;fan.add(ring);
     const rotor=group(fan,'Fan rotor');
     for(let b=0;b<3;b++){
       const vane=box(rotor,.42,0,0,.82,.045,.18,C.shiny);
       vane.rotation.y=b*2*Math.PI/3;
       const arm=group(rotor,'Fan blade pivot');arm.rotation.y=b*2*Math.PI/3;
       arm.add(vane);vane.position.set(.42,0,0);vane.rotation.y=0;
     }
     fans.push(rotor);
   }
 }
 // Low-opacity rear/side shade panels (no solid overhead ceiling blocking camera).
 for(const x of [-23.0,23.0]){
   for(const z of [-22,-12,-2,5])box(roof,x,3.3,z,.14,1.65,3.0,C.shade);
 }
 // Attached outdoor exercise/loafing yard with free access, open sky,
 // non-slip surface, perimeter fence, shade, water and drainage.
 const yard=group(p,'OUTDOOR_EXERCISE_YARD connected to lactating barn');
 box(yard,0,-.24,20,48,.30,25,C.ground,'Outdoor green edge');
 box(yard,0,.014,19.7,44,.08,23.0,C.floor,'Firm non-slip drained exercise surface');
 sign(yard,'泌乳牛運動場','可散步／曬到陽光／遮蔭／飲水',0,3.5,29.4,5.3);
 // Fences at both sides, across far perimeter, and opened connection at barn.
 for(const sx of [-1,1]){
   for(const zz of [9,14,19,24,30])box(yard,sx*23.2,1.0,zz,.16,1.95,.15,C.steel);
   for(const yy of [.55,1.32])box(yard,sx*23.2,yy,19.5,.14,.10,22,C.steel);
   // At barn-yard junction x ±8..±21 is unobstructed for bovine movement.
   for(const xz of [[sx*4.3,sx*1.0],[sx*23.1,sx*21.4]]){
     const [start,end]=xz;
     const left=Math.min(start,end),right=Math.max(start,end);
     for(const yy of [.62,1.20])box(yard,(left+right)/2,yy,8.0,right-left,.11,.11,C.steel);
   }
   const waterGroup=group(yard,'Outdoor accessible drinker',sx*19.8,0,22.5);
   box(waterGroup,0,.75,0,2.4,.76,1.3,C.shiny);
   box(waterGroup,0,1.16,0,2.14,.06,1.10,C.water);
   // Shaded dry resting area; not a permanent muddy bare-earth lot.
   box(yard,sx*15.7,.09,12.8,12,.09,6.4,C.sand,'Shaded dry loafing pad');
   for(const xx of [sx*11,sx*20.4])for(const zz of [10.0,15.5])
     box(yard,xx,1.9,zz,.15,3.65,.15,C.steel);
   for(const zz of [10.0,15.5])box(yard,sx*15.7,3.45,zz,11.0,.11,.13,C.steel);
   // Slatted shade artwork but open viewing gaps.
   for(let j=0;j<4;j++)box(yard,sx*15.7,3.36,10.4+j*1.5,10.6,.065,.32,C.shade);
 }
 for(let xx=-21;xx<=21;xx+=3.5){
   box(yard,xx,1.0,31.0,.14,1.85,.14,C.steel);
 }
 for(const yy of [.57,1.3])box(yard,0,yy,31.0,44,.12,.10,C.steel);
 // Paved gradient/drains and grate at side perimeter — does not cross cow path.
 for(const xx of [-21.9,21.9])box(yard,xx,.045,21,.28,.035,15.5,C.drain);
 for(let z=13;z<29;z+=1.0)for(const sx of [-1,1])
   box(yard,sx*21.9,.065,z,.30,.02,.08,C.black);
 const brush=group(yard,'Rotating cow brush',-20.6,0,16.6);
 box(brush,0,1.2,0,.22,2.3,.22,C.steel);
 const brushRoll=cylinder(brush,0,1.65,.30,.40,1.1,C.blue,12);
 brushRoll.rotation.z=.22;
 // Individual dairy cows, seeded placements by behavior, not uniform row.
 // Keep all visible collars, cow-back IDs and simple status prompts.
 const herd=[
  {id:1201,x:-18.0,z:-19.8,kind:'lying-stall',yaw:Math.PI},
  {id:1202,x:19.2,z:-14.0,kind:'lying-stall',yaw:0},
  {id:1203,x:-19.1,z:-4.1,kind:'lying-stall',yaw:Math.PI},
  {id:1204,x:15.45,z:1.2,kind:'barn-walking',yaw:Math.PI/2},
  {id:1205,x:-8.1,z:-19.4,kind:'feeding',yaw:0},
  {id:1206,x:8.1,z:-11.1,kind:'feeding',yaw:Math.PI},
  {id:1207,x:-8.3,z:-2.3,kind:'feeding',yaw:0},
  {id:1208,x:8.0,z:4.0,kind:'feeding',yaw:Math.PI},
  {id:1209,x:-10.3,z:15.0,kind:'yard-standing',yaw:-Math.PI/2},
  {id:1210,x:13.5,z:18.3,kind:'yard-standing',yaw:.25},
  {id:1211,x:-7.8,z:26.1,kind:'yard-walking',yaw:0},
  {id:1212,x:8.5,z:26.8,kind:'yard-walking',yaw:Math.PI},
  {id:1213,x:-17.0,z:12.0,kind:'yard-lying',yaw:0},
  {id:1214,x:18.2,z:12.7,kind:'yard-lying',yaw:Math.PI},
  {id:1215,x:16.4,z:-21,kind:'standing-stall',yaw:0},
  {id:1216,x:-18.3,z:-8.4,kind:'lying-stall',yaw:Math.PI}
 ];
 const shown=mobile?herd.filter(c=>![1203,1208,1214,1215].includes(c.id)):herd;
 function cow(data){
  const lying=data.kind.includes('lying'),walking=['yard-walking','barn-walking'].includes(data.kind);
  const parent=data.z>7.9?yard:barn;
  const root=group(parent,'Cow #'+data.id+' '+data.kind,data.x,.12,data.z);
  root.rotation.y=data.yaw;
  const bod=group(root,'Body');
  sphere(bod,0,lying?.90:1.20,0,1.20,lying?.55:.67,.57,C.white);
  sphere(bod,-.39,lying?.88:1.29,-.39,.60,.38,.24,C.patch);
  sphere(bod,.38,lying?.88:1.16,.48,.37,.35,.17,C.patch);
  sphere(bod,-.29,lying?.93:1.24,.36,.29,.31,.28,C.patch);
  const neck=group(root,'Collar-bearing neck',1.02,lying?1.08:1.52,0);
  sphere(neck,0,0,0,.41,.43,.42,C.white);
  sphere(neck,.32,-.13,0,.32,.26,.26,C.nose);
  for(const sign of [-1,1]){
   sphere(neck,-.12,.28,sign*.40,.21,.12,.15,C.white);
   sphere(neck,.27,.12,sign*.37,.055,.06,.05,C.black);
  }
  // Circumferential monitoring collar with bright side-mounted receiver.
  for(const sign of [-1,1]){
   box(neck,-.19,-.20,sign*.38,.11,.67,.095,C.sensor,'Monitoring collar strap');
   const monitor=box(neck,-.13,.15,sign*.43,.30,.22,.10,C.sensor,'Rumination and activity sensor');
   box(neck,-.10,.16,sign*.494,.12,.09,.015,C.indicator);
  }
  // Ear tag for identity, distinct from digital health collar.
  box(neck,-.11,.18,.59,.14,.23,.05,C.warning,'Cow ear identity tag');
  const legs=[];
  for(const xx of [-.77,.66])for(const zz of [-.36,.36]){
    const limb=group(root,'Cow leg',xx,lying?.69:.83,zz);
    box(limb,0,-.34,0,.25,lying?.31:.72,.24,C.white);
    box(limb,.03,lying?-.53:-.69,0,.30,.13,.28,C.hoof);
    legs.push(limb);
  }
  const tail=group(root,'Tail',-1.07,lying?1.07:1.51,0);
  box(tail,-.14,-.32,0,.11,.62,.10,C.white);
  box(tail,-.18,-.58,0,.15,.23,.14,C.patch);
  if(!lying){
   sphere(root,-.16,.67,0,.29,.21,.24,C.nose);
  }
  // A horizontal, upward-facing BACK ID on each cow, visible from overhead.
  const plate=new THREE.Mesh(new THREE.PlaneGeometry(.88,.51),cowNumberBadge(data.id));
  plate.name='Cow back number '+data.id;
  plate.rotation.x=-Math.PI/2;plate.position.set(-.12,lying?1.47:1.92,0);
  root.add(plate);
  cowInfo.push({id:data.id,behavior:data.kind,monitor:true,number:true,
     root,head:neck,legs,tail,base:{x:data.x,z:data.z,yaw:data.yaw}});
  moves.push(t=>{
    const phase=t*.78+data.id*.19;
    neck.rotation.z=.033*Math.sin(phase);
    tail.rotation.x=.19*Math.sin(phase*.83);
    if(walking){
      const q=t*.20+data.id*2.5;
      // Movement stays in a dedicated roaming corridor in the yard.
      // Never pass through feed lanes, headlocks, stalls or scraper blades.
      const c=Math.sin(q),outside=data.kind==='yard-walking';
      const z=data.z+(outside?2.25:2.0)*c;
      const dzdt=(outside?.45:.40)*Math.cos(q);
      const x=data.x+(outside?1.18:.25)*Math.sin(q*.66);
      const dxdt=(outside?.1558:.033)*Math.cos(q*.66);
      root.position.set(x,.12,z);
      const angle=Math.atan2(-dzdt,dxdt);
      const delta=Math.atan2(Math.sin(angle-root.rotation.y),Math.cos(angle-root.rotation.y));
      root.rotation.y+=delta*.04;
      legs.forEach((limb,i)=>{limb.rotation.z=.18*Math.sin(t*4.2+i*Math.PI*.93)});
    }else{
      root.position.y=.12+.009*Math.sin(phase*.9);
      legs.forEach((limb,i)=>{limb.rotation.z=lying?0:.009*Math.sin(phase+i)});
    }
  });
 }
 for(const data of shown)cow(data);
 for(const v of droplets)v.mesh.visible=false;
 // Viewer action hotspots: actual equipment coordinates, not generic axis markers.
 hot('lactating','stall','臥床區與躺臥乳牛','牛床是自由進出的；一部分牛正在躺臥休息，其他牛在採食或活動。',-14.75,-14);
 hot('lactating','feed','頭鎖採食與噴淋','噴淋管位於頭鎖上方、牛隻採食的一側；冷卻應搭配風扇，避免淋溼飼料或牛床。',4.1,-13.6);
 hot('lactating','cooling','大風扇與頸圈感測器','屋架下有大型風扇；牛佩戴頸圈式行為感測器，牛背有 4 位數牛號。',-6.3,-2.3);
 // Extra three landmarks specifically for a larger enriched zone.
 const extra=[
  {id:'lactating-yard',name:'戶外運動場與飲水',x:0,z:18.7,
   text:'運動場連接牛舍，提供站立、散步與社交空間，並安排遮蔭、排水和額外飲水槽。'},
  {id:'lactating-soaker',name:'頭鎖上方降溫噴淋',x:6.7,z:2.8,
   text:'按下可開關示意噴淋：短暫打濕牛背，配合風扇蒸散；不可持續淋濕飼料、牛床或乳房。'},
  {id:'lactating-scraper',name:'牛舍地面刮糞機',x:12.6,z:-4,
   text:'採食與牛床之間的排糞走道設導槽和低速刮板，會沿走道把糞污帶往末端收集溝。'}
 ];
 // No fake station placement in inaccessible old x=±1.7 central corridor.
 // User can walk entire 46 × 59 indoor/yard footprint in this scene.
 function interact(id){
   if(id==='lactating-soaker'){
     soakerOn=!soakerOn;sprayElapsed=0;
     return soakerOn?'噴淋示意已啟動；配合風扇短暫濕潤採食牛體，稍後自動停止。':'噴淋已關閉。';
   }
   if(id==='lactating-scraper'){
     scraperRunning=!scraperRunning;scraperElapsed=0;
     return scraperRunning?'刮糞機示意緩速啟動，牛隻已安排在刮板行進範圍外。':'刮糞機示意暫停。';
   }
   return extra.find(x=>x.id===id)?.text||null;
 }
 // No continuous soak; operation is optional player-triggered demonstration.
 function animate(time,dt=.016){
  if(!Number.isFinite(time))return;
  for(const fn of moves)fn(time);
  for(const rotor of fans)rotor.rotation.y=time*.36;
  brushRoll.rotation.y=time*.55;
  if(soakerOn){
   sprayElapsed+=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
   if(sprayElapsed>9){soakerOn=false;sprayElapsed=0;}
  }
  for(const side of [-1,1])for(const stream of streams[side]||[])stream.visible=soakerOn;
  for(const item of droplets)item.mesh.visible=soakerOn;
  if(scraperRunning){
   scraperElapsed+=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
   if(scraperElapsed>22){scraperRunning=false;scraperElapsed=0;}
  }
  const progress=scraperRunning?Math.min(1,scraperElapsed/22):0;
  for(const blade of scrapers)blade.position.z=-19+22*progress;
 }
 // Existing three high-level stations + three interactive enrichments.
 const allHotspots=extra.map(x=>({
  ...x,area:'lactating',kind:'lactating-feature',r:3.1,
  source:'https://www.dairynz.co.nz/business/off-paddock-infrastructure/freestall-barn/'
 }));
 return {allHotspots,animate,interact,cowInfo,layout:LACTATING_AREA,
    state:()=>({soakerOn,scraperRunning}),
    assetCounts:{cows:cowInfo.length,fans:fans.length,sprinklerNozzles:10,
      scrapers:scrapers.length,sensors:cowInfo.length,backNumbers:cowInfo.length}};
}
