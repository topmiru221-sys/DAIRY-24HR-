// DAIRY 24HR P0.6.0 — working visual identities for ALL eleven new farm zones.
// These are fictional low-poly, self-contained farm scenes, not veterinary SOP,
// operational measurements or an equipment manufacturer's installation guide.
export const CONTENT_AREAS=Object.freeze([
 'lactating','dry','closeup','fresh','calf','heifer','feed','silage',
 'veterinary','manure','machinery'
]);
export const CONTENT_SPEC=Object.freeze({
 lactating:{
  name:'泌乳牛舍',summary:'牛群休息、採食與飲水的區域',
  spots:[
   ['milk-feed','飼槽與日糧','工作人員剛巡過飼槽，看看有沒有足夠的飼料空間。','想觀察採食就站在走道邊，先不要打擾乳牛。'],
   ['milk-water','飲水槽','這是牛隻日常飲水的位置。水位與清潔需要現場巡查。','水槽有固定位置，檢查時要能接近和清洗。'],
   ['milk-rest','牛床休息區','牛群有安靜躺臥的空間；現在這頭在休息。','這裡的牛床模型主要展示走道與躺臥配置。']
  ]},
 dry:{
  name:'乾乳牛舍',summary:'乾乳牛分群、休息與進入待產前的生活環境',
  spots:[
   ['dry-group','乾乳牛分群區','乾乳期也要維持正常採食、飲水與舒適環境。','不同群別的安排要看牧場實際分群計畫。'],
   ['dry-rest','乾乳牛床','這裡是較安靜的休息牛床，牛隻正在緩緩活動。','牛床的尺寸和密度在真實牧場需要另行評估。'],
   ['dry-trough','乾乳牛飼槽','乾乳牛配方和泌乳牛不一樣；這裡先呈現飼槽的配置。','場景模型不代表實際日糧或投料公斤數。']
  ]},
 closeup:{
  name:'待產 Close-up 區',summary:'產前牛隻觀察、待產牛欄與乾淨墊料',
  spots:[
   ['close-pen','待產牛欄','待產牛隻在較安靜的環境中休息，工作人員定時巡視。','這裡展示的是待產動線與牛欄，不預設有難產。'],
   ['close-bed','產房墊料','產房整理後的墊料保持乾燥、乾淨，方便牛隻休息。','墊料衛生與更換方式仍需依牧場實際制度。'],
   ['close-board','待產觀察板','觀察板記錄牛隻狀態，但這一版沒有虛構生產日期或健康數據。','詳細待產觀察劇情會在地圖內容完成後再補。']
  ]},
 fresh:{
  name:'產後 Fresh 區',summary:'產後牛隻休息、採食與工作人員的日常巡視',
  spots:[
   ['fresh-pen','產後觀察牛欄','這排產後牛正在休息，員工會在通道邊查看牠們的活動。','產後沒有一定會生病，今天先呈現平常的觀察。'],
   ['fresh-water','產後飲水區','牛隻可以就近取水，這裡有固定飲水設備與清潔通道。','看水槽的位置，也留意工作通道能不能走。'],
   ['fresh-board','Fresh 工作紀錄','這裡展示觀察記錄板，但沒有生成任何個別牛隻的診斷資料。','之後可加入日常進食、反芻與環境觀察的遊戲情節。']
  ]},
 calf:{
  name:'犢牛舍',summary:'分欄育犢、餵奶準備、飲水與環境管理',
  spots:[
   ['calf-pen','犢牛欄','小犢牛在自己的欄位裡站起來、回頭看看。','先觀察環境與動作，不要因為一個畫面就判斷健康問題。'],
   ['calf-milk','餵乳準備台','乾淨的餵乳器具與工具放在這裡，方便照工作順序準備。','這是遊戲道具，不是具體的代奶配製比例示範。'],
   ['calf-water','犢牛飲水','犢牛欄旁安排水桶和飼料桶，便於員工巡查。','不同年齡的飼餵方式會等到玩法階段另行設計。']
  ]},
 heifer:{
  name:'育成牛舍',summary:'育成牛分欄、日常採食與成長紀錄',
  spots:[
   ['heifer-group','育成牛欄','育成牛在自己的欄位裡活動，與犢牛舍的空間明顯不同。','這一版先表現分齡空間，還沒加入真實體尺數據。'],
   ['heifer-measure','體尺量測位置','牆邊有體尺量測位置，日後可做成玩家參與的工作。','沒有牛隻的實際體高與體重紀錄。'],
   ['heifer-feed','育成牛飼槽','飼槽沿著牛欄排列，留有巡場通道。','不同階段的營養需求會在故事擴充時再設計。']
  ]},
 feed:{
  name:'TMR 調製／飼料中心',summary:'原料料倉、TMR 攪拌車與現場裝料動線',
  spots:[
   ['feed-bins','原料料倉','幾個主要原料料倉已經定位，裝料順序的玩法之後再補。','現階段不提供配方公斤數或營養判定。'],
   ['feed-mixer','TMR 攪拌車','攪拌車可以看到槽身、攪拌軸與車輪，工作區留有通道。','攪拌動畫只是設備示意，不能當作真實操作時間。'],
   ['feed-scale','秤重顯示器','這裡有秤重設備的示意面板，但不顯示虛構的實際配方。','稍後可加入裝料與核對原料的互動。']
  ]},
 silage:{
  name:'青貯與乾草儲區',summary:'青貯窖、覆蓋布、乾草堆與堆料設備',
  spots:[
   ['silage-bunker','青貯窖','青貯窖有擋牆、飼料堆與覆蓋布，方便辨認貯存方式。','展示布局，不提供取料深度或乾物率的假數值。'],
   ['silage-bales','乾草捆','草捆放在較高且有遮蔽的位置，與青貯窖分開。','注意乾草堆和車道之間留有工作空間。'],
   ['silage-loader','鏟裝機','鏟裝機停在側邊，方便對照日後的飼料取料動線。','目前只有簡單設備動作，不會自動執行取料。']
  ]},
 veterinary:{
  name:'隔離與獸醫處置區',summary:'獨立牛欄、工作用品與衛生門檻',
  spots:[
   ['vet-pen','獨立牛欄','這邊的牛欄有獨立通道，與其他牛群區分開來。','沒有預設牛隻生病，也沒有自動給藥劇情。'],
   ['vet-sink','洗手與衛生用品','可看到洗手槽與衛生用品架，提醒進出時注意清潔動線。','實際消毒程序必須由牧場現場制定。'],
   ['vet-record','作業紀錄桌','紀錄桌上放有空白表單，供未來劇情記錄使用。','這一版不產生虛構病歷、抗生素或停藥期。']
  ]},
 manure:{
  name:'糞污及廢水處理區',summary:'固液分離、處理池、泵浦與後勤動線',
  spots:[
   ['manure-sep','固液分離設備','這裡放著固液分離設備，讓玩家看得出糞污處理的工作流程。','設備運轉只是視覺化示意。'],
   ['manure-pond','廢水處理池','處理池與通道分隔，不會讓玩家走進池內。','示意池沒有實際水質或放流水監測數據。'],
   ['manure-pump','處理泵浦','泵浦和配管在側邊，方便日後擴充巡檢故事。','現在沒有設備故障事件或操作設定。']
  ]},
 machinery:{
  name:'農機與維修區',summary:'曳引機、工具牆、機具保養與停車空間',
  spots:[
   ['machine-tractor','曳引機','曳引機已停在維修區，能看見車身、駕駛座與輪胎。','未來可以再加入駕駛與作業路線。'],
   ['machine-tools','工具牆','維修工具與零件按區域放置，這裡適合後續加入收納互動。','目前沒有真實機具維修指示。'],
   ['machine-work','維修工作台','工作台上放著待整理的常用器具，留有移動空間。','這只是日常工作場景，不預設機械故障。']
  ]}
});
export function populateFarmContents({THREE,master,mobile=false}){
 const mat=(color,metalness=0,roughness=.74)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const C={
  hide:mat(0xe9e7dd),black:mat(0x292e2f),nose:mat(0xe0a9a1),hoof:mat(0x4b4d49),
  yellow:mat(0xe0bb70),green:mat(0x668d67),blue:mat(0x589aac),milk:mat(0xf6f2e4),
  steel:mat(0xa7bbc1,.46,.39),chrome:mat(0xd1dddc,.58,.29),rubber:mat(0x394246),
  straw:mat(0xc5a869),hay:mat(0x98764b),feed:mat(0x82785c),wall:mat(0xc4c8bd),
  wood:mat(0x9b7653),floor:mat(0xb9c8bf),red:mat(0xaf6b54),water:mat(0x5195a7,.15,.45),
  screen:new THREE.MeshBasicMaterial({color:0x1f687c}),
  light:new THREE.MeshBasicMaterial({color:0x75e0bc})
 };
 const cube=new THREE.BoxGeometry(1,1,1);
 const cylinders=new Map(),sphere=new THREE.SphereGeometry(1,mobile?8:12,mobile?6:8);
 const group=(parent,name,x=0,y=0,z=0)=>{
  const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g;
 };
 function box(g,x,y,z,w,h,d,m=C.steel){
  const o=new THREE.Mesh(cube,m);o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=!mobile&&w*h*d>.32;g.add(o);return o;
 }
 function cyl(g,x,y,z,rt,rb,h,m=C.steel,n=mobile?9:13){
  const k=[rt,rb,h,n].join(':');if(!cylinders.has(k))cylinders.set(k,new THREE.CylinderGeometry(rt,rb,h,n));
  const o=new THREE.Mesh(cylinders.get(k),m);o.position.set(x,y,z);g.add(o);return o;
 }
 function ball(g,x,y,z,w,h,d,m=C.hide){
  const o=new THREE.Mesh(sphere,m);o.position.set(x,y,z);o.scale.set(w,h,d);g.add(o);return o;
 }
 function sign(g,heading,detail,x,y,z,w=2.3){
  const cv=document.createElement('canvas');cv.width=512;cv.height=140;
  const ctx=cv.getContext('2d');ctx.fillStyle='#173d4a';ctx.fillRect(0,0,512,140);
  ctx.strokeStyle='#e5c477';ctx.lineWidth=6;ctx.strokeRect(3,3,506,134);
  ctx.textAlign='center';ctx.fillStyle='#fff4dc';ctx.font='bold 40px "Noto Sans TC",sans-serif';
  ctx.fillText(heading,256,62);ctx.fillStyle='#c1e2e2';ctx.font='24px "Noto Sans TC",sans-serif';
  ctx.fillText(detail,256,107);
  const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;
  const face=new THREE.Mesh(new THREE.PlaneGeometry(w,w*.274),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
  face.position.set(x,y,z);g.add(face);
 }
 const animations=[],stations=[],counts={};
 const areaAnimations=new Map();let addingToZone=null;
 function addAnimation(fn){animations.push(fn);if(!areaAnimations.has(addingToZone))areaAnimations.set(addingToZone,[]);areaAnimations.get(addingToZone).push(fn)}
 function cow(g,x,z,index,scale=1){
  const a=group(g,'Farm cow '+index,x,.13,z);a.scale.set(scale,scale,scale);
  a.rotation.y=index%2?0:Math.PI;
  const body=group(a,'Cow body');
  box(body,0,1.02,0,1.45,.88,.88,C.hide);
  box(body,-.15,1.26,-.39,.69,.26,.12,C.black);
  box(body,-.3,1.08,.43,.43,.39,.13,C.black);
  const head=group(a,'Animated cow head',.89,1.19,0);
  box(head,.12,.05,0,.54,.54,.50,C.hide);
  box(head,.40,-.10,0,.36,.24,.45,C.nose);
  box(head,.25,.14,-.26,.12,.11,.07,C.black);box(head,.25,.14,.26,.12,.11,.07,C.black);
  for(const side of [-1,1])box(head,-.08,.31,side*.29,.25,.13,.14,C.hide);
  const legs=[];
  for(const xx of [-.51,.52])for(const zz of [-.30,.30]){
   const limb=group(a,'Moving hoof',xx,.66,zz);
   box(limb,0,-.28,0,.19,.56,.22,C.hide);
   box(limb,.02,-.52,0,.23,.13,.25,C.hoof);legs.push(limb);
  }
  const tail=group(a,'Swaying tail',-.85,1.34,0);
  box(tail,-.15,-.25,0,.10,.51,.09,C.hide);
  box(tail,-.19,-.46,0,.14,.16,.13,C.black);
  addAnimation(t=>{
   head.rotation.z=.034*Math.sin(t*.74+index);head.position.y=1.19+.016*Math.sin(t*1.1+index);
   tail.rotation.x=.18*Math.sin(t*1.35+index);
   a.position.y=.13+.008*Math.sin(t*1.15+index);
   for(let k=0;k<legs.length;k++)legs[k].rotation.z=.012*Math.sin(t*.74+index+k);
  });
  return a;
 }
 function bin(g,x,z,h=2.0){
  cyl(g,x,h*.5,z,.58,.64,h,C.steel);
  cyl(g,x,h+.1,z,.62,.62,.13,C.chrome);
  for(const zz of [-.34,.34])box(g,x,.35,z+zz,.10,.70,.10,C.steel);
 }
 function trough(g,x,z,length=2.7){
  box(g,x,.39,z,1.0,.38,length,C.chrome);
  box(g,x,.64,z,.93,.15,length-.20,C.feed);
 }
 function water(g,x,z){
  box(g,x,.50,z,.95,.65,1.30,C.steel);
  box(g,x,.84,z,.85,.10,1.16,C.water);
 }
 function info(g,heading,sub){sign(g,heading,sub,0,2.70,-9.3,3.25)}
 function register(area,id,name,text,alternate,x,z){
  stations.push({id,name,area,kind:'field-content',x,z,r:1.74,text,alternate});
 }
 function decorateBarn(g,area,young=false){
  const si=young?.62:area==='heifer'?.78:1;
  for(let i=0;i<6;i++){
   const side=i%2?-1:1,zz=-6+Math.floor(i/2)*4.2;
   const xx=side*4.35;
   cow(g,xx,zz,i+(area.length*2),si);
  }
  for(const zz of [-6,-1.8,2.4]){
   trough(g,-5.05,zz,2.7);water(g,5.25,zz+1.3);
  }
  for(const xx of [-5.4,5.4]){
   for(const zz of [-6.8,-2.4,2.0,6.6])box(g,xx,1.55,zz,.09,2.2,.12,C.steel);
  }
  register(area,CONTENT_SPEC[area].spots[0][0],CONTENT_SPEC[area].spots[0][1],CONTENT_SPEC[area].spots[0][2],CONTENT_SPEC[area].spots[0][3],-1.54,-5.9);
  register(area,CONTENT_SPEC[area].spots[1][0],CONTENT_SPEC[area].spots[1][1],CONTENT_SPEC[area].spots[1][2],CONTENT_SPEC[area].spots[1][3],1.54,-1.6);
  register(area,CONTENT_SPEC[area].spots[2][0],CONTENT_SPEC[area].spots[2][1],CONTENT_SPEC[area].spots[2][2],CONTENT_SPEC[area].spots[2][3],-1.54,3.4);
 }
 for(const id of CONTENT_AREAS){
  const g=master.interiors.get(id);if(!g)throw Error('Missing room shell: '+id);
  addingToZone=id;
  counts[id]=0;
  const start=stations.length, p=CONTENT_SPEC[id];
  const built=group(g,'P060 real scene content — '+id);
  info(built,p.name,'遊戲場景 · 日常作業');
  if(['lactating','dry','closeup','fresh','heifer'].includes(id)){
   decorateBarn(built,id);
   if(['closeup','fresh'].includes(id)){
    box(built,4.90,2.03,-8,1.35,1.0,.13,C.wall);
    sign(built,'觀察紀錄','示意・非即時',4.9,2.13,-7.91,1.30);
    for(const zz of [-6,-1.8,2.4])box(built,5.26,.23,zz,.95,.16,2.45,C.straw);
   }else if(id==='heifer'){
    box(built,5.45,1.25,5.9,.10,2.50,.15,C.yellow);
    for(let i=0;i<5;i++)box(built,5.49,.25+i*.37,5.9,.07,.027,.10,C.black);
   }
  }else if(id==='calf'){
   for(let i=0;i<6;i++){
    const side=i%2?-1:1,zz=-6+Math.floor(i/2)*4.2;
    const x=side*4.25;
    box(built,x,.26,zz,2.75,.19,3.1,C.straw);
    for(const dx of [-1.22,1.22])box(built,x+dx,.60,zz,.10,.73,2.95,C.steel);
    for(const dz of [-1.4,1.4])box(built,x,.6,zz+dz,2.5,.72,.10,C.steel);
    cow(built,x,zz,i+80,.43);
    cyl(built,side*2.85,.36,zz+.85,.27,.25,.35,C.water);
    cyl(built,side*3.12,.30,zz-.85,.24,.23,.26,C.feed);
   }
   const prep=group(built,'Calf feeding prep',-4.4,0,6.4);
   box(prep,0,1.15,0,2.4,.15,1.2,C.chrome);
   for(const dx of [-1.0,1.0])box(prep,dx,.6,0,.10,1.06,.10,C.steel);
   for(const dx of [-.75,.20,.90])cyl(prep,dx,1.36,-.13,.20,.20,.39,C.milk);
   for(let i=0;i<3;i++)register(id,p.spots[i][0],p.spots[i][1],p.spots[i][2],p.spots[i][3],i===1?-1.45:1.45,[-5.9,6.45,1.1][i]);
  }else if(id==='feed'){
   for(const xx of [-4.95,-3.5,-2.15])bin(built,xx,-5,2.7);
   const mixer=group(built,'TMR mixer',4.45,0,-2.1);
   box(mixer,0,1.3,0,2.4,1.3,3.6,C.blue);
   box(mixer,0,1.9,0,2.18,.2,3.30,C.chrome);
   for(const zz of [-1.28,1.25])for(const xx of [-1.15,1.15]){
    const wheel=cyl(mixer,xx,.48,zz,.43,.43,.26,C.rubber,12);wheel.rotation.z=Math.PI/2;
   }
   const auger=group(mixer,'Rotating auger',0,1.95,0);
   for(let n=0;n<3;n++)box(auger,-.7+n*.7,0,0,.50,.14,.13,C.chrome);
   addAnimation(t=>{auger.rotation.y=t*.12});
   const screen=group(built,'TMR scale panel',-4.5,1.7,2.4);
   box(screen,0,.30,0,1.0,.76,.24,C.steel);
   box(screen,0,.31,.14,.80,.50,.04,C.screen);
   sign(built,'TMR 工作區','原料・攪拌・秤重',0,2.47,-8.6,2.8);
   register(id,p.spots[0][0],p.spots[0][1],p.spots[0][2],p.spots[0][3],-1.45,-5);
   register(id,p.spots[1][0],p.spots[1][1],p.spots[1][2],p.spots[1][3],1.45,-2.1);
   register(id,p.spots[2][0],p.spots[2][1],p.spots[2][2],p.spots[2][3],-1.45,2.4);
  }else if(id==='silage'){
   for(const x of [-4.35,4.35]){
    box(built,x,.75,-4,2.7,1.3,6.1,C.wall);
    box(built,x,1.45,-4,2.4,.30,5.85,C.feed);
    box(built,x,1.64,-5,2.42,.065,3.15,C.green);
   }
   for(const x of [-5,-3.7,3.7,5])for(const zz of [1.5,3.0,4.5]){
    cyl(built,x,.56,zz,.54,.54,1.08,C.straw,11);
   }
   const loader=group(built,'Telehandler',-4.3,0,7.2);
   box(loader,0,1.01,0,2.20,1.10,1.75,C.yellow);
   for(const zz of [-.78,.78]){const wheel=cyl(loader,0,.42,zz,.42,.42,.32,C.rubber);wheel.rotation.x=Math.PI/2}
   box(loader,1.40,1.20,0,1.85,.20,.25,C.steel);
   box(loader,2.40,.69,0,.18,1.00,1.15,C.steel);
   register(id,p.spots[0][0],p.spots[0][1],p.spots[0][2],p.spots[0][3],-1.45,-4.2);
   register(id,p.spots[1][0],p.spots[1][1],p.spots[1][2],p.spots[1][3],1.45,3.4);
   register(id,p.spots[2][0],p.spots[2][1],p.spots[2][2],p.spots[2][3],-1.45,7.1);
  }else if(id==='veterinary'){
   for(const zz of [-6,-1,3.5]){
    box(built,-4.35,.45,zz,2.75,.24,3.05,C.straw);
    for(const xx of [-5.5,-3.20])box(built,xx,.86,zz,.13,1.28,3.0,C.steel);
   }
   const wash=group(built,'Wash station',4.3,0,-5.9);
   box(wash,0,1.10,0,2.25,.18,1.15,C.chrome);
   box(wash,0,.76,0,1.90,.54,.76,C.steel);
   cyl(wash,-.4,1.30,-.20,.14,.14,.18,C.blue);
   const desk=group(built,'Empty forms',4.2,0,3.5);
   box(desk,0,1.00,0,2.20,.16,1.45,C.wood);
   for(const xx of [-.89,.89])box(desk,xx,.5,0,.11,.91,.12,C.steel);
   for(let n=0;n<3;n++)box(desk,-.2,1.13+n*.025,0,1.14,.025,.76,C.milk);
   for(let i=0;i<3;i++)register(id,p.spots[i][0],p.spots[i][1],p.spots[i][2],p.spots[i][3],i===0?-1.48:1.47,[-5.8,-5.8,3.5][i]);
  }else if(id==='manure'){
   for(const xx of [-4.35,4.35]){
    const pond=group(built,'Wastewater treatment containment',xx,0,-4.0);
    cyl(pond,0,.50,0,1.55,1.55,.92,C.steel);
    cyl(pond,0,1.0,0,1.39,1.39,.09,C.water);
    for(const pz of [-1.8,1.8])box(pond,0,1.18,pz,3.5,.30,.18,C.yellow);
   }
   const separator=group(built,'Solid-liquid separator',-4.25,0,4.0);
   box(separator,0,1.35,0,2.50,1.35,1.35,C.steel);
   const rotor=cyl(separator,0,1.48,0,.54,.54,1.48,C.chrome,12);rotor.rotation.z=Math.PI/2;
   addAnimation(t=>{rotor.rotation.x=t*.24});
   const motor=group(built,'Wastewater pump',4.40,0,4.0);
   cyl(motor,0,.73,0,.50,.50,1.10,C.blue);
   box(motor,0,.16,0,1.4,.25,1.25,C.steel);
   for(let i=0;i<3;i++)register(id,p.spots[i][0],p.spots[i][1],p.spots[i][2],p.spots[i][3],i===1?1.45:i===2?1.45:-1.45,[-4,4,4][i]);
  }else if(id==='machinery'){
   const tractor=group(built,'Tractor in repair shed',-4.25,0,-3.7);
   box(tractor,0,1.12,0,2.35,1.35,3.25,C.blue);
   box(tractor,0,2.07,-.8,1.60,.80,1.25,C.chrome);
   box(tractor,0,2.44,-.8,1.8,.14,1.52,C.steel);
   for(const xx of [-1.12,1.12])for(const zz of [-1.15,1.15]){
    const wheel=cyl(tractor,xx,.5,zz,.57,.57,.24,C.rubber,12);wheel.rotation.z=Math.PI/2;
   }
   const wall=group(built,'Maintenance tool wall',4.45,0,-5.3);
   box(wall,0,1.45,0,2.65,1.72,.18,C.wood);
   for(let i=0;i<8;i++){
    box(wall,-1.06+(i%4)*.70,1.10+Math.floor(i/4)*.60,.13,.09,.30,.06,C.chrome);
   }
   box(built,4.35,1.12,3.35,2.6,.19,1.62,C.wood);
   for(const x of [3.3,5.4])box(built,x,.56,3.4,.10,1.05,.13,C.steel);
   cyl(built,4.55,1.36,3.35,.32,.32,.35,C.steel);
   for(let i=0;i<3;i++)register(id,p.spots[i][0],p.spots[i][1],p.spots[i][2],p.spots[i][3],i===0?-1.45:1.45,[-3.7,-5.2,3.4][i]);
  }
  counts[id]=stations.length-start;
 }
 function animate(time,area){
  if(!Number.isFinite(time))return;
  const active=area?areaAnimations.get(area)||[]:animations;
  for(const cb of active)cb(time);
 }
 return {stations,animate,counts,totalProps:animations.length,areas:CONTENT_AREAS};
}
