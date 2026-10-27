// DAIRY 24HR P0.5.7 — walkable, low-poly 3D bulk tank room and dairy office.
// Field-inspired illustrative assets, not dimensioned installation drawings.
export function createSupportRooms({THREE,scene,mobile=false}) {
 const mat=(hex,met=.0,rough=.74)=>new THREE.MeshStandardMaterial({color:hex,metalness:met,roughness:rough});
 const C={
  wall:mat(0xe3e8dc),tile:mat(0xb5c5bd),concrete:mat(0xa7b8b2),
  steel:mat(0xb4c7cd,.72,.29),chrome:mat(0xe2ebea,.78,.20),
  dark:mat(0x364c57,.12,.55),pipe:mat(0x518eaa,.44,.43),
  warm:mat(0xb68555),wood:mat(0xa77e56,.05,.68),
  paper:mat(0xf7f4e8),blue:mat(0x4b96af),green:mat(0x4ab69a),red:mat(0xc95f52),
  chair:mat(0x315266),rubber:mat(0x293940),yellow:mat(0xe3bf63)
 };
 const glow=new THREE.MeshBasicMaterial({color:0x63efc4}),off=new THREE.MeshBasicMaterial({color:0x4d6670});
 const cube=new THREE.BoxGeometry(1,1,1);
 const group=(root,name)=>{const g=new THREE.Group();g.name=name;root.add(g);return g};
 function box(g,x,y,z,w,h,d,m=C.steel) {
  const o=new THREE.Mesh(cube,m);o.position.set(x,y,z);o.scale.set(w,h,d);
  o.castShadow=!mobile&&w*h*d>.18;o.receiveShadow=!mobile;g.add(o);return o;
 }
 function cyl(g,x,y,z,top,bottom,h,m=C.steel,n=mobile?12:24) {
  const o=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,h,n),m);
  o.position.set(x,y,z);o.castShadow=!mobile&&top*bottom*h>.08;g.add(o);return o;
 }
 function orb(g,x,y,z,rx,ry,rz,m=C.chrome) {
  const o=new THREE.Mesh(new THREE.SphereGeometry(1,mobile?10:18,8),m);
  o.position.set(x,y,z);o.scale.set(rx,ry,rz);o.castShadow=!mobile;g.add(o);return o;
 }
 function pipe(g,coords,r=.045,m=C.pipe) {
  const c=new THREE.CatmullRomCurve3(coords.map(p=>new THREE.Vector3(...p)));
  const o=new THREE.Mesh(new THREE.TubeGeometry(c,mobile?12:22,r,mobile?5:7,false),m);
  g.add(o);return o;
 }
 function sign(g,heading,sub,x,y,z,w=2.5,angle=0) {
  const cv=document.createElement('canvas');cv.width=512;cv.height=160;
  const ctx=cv.getContext('2d');ctx.fillStyle='#193945';ctx.fillRect(0,0,512,160);
  ctx.strokeStyle='#d6bc79';ctx.lineWidth=7;ctx.strokeRect(4,4,504,152);
  ctx.textAlign='center';ctx.fillStyle='#fff8ea';ctx.font='bold 50px "Noto Sans TC",sans-serif';
  ctx.fillText(heading,256,73);ctx.fillStyle='#afd8d1';ctx.font='29px sans-serif';ctx.fillText(sub,256,122);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.3125),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));
  plane.position.set(x,y,z);plane.rotation.y=angle;g.add(plane);return plane;
 }
 function baseRoom(name,accent) {
  const root=group(scene,name);root.visible=false;
  // All walkable objects live on the sides; centre passage remains navigable.
  box(root,0,-.16,0,12.8,.3,21.7,C.concrete);
  box(root,0,.01,0,12.2,.06,21.1,C.tile);
  for(const x of [-6.05,6.05]){
    box(root,x,1.9,0,.25,3.8,20.9,C.wall);
    for(const z of [-8,-2,4,9])box(root,x,2.6,z,.28,.15,.11,accent);
  }
  box(root,0,1.9,-10.3,12.3,3.8,.22,C.wall);
  // South wall includes a clearly visible wide entry.
  for(const x of [-4.6,4.6])box(root,x,1.9,10.4,3.05,3.8,.23,C.wall);
  box(root,0,3.68,10.4,6.25,.25,.25,accent);
  for(const z of [-8,-2,4,8]){
    box(root,0,3.64,z,7.6,.13,.20,C.chrome);
    box(root,0,3.53,z,2.4,.065,.28,new THREE.MeshBasicMaterial({color:0xffedc3}));
  }
  box(root,-2.1,.034,0,.05,.025,20,C.yellow);
  box(root,2.1,.034,0,.05,.025,20,C.yellow);
  return root;
 }
 // BULK MILK TANK ROOM — horizontal insulated tank, sanitary pipe, display,
 // CIP/transfer inlet, wash sink and a secondary cooling unit.
 const storage=baseRoom('MILK STORAGE — walkthrough',C.pipe);
 sign(storage,'儲乳區','BULK MILK STORAGE',0,3.15,-9.99,3.8);
 const tank=group(storage,'Stainless double-wall bulk milk tank');
 const tankBody=cyl(tank,-4.0,1.54,-2.3,1.32,1.32,3.8,C.steel,24);
 tankBody.rotation.z=Math.PI/2;
 const endA=cyl(tank,-2.10,1.54,-2.3,1.28,1.28,.14,C.chrome,24);endA.rotation.z=Math.PI/2;
 const endB=cyl(tank,-5.90,1.54,-2.3,1.28,1.28,.14,C.chrome,24);endB.rotation.z=Math.PI/2;
 for(const x of [-5.28,-2.60]){
  box(tank,x,.46,-2.7,.28,.52,.30,C.dark);
  box(tank,x,.46,-1.92,.28,.52,.30,C.dark);
 }
 // Sight glass, hinged sanitary inspection hatch and cleaning circuit.
 cyl(tank,-3.62,2.88,-2.3,.44,.45,.12,C.chrome,18);
 box(tank,-3.63,3.04,-2.3,.65,.06,.10,C.dark);
 pipe(storage,[[-3.63,3.0,-2.3],[-3.6,3.34,-2.3],[-3.2,3.39,-2.3],[-3.2,3.14,-1.1]],.08,C.pipe);
 pipe(storage,[[-1.66,1.36,-2.3],[-1.28,1.36,-2.3],[-1.28,2.65,-2.3],[-.95,2.65,-2.3]],.065,C.chrome);
 const outlet=cyl(storage,-1.44,.70,-2.35,.15,.15,.22,C.dark,12);outlet.rotation.z=Math.PI/2;
 for(let i=0;i<7;i++)box(tank,-4.75+i*.30,1.6,-.95,.055,.045,.06,i%2?C.steel:C.chrome);
 sign(storage,'保溫儲乳槽','示意模型・非即時量測',-3.4,3.36,.18,3.0);
 // Local milk temperature display, intentionally marked as a sample.
 const display=group(storage,'Bulk tank sample readout');display.position.set(2.25,0,-5.45);
 box(display,0,1.7,0,.7,1.4,.58,C.dark);
 box(display,0,2.03,.315,.61,.38,.045,C.pipe);
 sign(display,'3.8°C','模擬溫度｜非即時',0,2.04,.344,.70);
 const tempLamp=box(display,-.20,1.57,.315,.12,.07,.04,C.green);
 box(display,.06,1.57,.315,.12,.07,.04,C.yellow);
 // Maintenance/refrigeration compressor on right side.
 const chiller=group(storage,'Milk refrigeration unit');chiller.position.set(3.55,0,-3.7);
 box(chiller,0,.82,0,2.0,1.55,1.7,C.dark);
 box(chiller,0,.83,.89,1.66,1.16,.08,C.chrome);
 const fan=cyl(chiller,0,.83,.97,.45,.45,.055,C.pipe,18);fan.rotation.x=Math.PI/2;
 for(let i=-3;i<=3;i++)box(chiller,i*.22,.83,.99,.065,1.1,.035,C.dark);
 pipe(storage,[[3.2,1.38,-3.68],[2.70,1.38,-3.68],[2.70,2.15,-3.68],[1.9,2.15,-3.68]],.05,C.chrome);
 // Food-grade hose rack, clean wash sink, floor drainage (illustration).
 const sink=group(storage,'Handwash and sanitation station');sink.position.set(3.1,0,3.6);
 box(sink,0,1.12,0,1.55,.25,.89,C.chrome);
 box(sink,0,.72,0,1.32,.58,.59,C.steel);
 box(sink,.05,1.23,0,.95,.09,.65,C.dark);
 pipe(sink,[[.17,1.28,-.25],[.17,1.66,-.25],[.02,1.70,-.25],[.02,1.52,-.04]],.036,C.chrome);
 for(let i=0;i<9;i++)box(storage,-.38+i*.09,.06,4.1,.06,.02,.85,C.dark);
 sign(storage,'設備與清潔用品','管線・溫控・清洗連接',3.2,2.70,2.75,2.55);
 // Milk tanker delivery point visible through open loading frontage.
 box(storage,-3.65,.10,7.6,3.6,.16,2.2,C.concrete);
 for(const x of [-5.25,-2.1])box(storage,x,.85,7.6,.11,1.6,.10,C.yellow);
 sign(storage,'出乳口','僅展示接管位置',-3.60,2.52,7.75,2.1);
 sign(storage,'返回榨乳室','EXIT TO PARLOR',0,2.62,9.82,3);
 // Management office — staff workstations, shift log, records and
 // observation screens, but NO invented real farm records or milk quality.
 const office=baseRoom('FARM OFFICE — walkthrough',C.wood);
 // Replace cold industrial floor with office flooring at a slightly higher level.
 box(office,0,.073,0,11.9,.10,20.2,C.wood);
 box(office,0,.125,0,3.80,.018,20,C.tile);
 sign(office,'牧場管理室','DAIRY FARM OFFICE',0,3.10,-9.99,3.85);
 // Wall-mounted planning whiteboard with intentionally generic tasks.
 box(office,-3.4,2.35,-7.85,3.6,1.62,.13,C.chrome);
 sign(office,'今日工作','牛號核對・擠乳紀錄',-3.4,2.44,-7.73,3.15);
 sign(office,'交班備忘','確認設備・整理紀錄',-3.40,1.73,-7.7,2.65);
 // A realistic multi-person workspace: desk, two monitors and chair.
 const workstation=group(office,'Management computer desk');workstation.position.x=-.55;
 box(workstation,-3.18,1.05,-3.1,3.45,.16,1.46,C.wood);
 for(const x of [-4.70,-1.72])for(const z of [-3.70,-2.55])
  box(workstation,x,.52,z,.12,1,.12,C.steel);
 for(const x of [-4.0,-2.8]){
  box(workstation,x,1.85,-3.43,1.05,.69,.14,C.dark);
  box(workstation,x,1.86,-3.348,.90,.52,.026,C.pipe);
  box(workstation,x,1.37,-3.43,.08,.35,.07,C.chrome);
  box(workstation,x,1.19,-2.96,.62,.045,.23,C.dark);
 }
 sign(workstation,'當班作業','紀錄查詢・值班日誌',-3.40,2.56,-3.30,2.65);
 // Additional desk/folder/printer and shelves.
 box(workstation,-2.05,1.24,-2.72,.51,.12,.35,C.paper);
 for(let i=0;i<5;i++)box(workstation,-3.48+i*.22,1.18,-2.49,.06,.024,.35,C.paper);
 const chair=group(office,'Staff ergonomic chair');
 box(chair,-3.12,.72,-1.75,.92,.15,.84,C.chair);
 box(chair,-3.12,1.19,-1.34,.90,1.1,.18,C.chair);
 box(chair,-3.12,.38,-1.75,.12,.63,.12,C.dark);
 for(const x of [-.40,.40])for(const z of [-.36,.36])
  box(chair,-3.12+x,.16,-1.75+z,.08,.12,.09,C.rubber);
 const filing=group(office,'Paper records archive');
 for(const z of [1.25,3.55]){
  box(filing,-4.65,1.18,z,1.8,2.30,1.03,C.steel);
  for(let k=0;k<3;k++){
   box(filing,-3.685,.56+k*.67,z, .08,.48,.69,C.dark);
   box(filing,-3.635,.58+k*.67,z,.026,.07,.13,C.chrome);
  }
 }
 sign(office,'紀錄櫃','DHI・乳量・作業單',-4.0,2.88,3.56,2.75);
 // Three CCTV/monitor wall screens with non-live symbolic displays.
 const screens=group(office,'Barn overview screens');screens.position.x=.25;
 for(const [i,x] of [[0,2.25],[1,3.54],[2,4.83]]){
  box(screens,x,2.35,-7.75,1.16,.75,.16,C.dark);
  box(screens,x,2.35,-7.64,.99,.56,.02,i===2?C.green:C.pipe);
  box(screens,x,2.00,-7.70,.46,.035,.03,C.chrome);
 }
 sign(office,'牧場監控','示意畫面・非即時',3.50,3.12,-7.58,2.9);
 const meeting=group(office,'Shift handover table');meeting.position.x=.30;
 box(meeting,3.43,.90,.8,3.15,.17,2.02,C.wood);
 for(const x of [2.22,4.62])for(const z of [-0.06,1.60])
  box(meeting,x,.45,z,.11,.88,.11,C.steel);
 box(meeting,3.12,1.03,.60,.62,.045,.44,C.paper);
 box(meeting,3.91,1.03,.60,.32,.13,.30,C.dark);
 for(const x of [2.10,4.82]){
  box(meeting,x,.65,.82,.65,.12,.80,C.chair);
  box(meeting,x,1.00,1.26,.67,.78,.12,C.chair);
 }
 // Calendar on the far wall, familiar rural office decoration.
 box(office,4.67,2.18,4.53,1.62,1.13,.08,C.paper);
 sign(office,'值班表','早班・中班・晚班',4.68,2.20,4.60,1.58);
 sign(office,'回到榨乳室','EXIT TO PARLOR',0,2.62,9.82,3);
 let blink=0;
 function animate(time){
   const next=Math.floor(time*1.5);
   if(next!==blink){
    blink=next;
    tempLamp.material=next%2?glow:off;
   }
 }
 const interactions={
  tank:[
   {id:'bulk-tank',name:'不鏽鋼儲乳槽',x:-1.65,z:-2.4,kind:'bulk-tank'},
   {id:'milk-temp',name:'儲乳溫度面板',x:1.65,z:-5.4,kind:'milk-temp'},
   {id:'milk-chiller',name:'冷卻與壓縮機',x:1.70,z:-4.2,kind:'milk-chiller'},
   {id:'milk-sink',name:'清洗與衛生台',x:1.5,z:3.6,kind:'milk-sink'},
   {id:'milk-loading',name:'集乳車接乳口',x:-1.25,z:7.6,kind:'milk-loading'},
   {id:'return-tank',name:'返回榨乳室',x:0,z:9.05,travelTo:'parlor'}
  ],
  office:[
   {id:'office-desk',name:'管理電腦與值班紀錄',x:-1.62,z:-3.1,kind:'office-desk'},
   {id:'office-whiteboard',name:'今日作業白板',x:-1.64,z:-7.8,kind:'office-whiteboard'},
   {id:'office-monitor',name:'牧場畫面總覽',x:1.75,z:-7.7,kind:'office-monitor'},
   {id:'office-records',name:'紀錄文件櫃',x:-1.59,z:3.0,kind:'office-records'},
   {id:'office-handover',name:'交班桌',x:1.70,z:.8,kind:'office-handover'},
   {id:'return-office',name:'返回榨乳室',x:0,z:9.05,travelTo:'parlor'}
  ]
 };
 return {storage,office,animate,interactions};
}
