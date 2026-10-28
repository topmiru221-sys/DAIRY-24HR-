// DAIRY 24HR P0.6.0 — the stable farm site skeleton enriched by farm-content.mjs.
// Site topology, facilities and portals are now stable reusable data.
export const ZONES=Object.freeze([
 {id:'parlor',name:'榨乳室',icon:'🐄',x:-12,z:-23,type:'milking',built:true,side:-1},
 {id:'tank',name:'生乳儲存區',icon:'🥛',x:-25,z:-23,type:'storage',built:true,side:-1},
 {id:'office',name:'牧場管理室',icon:'🗂',x:13,z:-23,type:'office',built:true,side:1},
 {id:'lactating',name:'泌乳牛舍',icon:'🐮',x:-14,z:-9,type:'cows',side:-1},
 {id:'dry',name:'乾乳牛舍',icon:'🌾',x:14,z:-9,type:'cows',side:1,refined:true},
 {id:'closeup',name:'待產／Close-up區',icon:'🤰',x:-14,z:4,type:'maternity',side:-1,refined:true},
 {id:'fresh',name:'產後／Fresh區',icon:'💚',x:14,z:4,type:'maternity',side:1},
 {id:'calf',name:'犢牛舍',icon:'🍼',x:-14,z:18,type:'calf',side:-1},
 {id:'heifer',name:'育成牛舍',icon:'🐮',x:14,z:18,type:'cows',side:1},
 {id:'feed',name:'TMR調製／飼料中心',icon:'🚜',x:-26,z:4,type:'feed',side:-1},
 {id:'silage',name:'青貯與乾草儲區',icon:'🌽',x:-26,z:18,type:'silage',side:-1},
 {id:'veterinary',name:'隔離與獸醫處置區',icon:'🩺',x:26,z:-9,type:'veterinary',side:1},
 {id:'manure',name:'糞污及廢水處理區',icon:'♻️',x:26,z:4,type:'manure',side:1},
 {id:'machinery',name:'農機與維修區',icon:'🔧',x:26,z:18,type:'machinery',side:1},
 {id:'loading',name:'集乳與車輛入口',icon:'🚚',x:0,z:-34,type:'loading',side:0},
 {id:'yard',name:'牧場中庭／公共道路',icon:'🗺',x:0,z:31,type:'yard',side:0},
]);
export const AREA_IDS=Object.freeze(['farm',...ZONES.filter(v=>!['yard','loading'].includes(v.id)).map(v=>v.id)]);
export const SKELETON_ZONES=Object.freeze(ZONES.filter(v=>!v.built&&!['yard','loading'].includes(v.id)).map(v=>v.id));
export function findZone(id){return ZONES.find(z=>z.id===id)||null}
export function areaName(id){return id==='farm'?'牧場總覽':findZone(id)?.name||'未知區域'}
export function createMasterplan({THREE,scene,mobile=false}){
 const M=(hex,metal=0,rough=.8)=>new THREE.MeshStandardMaterial({color:hex,metalness:metal,roughness:rough});
 const C={
  ground:M(0x87ad80),road:M(0x6c7775),lane:M(0x9fa7a0),field:M(0x9cc08f),
  siding:M(0xc4ccc2),wall:M(0xdce2d6),steel:M(0xaabcc2,.52,.40),
  dark:M(0x354956),wood:M(0xb69163),straw:M(0xb9a364),
  green:M(0x477866),blue:M(0x4b91a9),clay:M(0xb87557),
  water:M(0x568b97,.2,.38),yellow:M(0xe8c667),feed:M(0x8c7750),
  glass:new THREE.MeshBasicMaterial({color:0xb0dfe3,transparent:true,opacity:.67})
 };
 const root=new THREE.Group();root.name='DAIRY24HR_WHOLE_FARM_MAP';root.visible=false;scene.add(root);
 const interiors=new Map(),sharedCube=new THREE.BoxGeometry(1,1,1);
 const liveOn=[];
 function box(parent,x,y,z,w,h,d,mat=C.steel){
  const o=new THREE.Mesh(sharedCube,mat);o.position.set(x,y,z);o.scale.set(w,h,d);
  o.castShadow=!mobile&&w*h*d>.6;o.receiveShadow=!mobile;parent.add(o);return o;
 }
 function cy(parent,x,y,z,rt,rb,h,mat=C.steel,n=mobile?10:16){
  const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),mat);
  o.position.set(x,y,z);o.castShadow=!mobile&&rt*rb*h>.4;parent.add(o);return o;
 }
 function label(parent,name,sub,x,y,z,w=4,rot=0){
  const cv=document.createElement('canvas');cv.width=512;cv.height=150;
  const q=cv.getContext('2d');q.fillStyle='#1e414c';q.fillRect(0,0,512,150);
  q.strokeStyle='#e7c572';q.lineWidth=8;q.strokeRect(4,4,504,142);
  q.textAlign='center';q.fillStyle='#fff2d6';
  q.font='bold 41px "Noto Sans TC",sans-serif';q.fillText(name,256,66);
  q.font='24px "Noto Sans TC",sans-serif';q.fillStyle='#cde8e4';q.fillText(sub,256,115);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;
  const o=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.293),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));
  o.position.set(x,y,z);o.rotation.y=rot;parent.add(o);return o
 }
 // One complete farm yard, walkable on foot from the near-side entrance.
 box(root,0,-.20,0,79,.34,86,C.ground);
 box(root,0,.010,0,6.2,.085,77,C.road);
 box(root,0,.017,29.5,56,.08,5.1,C.road);
 box(root,0,.017,-31.1,56,.08,5.1,C.road);
 for(const z of [-23,-9,4,18]){
  box(root,0,.022,z,59,.07,4.2,C.road);
  // White dashed centreline gives a legible axis in the 3D site.
  for(let x=-26;x<=26;x+=6)box(root,x,.070,z,.20,.016,.075,C.siding);
 }
 for(let z=-36;z<=35;z+=4.5)box(root,0,.070,z,.06,.014,1.9,C.siding);
 // Gate and surrounding property fence.
 for(const x of [-37.8,37.8]){
  for(let z=-38;z<=38;z+=6){
   box(root,x,.95,z,.14,1.85,.13,C.wood);
  }
  for(const y of [.7,1.3])box(root,x,y,0,.11,.10,78,C.wood);
 }
 for(const z of [-39.6,39.6]){
  for(let x=-36;x<=36;x+=6)box(root,x,.92,z,.13,1.8,.14,C.wood);
  for(const y of [.7,1.3])box(root,0,y,z,72,.10,.09,C.wood);
 }
 // Trees and landscape, kept minimal for Android render budget.
 const cone=new THREE.ConeGeometry(.90,2.5,mobile?6:8);
 const treeMat=M(0x4c7b4c);
 for(let k=0;k<20;k++){
  const side=k%2===0?-1:1,z=-34+(k*13)%69;
  const x=side*(34+(k%3)*.9);
  cy(root,x,.65,z,.18,.24,1.3,C.wood,7);
  const crown=new THREE.Mesh(cone,treeMat);crown.position.set(x,2.43,z);root.add(crown);
 }
 // Each building shell is represented on the site: roofs are omitted to
 // preserve readability from the existing isometric camera.
 const entries=[];
 for(const zone of ZONES){
  if(zone.id==='yard'||zone.id==='loading')continue;
  const t=zone.type,x=zone.x,z=zone.z;
  const w=zone.id==='lactating'?17.2:(t==='feed'||t==='silage'?11:12.0),d=zone.id==='lactating'?12.0:(t==='storage'?9:10.8);
  box(root,x,.18,z,w,.34,d,C.siding);
  // Open-sided hall with corner poles, concrete ridge and named fascia.
  const facade=t==='calf'?C.yellow:t==='maternity'?C.clay:
    t==='feed'||t==='silage'?C.wood:t==='manure'?C.green:
    t==='storage'?C.blue:t==='office'?C.wood:C.steel;
  for(const dx of [-w/2+.34,w/2-.34]){
   for(const dz of [-d/2+.34,d/2-.34])box(root,x+dx,1.76,z+dz,.2,3.2,.2,facade);
   box(root,x+dx,2.94,z,.17,.13,d,facade);
  }
  for(const dz of [-d/2+.34,d/2-.34])box(root,x,2.94,z+dz,w,.15,.15,facade);
  box(root,x,3.12,z-.2,w*.72,.16,.35,facade);
  label(root,zone.name,zone.built?'原有精修｜可進入':zone.refined?'P0.6.8 精修｜可進入':'真實配置｜可進入',x,3.72,z,w*.72,0);
  // Enlarged lactating-barn facade with attached outdoor paddock.
  // This outdoor masterplan view is diagrammatic; its fully explorable
  // barn-and-yard scene has a larger independent playable footprint.
  if(zone.id==='lactating'){
   const bx=x-12.15;
   box(root,bx,.11,z,6.6,.12,11.6,C.field);
   box(root,bx,.17,z,5.9,.05,10.6,C.siding);
   for(const fx of [bx-3.25,bx+3.25])for(const fz of [z-5.8,z+5.8])
     box(root,fx,1.13,fz,.11,2.03,.11,C.wood);
   for(const yy of [.60,1.28]){
     box(root,bx-3.25,yy,z,.09,.09,11.55,C.wood);
     for(const zz of [z-5.8,z+5.8])box(root,bx,yy,zz,6.5,.09,.09,C.wood);
   }
   for(const px of [bx-1.72,bx+.9])for(const pz of [z-3.2,z-1.6]){
      box(root,px,1.3,pz,.12,2.45,.12,C.steel);
   }
   box(root,bx-.45,2.48,z-2.4,5.2,.14,3.6,C.straw);
   const drink=cy(root,bx+1.4,.46,z+3.0,.60,.62,.48,C.water,12);
   drink.name='Lactating outdoor exercise yard water';
   label(root,'戶外運動場','遮蔭・活動・飲水',bx,3.17,z+2.5,3.6,0);
  }
  // Entrance markers are physically anchored on the road-facing side;
  // do not require an imagined mouse-clickable map projection.
  const postX=zone.side<0?zone.x+w/2+.9:zone.x-w/2-.9;
  const postZ=z;
  box(root,postX,.10,postZ,1.8,.08,1.2,C.yellow);
  cy(root,postX,.75,postZ,.14,.16,1.3,facade,9);
  label(root,zone.name,'E：進入',postX,1.68,postZ,2.7,Math.PI/2);
  entries.push({id:'map-portal-'+zone.id,name:'進入'+zone.name,area:'farm',
    x:postX,z:postZ,r:2.1,travelTo:zone.id,zoneId:zone.id});
  // Farm compound types are clear from silhouettes, not yet finished content.
  const deco=new THREE.Group();deco.position.set(x,0,z);root.add(deco);
  if(['cows','maternity','calf'].includes(t)){
   for(const xx of [-2.7,0,2.7]){
    box(deco,xx,.50,0,.10,.65,7.3,C.steel);
    box(deco,xx,.74,0,.12,.10,7.3,C.steel);
   }
   if(t==='calf')for(let ix=-3;ix<=3;ix+=2)for(const zz of [-2,2])
     box(deco,ix,.50,zz,1.35,.42,1.9,C.wall);
   else for(const zz of [-2,0,2])box(deco,0,.27,zz,8.3,.24,.68,C.feed);
  }else if(t==='feed'){
   for(const xx of [-2.8,0,2.8])cy(deco,xx,1.35,0,.95,.95,2.45,C.steel);
  }else if(t==='silage'){
   for(const xx of [-2.4,2.4])box(deco,xx,.8,0,3.0,1.35,5.6,C.feed);
   for(const xx of [-2.4,2.4])box(deco,xx,1.50,-.9,3.2,.18,5.5,C.dark);
  }else if(t==='manure'){
   for(const xx of [-2.5,2.5])cy(deco,xx,.5,0,1.6,1.6,.75,C.clay);
  }else if(t==='machinery'){
   box(deco,0,1.0,0,3.25,1.3,1.7,C.blue);
   for(const xx of [-1.05,1.02])for(const zz of [-.85,.85])
    cy(deco,xx,.40,zz,.33,.33,.23,C.dark,8);
  }else if(t==='veterinary'){
   box(deco,0,1.2,0,2.9,1.8,1.4,C.wall);
   box(deco,0,2.45,0,1.5,.65,.3,C.green);
  }else if(t==='office'){
   box(deco,0,.90,0,4,.16,2,C.wood);
  }else if(t==='storage'){
   const storageCylinder=cy(deco,0,1.52,0,1.25,1.25,3.5,C.steel);
   storageCylinder.rotation.z=Math.PI/2;
  }else if(t==='milking'){
   for(const xx of [-1.8,1.8])for(let zi=-2;zi<=2;zi++)
    box(deco,xx,.57,zi*1.5,2,.28,1.25,C.siding);
  }
 }
 // Milk collection truck entrance and small forecourt.
 box(root,0,.06,-34.1,8,.08,7,C.road);
 const truck=new THREE.Group();truck.position.set(1.3,0,-35.4);root.add(truck);
 box(truck,-.5,.92,0,2.8,1.62,1.70,C.steel);
 box(truck,1.48,.90,0,1.05,1.5,1.6,C.blue);
 for(const x of [-1.48,.56,1.63])for(const zz of [-.84,.84]){
  const wheel=cy(truck,x,.38,zz,.37,.37,.17,C.dark,10);wheel.rotation.x=Math.PI/2;
 }
 label(root,'牧場入口','DAIRY 24HR · SITE',0,3.2,36.45,4.8);
 // Local skeletons: full-length walkway and recognizable, sparse equipment.
 // Previously completed parlor/tank/office retain their OWN existing scene models.
 for(const zone of ZONES){
  if(zone.built||['yard','loading'].includes(zone.id))continue;
  const g=new THREE.Group();g.name='SKELETON_INTERIOR_'+zone.id;g.visible=false;scene.add(g);
  interiors.set(zone.id,g);
  // Enlarged lactating barn + outdoor exercise yard own their custom footprint.
  // Do not leave the old 12.8×22 clone floor or low walls across the paddock.
  if(zone.id==='lactating')continue;
  box(g,0,-.15,0,12.8,.26,22,C.siding);
  box(g,0,.035,0,3.5,.03,20.8,C.lane);
  // Cattle housing uses open-sided steel frames; feed/silage have open
  // loading fronts; manure treatment is an unfenced-in roofless pad ONLY
  // until its own safety barriers are added by realistic-facilities.mjs.
  const openAir=['manure','silage'].includes(zone.type);
  const openShed=['feed','machinery'].includes(zone.type);
  if(!openAir){
    for(const x of [-6.05,6.05]){
      for(const z of [-8,0,8])box(g,x,1.90,z,.14,3.72,.14,C.steel);
      if(!openShed)box(g,x,.88,0,.16,1.65,18.2,C.wall);
    }
    box(g,0,3.35,-10.3,12.1,.12,.16,C.steel);
    if(!openShed)for(const x of [-4.65,4.65])
      box(g,x,1.0,10.3,2.5,1.95,.12,C.wall);
  }
  label(g,zone.name,'依現場配置重建',0,3.02,-9.95,4.0);
  label(g,'返回牧場中庭','E／地圖可返回',0,2.6,9.9,3.1);
  // P0.6.1: REMOVE the repeated generic boxes and placeholder machines.
  // Each facility is now rebuilt independently by realistic-facilities.mjs.
  // Shared floor, walls, working passage and entry still remain in this shell.

 }
 const skeletonStations=ZONES.filter(z=>interiors.has(z.id)).map(z=>({
  id:'skeleton-'+z.id,name:z.name+'｜空間配置',area:z.id,kind:'skeleton',
  x:-1.60,z:2.9,r:1.7
 }));
 return {root,interiors,entries,skeletonStations,
  visibleArea(id){
   root.visible=id==='farm';
   for(const [key,g] of interiors)g.visible=id===key;
  }
 };
}
