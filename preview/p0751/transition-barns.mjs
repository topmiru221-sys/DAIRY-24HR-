// DAIRY 24HR P0.7.1 — roof-down cooling and cow-safe equipment spacing.
// All values and indicators are game-state labels, not veterinary measurements.
export const TRANSITION_BARN_AREAS=Object.freeze(['dry','closeup']);

export const TRANSITION_BARN_POINTS=Object.freeze({
 dry:Object.freeze([
  {id:'dry-groups',name:'加大乾乳牛分群欄與深墊料',x:-5.9,z:-9.2,text:'加大後的乾乳牛舍把牛群分散在更寬的深墊料休息區；採食、飲水與巡視通道彼此清楚分開。'},
  {id:'dry-feed',name:'乾乳牛專用採食前緣',x:2.1,z:-5.2,text:'飼槽保留較寬站位並呈現獨立日糧外觀；本遊戲不提供真實配方或餵量。'},
  {id:'dry-water',name:'雙側飲水與防滑巡視區',x:-2.8,z:9.0,text:'兩側設飲水槽與排水格柵，中央通道保持暢通，方便日常觀察。'},
  {id:'dry-gate',name:'乾乳牛分群活動門',x:4.5,z:4.2,text:'活動門可切換開關，示意分群動線；不模擬真實牛群驅趕或夾傷防護。'},
  {id:'dry-brush',name:'兩側用品車、牛體刷與休息行為',x:-6.7,z:10.5,text:'左右各有一台醒目用品車及一組牛體刷；用品僅為清潔與空白紀錄示意，並非醫療指示。'}
 ]),
 closeup:Object.freeze([
  {id:'closeup-group',name:'加大 Close-up 待產牛群',x:-6.1,z:-8.8,text:'加大後的待產牛舍讓牛隻分散使用安靜、乾爽的深墊料區，與一般泌乳牛舍分開。'},
  {id:'closeup-pens',name:'兩間加大獨立產房',x:5.4,z:3.8,text:'兩間可視、可清理的獨立產房以活動隔欄分開，保留更寬的工作人員巡視動線。'},
  {id:'closeup-feed',name:'待產群採食與飲水',x:-2.1,z:-5.0,text:'採食與飲水位於群欄前緣；遊戲不虛構預產日、營養配方或臨床數字。'},
  {id:'closeup-light',name:'待產舍夜間巡視燈',x:2.1,z:9.4,text:'可切換低亮度巡視燈，方便查看產房；不代表全天持續強光。'},
  {id:'closeup-cart',name:'兩側清潔待產用品車與牛體刷',x:-6.7,z:10.5,text:'左右各有一台醒目的用品車與一組牛體刷；用品只呈現乾淨毛巾、手套與空白紀錄板，不提供醫療處置指示。'}
 ])
});

export function createTransitionBarns({THREE,master,mobile=false}){
 const cube=new THREE.BoxGeometry(1,1,1);
 const sphere=new THREE.SphereGeometry(1,mobile?8:12,mobile?6:9);
 const mat=(color,glow=0)=>new THREE.MeshStandardMaterial({color,roughness:.72,emissive:color,emissiveIntensity:glow});
 const M={steel:mat(0x91a5aa),shiny:mat(0xcbd6d5),dark:mat(0x35434a),bedding:mat(0xc8a873),feed:mat(0x8c754b),
  white:mat(0xeeeade),black:mat(0x292d2d),pink:mat(0xd4aaa0),blue:mat(0x4387a0),
  green:mat(0x4b8069),amber:mat(0xe4ad4f,.25),light:mat(0xffe7a8,.55),off:mat(0x67777a,.03)};
 const animations={dry:[],closeup:[]},cows={dry:[],closeup:[]};
 const roots={},gateLeaves={},lamps=[],fanRotors=[],brushes=[];
 const state={dryGateOpen:true,closeupPensOpen:false,closeupLight:'day'};
 function group(p,name,x=0,y=0,z=0){const g=new THREE.Group();g.name=name;g.position.set(x,y,z);p.add(g);return g}
 function box(p,name,x,y,z,w,h,d,m=M.steel){const o=new THREE.Mesh(cube,m);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);p.add(o);return o}
 function ball(p,name,x,y,z,w,h,d,m=M.white){const o=new THREE.Mesh(sphere,m);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);p.add(o);return o}
 function cylinder(p,name,x,y,z,r,h,m=M.steel,segments=mobile?12:20){
  const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),m);o.name=name;o.position.set(x,y,z);p.add(o);return o;
 }
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
 function brush(p,area,x,z){
  const root=group(p,area+' side cow brush',x,1.18,z);
  box(root,'brush support',0,.54,0,.12,1.35,.12,M.steel);
  const roller=group(root,'rotating brush',0,.73,0);
  for(let i=0;i<10;i++){const b=box(roller,'brush segment',0,(i-4.5)*.115,0,.68,.095,.68,i%2?M.green:M.blue);b.rotation.y=i*.34}
  brushes.push(roller);return roller;
 }
 function supplyCart(p,area,side){
  const cart=group(p,'VISIBLE '+area.toUpperCase()+' SUPPLY CART '+(side<0?'LEFT':'RIGHT'),side*6.65,0,10.2);
  box(cart,'high visibility cart body',0,.72,0,1.65,1.12,.92,M.amber);
  box(cart,'upper clean shelf',0,1.34,0,1.72,.10,.96,M.steel);
  box(cart,'blank record board',0,1.86,0,1.38,.76,.08,M.white);
  box(cart,'visual first-aid cross horizontal',0,1.87,.07,.72,.15,.035,M.green);
  box(cart,'visual first-aid cross vertical',0,1.87,.07,.15,.58,.035,M.green);
  for(const x of [-.58,.58])for(const z of [-.34,.34])ball(cart,'cart wheel',x,.20,z,.18,.18,.09,M.dark);
  for(const x of [-.48,0,.48])box(cart,'clean folded supply',x,1.48,0,.32,.17,.55,x===0?M.blue:M.white);
  return cart;
 }
 function roofFan(p,area,x,z){
  // Horizontal X-Z rotor: mounted below the roof and blowing down along -Y.
  const root=group(p,area+' ROOF-MOUNTED DOWNWARD cow-cooling fan',x,3.92,z);
  box(root,'Short roof suspension',0,.42,0,.14,.84,.14,M.steel);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.18,.095,7,mobile?16:28),M.dark);
  ring.name='Horizontal roof fan guard ring';ring.rotation.x=Math.PI/2;root.add(ring);
  const rotor=group(root,'Horizontal downward roof-fan rotor');
  for(let k=0;k<4;k++){
   const spoke=group(rotor,'Downward roof-fan blade pivot');spoke.rotation.y=k*Math.PI/2;
   box(spoke,'Roof fan blade',.59,0,0,1.04,.055,.24,M.shiny);
  }
  cylinder(rotor,'Roof fan hub',0,0,0,.16,.16,M.blue,10);
  fanRotors.push({area,rotor,speed:.36,axis:'y',airflow:'down'});
 }
 // Exact visual language used by the accepted lactating-barn panel fan:
 // 2.88 square housing, circular aperture/ring, four wide blades,
 // safety grille and edge frame; face stays in X-Y with airflow along +Z.
 function panelFan(p,area,x,z){
  // Keep the accepted lactating-barn appearance, but hang it fully above cows.
  const mount=group(p,area+' aisle-parallel panel-fan roof hanger',x,4.08,z);
  box(mount,'Panel fan vertical roof suspension',0,.42,-.16,.16,.84,.16,M.steel);
  const assembly=group(mount,'LARGE FLAT PANEL FAN parallel to cow walkway');
  box(assembly,'Large square panel fan housing',0,0,-.19,2.88,2.88,.24,M.shiny);
  box(assembly,'Circular fan airflow aperture',0,0,-.045,2.56,2.56,.06,M.dark);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.17,.086,7,mobile?16:28),M.steel);ring.name='Panel fan circular guard ring';ring.position.z=.10;assembly.add(ring);
  const rotor=group(assembly,'Longitudinal panel fan rotor',0,0,.17);
  for(let k=0;k<4;k++){
   const spoke=group(rotor,'Panel fan blade pivot');spoke.rotation.z=k*Math.PI/2;
   box(spoke,'Wide guarded panel-fan blade',.59,0,0,1.03,.29,.065,M.shiny);
  }
  cylinder(rotor,'Panel fan hub',0,0,.05,.20,.11,M.blue).rotation.x=Math.PI/2;
  for(const grid of [-.94,-.47,0,.47,.94]){
   box(assembly,'Vertical fan safety grille',grid,0,.33,.045,2.43,.04,M.steel);
   box(assembly,'Horizontal fan safety grille',0,grid,.33,2.43,.045,.04,M.steel);
  }
  for(const edge of [-1.40,1.40]){
   box(assembly,'Flat fan frame upright',edge,0,.26,.10,2.80,.12,M.steel);
   box(assembly,'Flat fan frame lateral',0,edge,.26,2.80,.10,.12,M.steel);
  }
  fanRotors.push({area,rotor,speed:.84,axis:'z'});
 }
 const dry=master.interiors.get('dry'),closeup=master.interiors.get('closeup');
 if(!dry||!closeup)throw Error('Transition barn interiors are required');
 roots.dry=group(dry,'P071_ROOF_DOWN_DRY_COW_REFINEMENT');roots.closeup=group(closeup,'P071_COW_SAFE_CLOSEUP_REFINEMENT');

 // Add herd density without blocking the shared central player lane.
 [[-6.5,-10.0,true,1],[-6.2,-5.3,false,1],[-6.4,.2,true,1],[-6.1,5.2,false,1],[6.4,-9.6,false,-1],[6.25,-4.6,true,-1],[6.45,.8,false,-1],[6.2,5.7,true,-1]]
  .forEach((v,i)=>cow(roots.dry,'dry',2101+i,v[0],v[1],{lying:v[2],face:v[3]}));
 [[-6.4,-9.5,true,1],[-6.15,-4.8,false,1],[-6.35,3.8,true,1],[-6.1,6.7,false,1],[6.35,-9.2,true,-1],[6.15,-4.2,false,-1],[6.3,5.3,true,-1]]
  .forEach((v,i)=>cow(roots.closeup,'closeup',2201+i,v[0],v[1],{lying:v[2],face:v[3]}));

 // Dry-cow barn: visible feed texture, drains, body brush and operable group gate.
 for(const side of [-1,1]){
  for(let z=-11.5;z<=7;z+=1.45)box(roots.dry,'dry ration texture',side*1.55,.62,z,1.05,.10,.83,M.feed);
  for(let z=8.0;z<=11.2;z+=.34)box(roots.dry,'drain grate',side*3.15,.08,z,1.05,.025,.12,M.dark);
 }
 brush(roots.dry,'dry',-7.15,1.6);brush(roots.dry,'dry',7.15,1.6);
 supplyCart(roots.dry,'dry',-1);supplyCart(roots.dry,'dry',1);
 gate(roots.dry,'dry',4.2,2.20,7.65);

 // Close-up barn: two clear calving pens, supply cart and switchable low light.
 for(const side of [-1,1]){
  for(const z of [.4,8.6])box(roots.closeup,'calving pen boundary',side*5.15,1.02,z,5.15,.10,.10,M.steel);
  for(const z of [.5,4.5,8.5])box(roots.closeup,'outer calving rail post',side*8.10,.92,z,.11,1.75,.11,M.steel);
  for(const y of [.58,1.18])box(roots.closeup,'open calving side rail',side*8.10,y,4.5,.10,.09,8.0,M.steel);
 }
 gate(roots.closeup,'closeup',.4,2.20,7.65);
 supplyCart(roots.closeup,'closeup',-1);supplyCart(roots.closeup,'closeup',1);
 brush(roots.closeup,'closeup',-7.2,2.7);brush(roots.closeup,'closeup',7.2,2.7);
 for(const x of [-5.8,0,5.8]){
  const lamp=box(roots.closeup,'close-up low-level inspection light',x,3.35,8.9,1.55,.12,.34,M.off);lamps.push(lamp);
 }
 for(const area of ['dry','closeup']){
  const root=roots[area];
  for(const x of [-3.8,3.8])for(const z of [-7.3,2.7])roofFan(root,area,x,z);
  for(const x of [-4.9,4.9])for(const z of [-6.1,5.7])panelFan(root,area,x,z);
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
  for(const fan of fanRotors)if(fan.area===area)fan.rotor.rotation[fan.axis]=time*fan.speed;
  for(const roller of brushes)roller.rotation.y=time*.68;
  if(gateLeaves.dry)gateLeaves.dry.rotation.y+=((state.dryGateOpen?-Math.PI/2:0)-gateLeaves.dry.rotation.y)*.08;
  if(gateLeaves.closeup)gateLeaves.closeup.rotation.y+=((state.closeupPensOpen?-Math.PI/2:0)-gateLeaves.closeup.rotation.y)*.08;
 }
 function snapshot(){return {...state,dryCows:cows.dry.length,closeupCows:cows.closeup.length,
   dryLargeFans:4,dryPanelFans:4,closeupLargeFans:4,closeupPanelFans:4,
   dryDownwardRoofFans:4,closeupDownwardRoofFans:4,
   drySupplyCarts:2,closeupSupplyCarts:2,supplyCarts:4,dryBrushes:2,closeupBrushes:2}}
 return {roots,cows,interact,animate,snapshot,points:TRANSITION_BARN_POINTS,
  layout:{bounds:{dry:{xmin:-8.25,xmax:8.25,zmin:-13.7,zmax:13.7},closeup:{xmin:-8.25,xmax:8.25,zmin:-13.7,zmax:13.7}}}};
}
