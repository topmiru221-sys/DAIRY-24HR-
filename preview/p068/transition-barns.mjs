// DAIRY 24HR P0.6.8 — dry-cow and close-up barn refinement.
// All values and indicators are game-state labels, not veterinary measurements.
export const TRANSITION_BARN_AREAS=Object.freeze(['dry','closeup']);

export const TRANSITION_BARN_POINTS=Object.freeze({
 dry:Object.freeze([
  {id:'dry-groups',name:'乾乳牛分群欄與深墊料',x:-1.48,z:-5.7,text:'乾乳牛依管理階段分區；深墊料區、採食線、飲水與巡視通道彼此清楚分開。'},
  {id:'dry-feed',name:'乾乳牛專用採食前緣',x:1.48,z:-1.1,text:'飼槽保留足夠站位並呈現獨立日糧外觀；本遊戲不提供真實配方或餵量。'},
  {id:'dry-water',name:'雙側飲水與防滑巡視區',x:-1.48,z:5.8,text:'兩側設飲水槽與排水格柵，中央通道保持暢通，方便日常觀察。'},
  {id:'dry-gate',name:'乾乳牛分群活動門',x:1.48,z:2.7,text:'活動門可切換開關，示意分群動線；不模擬真實牛群驅趕或夾傷防護。'},
  {id:'dry-brush',name:'牛體刷與休息行為',x:-1.48,z:.8,text:'牛體刷與臥下反芻動畫讓休息區更有生活感；並非健康狀態判定。'}
 ]),
 closeup:Object.freeze([
  {id:'closeup-group',name:'Close-up 待產牛群',x:-1.48,z:-5.7,text:'待產牛群使用安靜、乾爽的深墊料區，與一般泌乳牛舍分開。'},
  {id:'closeup-pens',name:'兩間獨立產房',x:1.48,z:2.8,text:'兩間可視、可清理的獨立產房以活動隔欄分開，保留工作人員巡視動線。'},
  {id:'closeup-feed',name:'待產群採食與飲水',x:-1.48,z:-1.2,text:'採食與飲水位於群欄前緣；遊戲不虛構預產日、營養配方或臨床數字。'},
  {id:'closeup-light',name:'待產舍夜間巡視燈',x:1.48,z:6.4,text:'可切換低亮度巡視燈，方便查看產房；不代表全天持續強光。'},
  {id:'closeup-cart',name:'清潔待產用品車',x:-1.48,z:6.8,text:'用品車只呈現乾淨毛巾、手套與空白紀錄板，不提供醫療處置指示。'}
 ])
});

export function createTransitionBarns({THREE,master,mobile=false}){
 const cube=new THREE.BoxGeometry(1,1,1);
 const sphere=new THREE.SphereGeometry(1,mobile?8:12,mobile?6:9);
 const mat=(color,glow=0)=>new THREE.MeshStandardMaterial({color,roughness:.72,emissive:color,emissiveIntensity:glow});
 const M={steel:mat(0x91a5aa),dark:mat(0x35434a),bedding:mat(0xc8a873),feed:mat(0x8c754b),
  white:mat(0xeeeade),black:mat(0x292d2d),pink:mat(0xd4aaa0),blue:mat(0x4387a0),
  green:mat(0x4b8069),amber:mat(0xe4ad4f,.25),light:mat(0xffe7a8,.55),off:mat(0x67777a,.03)};
 const animations={dry:[],closeup:[]},cows={dry:[],closeup:[]};
 const roots={},gateLeaves={},lamps=[];
 const state={dryGateOpen:true,closeupPensOpen:false,closeupLight:'day'};
 function group(p,name,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);p.add(g);return g}
 function box(p,name,x,y,z,w,h,d,m=M.steel){const o=new THREE.Mesh(cube,m);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);p.add(o);return o}
 function ball(p,name,x,y,z,w,h,d,m=M.white){const o=new THREE.Mesh(sphere,m);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);p.add(o);return o}
 function cow(p,area,id,x,z,{lying=false,face=1}={}){
  const r=group(p,'Transition cow #'+id,x,.12,z);r.rotation.y=face<0?Math.PI:0;
  ball(r,'body',0,lying?.63:1.08,0,.94,lying?.43:.58,.46,M.white);
  ball(r,'patch',-.25,lying?.69:1.16,-.27,.45,.28,.20,M.black);
  const head=group(r,'head',.91,lying?.91:1.43,0);
  ball(head,'head',0,0,0,.35,.36,.29,M.white);ball(head,'muzzle',.30,-.13,0,.25,.17,.23,M.pink);
  for(const side of [-1,1])ball(head,'ear',-.08,.20,side*.29,.21,.09,.13,M.black);
  for(const dx of [-.61,.58])for(const dz of [-.30,.30])box(r,'leg',dx,lying?.42:.75,dz,.19,lying?.25:.58,.19,M.white);
  const collar=box(head,'visual identity collar',-.13,-.20,0,.13,.64,.64,M.blue);collar.rotation.x=Math.PI/2;
  cows[area].push({id,root:r,head,lying});
  animations[area].push(t=>{head.rotation.z=(lying?.045:.025)*Math.sin(t*(lying?.65:1.1)+id);r.position.y=.12+.008*Math.sin(t*.8+id)});
 }
 function gate(p,area,z,x0,x1){
  const pivot=group(p,area+' interactive gate',x0,0,z);
  const leaf=group(pivot,area+' gate leaf');
  for(const y of [.55,1.05])box(leaf,'gate rail',(x1-x0)/2,y,0,Math.abs(x1-x0),.08,.08,M.steel);
  for(const x of [.06,Math.abs(x1-x0)-.06])box(leaf,'gate post',x,.80,0,.08,1.35,.08,M.steel);
  gateLeaves[area]=pivot;return pivot;
 }
 const dry=master.interiors.get('dry'),closeup=master.interiors.get('closeup');
 if(!dry||!closeup)throw Error('Transition barn interiors are required');
 roots.dry=group(dry,'P068_DRY_COW_REFINEMENT');roots.closeup=group(closeup,'P068_CLOSEUP_REFINEMENT');

 // Add herd density without blocking the shared central player lane.
 [[-4.6,-6.3,true,1],[-4.3,-2.5,false,1],[-4.5,2.1,true,1],[4.5,-6.0,false,-1],[4.35,-1.8,true,-1],[4.55,2.5,false,-1]]
  .forEach((v,i)=>cow(roots.dry,'dry',2101+i,v[0],v[1],{lying:v[2],face:v[3]}));
 [[-4.55,-6.0,true,1],[-4.3,-2.0,false,1],[4.45,-5.5,true,-1],[4.25,-1.3,false,-1],[4.35,4.0,true,-1]]
  .forEach((v,i)=>cow(roots.closeup,'closeup',2201+i,v[0],v[1],{lying:v[2],face:v[3]}));

 // Dry-cow barn: visible feed texture, drains, body brush and operable group gate.
 for(const side of [-1,1]){
  for(let z=-7;z<=5;z+=1.45)box(roots.dry,'dry ration texture',side*1.30,.62,z,.84,.10,.83,M.feed);
  for(let z=5.6;z<=7.3;z+=.34)box(roots.dry,'drain grate',side*2.72,.08,z,.84,.025,.12,M.dark);
 }
 const brush=group(roots.dry,'dry cow rotating brush',-5.20,1.25,.7);
 box(brush,'brush axle',0,.55,0,.11,1.2,.11,M.steel);
 for(let i=0;i<9;i++){const b=box(brush,'brush segment',0,(i-4)*.12,0,.62,.10,.62,i%2?M.green:M.blue);b.rotation.y=i*.38}
 animations.dry.push(t=>{brush.rotation.y=t*.7});
 gate(roots.dry,'dry',2.75,2.15,5.70);

 // Close-up barn: two clear calving pens, supply cart and switchable low light.
 for(const side of [-1,1]){
  for(const z of [.35,7.6])box(roots.closeup,'calving pen boundary',side*4.05,1.02,z,3.35,.10,.10,M.steel);
  box(roots.closeup,'privacy panel',side*5.55,1.08,4.0,.12,1.45,6.9,M.green);
 }
 gate(roots.closeup,'closeup',.35,2.18,5.62);
 const cart=group(roots.closeup,'clean close-up supply cart',-4.35,0,7.4);
 box(cart,'cart shelf',0,.75,0,1.55,.10,.75,M.steel);box(cart,'blank record board',0,1.45,0,1.30,.72,.08,M.white);
 for(const x of [-.58,.58])for(const z of [-.25,.25])ball(cart,'cart wheel',x,.23,z,.16,.16,.08,M.dark);
 for(const x of [-3.6,0,3.6]){
  const lamp=box(roots.closeup,'close-up low-level inspection light',x,3.25,5.1,1.35,.12,.30,M.off);lamps.push(lamp);
 }

 function interact(id){
  if(id==='dry-gate'){
   state.dryGateOpen=!state.dryGateOpen;
   return state.dryGateOpen?'乾乳牛分群門已打開。':'乾乳牛分群門已關閉；中央玩家通道仍保持開放。';
  }
  if(id==='dry-brush')return '牛體刷正在緩速旋轉；這是環境豐富化動畫。';
  if(id==='closeup-pens'){
   state.closeupPensOpen=!state.closeupPensOpen;
   return state.closeupPensOpen?'待產產房隔欄已打開，示意清理與轉入動線。':'待產產房隔欄已關閉，維持安靜的獨立空間。';
  }
  if(id==='closeup-light'){
   state.closeupLight=state.closeupLight==='day'?'check':'day';
   for(const lamp of lamps)lamp.material=state.closeupLight==='check'?M.light:M.off;
   return state.closeupLight==='check'?'低亮度巡視燈已開啟。':'巡視燈已關閉，恢復白天環境。';
  }
  const all=[...TRANSITION_BARN_POINTS.dry,...TRANSITION_BARN_POINTS.closeup];
  return all.find(v=>v.id===id)?.text||null;
 }
 function animate(time,area){
  for(const fn of animations[area]||[])fn(time);
  if(gateLeaves.dry)gateLeaves.dry.rotation.y+=((state.dryGateOpen?-Math.PI/2:0)-gateLeaves.dry.rotation.y)*.08;
  if(gateLeaves.closeup)gateLeaves.closeup.rotation.y+=((state.closeupPensOpen?-Math.PI/2:0)-gateLeaves.closeup.rotation.y)*.08;
 }
 function snapshot(){return {...state,dryCows:cows.dry.length,closeupCows:cows.closeup.length}}
 return {roots,cows,interact,animate,snapshot,points:TRANSITION_BARN_POINTS};
}
