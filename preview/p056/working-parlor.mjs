// DAIRY 24HR P0.5.5 — consistent ten-bay parlor and quiet everyday motion.
// Original low-poly geometry; references the user's milking-equipment slides.
// Scene geometry is illustrative, not a commercial manufacturer's working drawing.
export function installWorkingParlor({THREE,farm,cattle,meiling,worker,mobile=false}) {
 const mat=(color,metalness=0,roughness=.72)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const steel=mat(0xb6c8cb,.58,.3),bright=mat(0xd9e2df,.62,.28);
 const black=mat(0x222d31),rubber=mat(0x283135),pink=mat(0xd6a29c);
 const milk=mat(0xdce3d9,.04,.43),pulse=mat(0x41819a,.05,.57);
 const screen=mat(0x183d4b,.1,.65),teal=mat(0x498ba1),gold=mat(0xe3c46d);
 const baseGeo=new THREE.BoxGeometry(1,1,1);
 const cupGeo=new THREE.CylinderGeometry(.095,.075,.35,mobile?8:12);
 const linerGeo=new THREE.CylinderGeometry(.097,.09,.045,mobile?8:12);
 const rimGeo=new THREE.CylinderGeometry(.108,.098,.025,mobile?8:12);
 const teatGeo=new THREE.CylinderGeometry(.068,.056,.28,mobile?8:12);
 const clawGeo=new THREE.SphereGeometry(1,mobile?9:13,mobile?6:9);
 const lampOn=new THREE.MeshBasicMaterial({color:0x46e3b0});
 const lampOff=new THREE.MeshBasicMaterial({color:0x55696b});
 const warn=new THREE.MeshBasicMaterial({color:0xe4be73});
 function mesh(p,geo,m,x,y,z,sx=1,sy=1,sz=1) {
  const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);
  o.castShadow=!mobile&&sx*sy*sz>.20;o.receiveShadow=!mobile;p.add(o);return o;
 }
 function box(p,m,x,y,z,w,h,d){return mesh(p,baseGeo,m,x,y,z,w,h,d)}
 function cylinder(p,m,x,y,z,geo){return mesh(p,geo,m,x,y,z)}
 function sphere(p,m,x,y,z,w,h,d){return mesh(p,clawGeo,m,x,y,z,w,h,d)}
 function hose(p,coords,radius,m) {
  const curve=new THREE.CatmullRomCurve3(coords.map(q=>new THREE.Vector3(...q)));
  const geo=new THREE.TubeGeometry(curve,mobile?12:21,radius,mobile?4:6,false);
  return mesh(p,geo,m,0,0,0);
 }
 const units=[];
 for(let index=0;index<cattle.length;index++){
  const c=cattle[index],side=index<5?-1:1;
  const animal=c.group,z=c.group.position.z;
  // The geometry below is parented to the actual cow, so it follows her body.
  const udder=new THREE.Group();animal.add(udder);
  udder.name='Milking udder cow '+index;
  sphere(udder,pink,-.23,.73,0,.57,.33,.43);
  sphere(udder,pink,-.39,.61,0,.34,.18,.36);
  const cluster=new THREE.Group();udder.add(cluster);cluster.name='Four-cup milking cluster';
  for(const x of [-.46,-.04])for(const zz of [-.24,.24]){
   cylinder(udder,pink,x,.41,zz,teatGeo);
   cylinder(cluster,steel,x,.31,zz,cupGeo);
   cylinder(cluster,black,x,.50,zz,linerGeo);
   cylinder(cluster,bright,x,.47,zz,rimGeo);
   hose(cluster,[[x,.17,zz],[x,.07,zz],[x-.12,-.08,zz*.74],[-.40,.05,.01]],.026,milk);
   // The pulsation line is distinct from the milk-carrying line.
   if(index===1||(!mobile&&index%3===0))
    hose(cluster,[[x,.48,zz],[x-.05,.53,zz+.09],[-.68,.33,zz*.68]],.016,pulse);
  }
  sphere(cluster,black,-.41,.055,0,.24,.16,.22);
  sphere(cluster,bright,-.41,.13,0,.19,.072,.17);
  // Flexible lines run from the cluster toward the inner edge of the pit.
  hose(cluster,[[-.58,.04,0],[-1.04,-.10,-.16],[-1.68,.04,-.32],[-2.35,.51,-.31],[-2.68,1.06,-.13]],.047,milk);
  hose(cluster,[[-.62,.29,.12],[-1.03,.4,.28],[-1.85,.77,.32],[-2.68,1.65,.12]],.025,pulse);
  // Shared parlor equipment: each cow has a compact pulsator/flow panel.
  const g=new THREE.Group();g.position.set(side*2.69,0,z);farm.add(g);
  g.name='Bay '+(index+1)+' equipment';
  box(g,steel,0,1.85,0,.11,1.62,.13);
  box(g,teal,0,1.92,.12,.39,.36,.23);
  box(g,screen,0,1.93,.255,.30,.16,.014);
  const led=box(g,lampOff,-.115,1.935,.268,.075,.035,.009);
  const strip=box(g,gold,.09,1.92,.268,.052,.028,.009);
  box(g,steel,0,1.47,.11,.44,.40,.22);
  box(g,screen,0,1.52,.234,.33,.20,.013);
  const meter=box(g,lampOn,-.09,1.50,.249,.12,.028,.01);
  // Slim vertical riser joins the full-width header line already in the room.
  box(g,steel,0,2.67,-.04,.07,.69,.07);
  // Detailed illustrative analog gauge on two representative stalls only;
  // reduced draw calls for mobile hardware.
  if(index===1 || (index===6 && !mobile)){
   const gauge=new THREE.Group();gauge.position.set(.19,2.44,.03);g.add(gauge);
   const cylinderGeo=new THREE.CylinderGeometry(.14,.14,.06,mobile?12:20);
   const dial=cylinder(gauge,bright,0,0,0,cylinderGeo);dial.rotation.x=Math.PI/2;
   box(gauge,black,.01,.015,.039,.016,.11,.01).rotation.z=-.35;
  }
  units.push({index,side,z,cow:c,animal,udder,cluster,led,meter,stage:-1});
 }
 // Prepared tools, only once; never duplicated ten times over.
 const tools=new THREE.Group();tools.position.set(-1.60,0,-2.25);farm.add(tools);
 box(tools,steel,0,1.13,0,.86,.08,.44);
 for(const x of [-.37,.37])box(tools,steel,x,.64,0,.045,.96,.045);
 const bottleGeo=new THREE.CylinderGeometry(.095,.10,.31,10);
 cylinder(tools,teal,-.26,1.33,0,bottleGeo);
 box(tools,gold,-.26,1.53,0,.10,.09,.10);
 box(tools,milk,.075,1.25,0,.31,.07,.24);
 box(tools,milk,.075,1.32,0,.31,.06,.24);
 box(tools,teal,.29,1.22,-.09,.17,.15,.14);
 // Staff work at a believable walking pace in their respective pit-side zones.
 const meiBase=meiling.root.position.clone();
 const workerBase=worker.root.position.clone();
 const workerYaw=worker.root.rotation.y;
 const outputs={stages:[],milking:0,preparing:0,finished:0};
 function smooth(t){const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v)}
 // Stage durations are GAME DEMO times, not real milking times.
 function animate(time,state){
  const mode=state?.key||'milking',p=Math.min(1,Math.max(0,state?.progress??1));
  outputs.stages.length=0;outputs.milking=0;outputs.preparing=0;outputs.finished=0;
  for(const u of units){
   const i=u.index%5,part=Math.max(0,Math.min(1,(p-i*.105)/(1-i*.105)));
   const transit=smooth(part);
   let label='待命',attach=0;
   if(mode==='arrival'){
    u.animal.visible=part>.001;
    u.animal.position.z=(14+(4-i)*.55)*(1-transit)+u.z*transit;
    label=transit>=1?'已進場':'進場中';
   }else if(mode==='departure'){
    const z=u.z*(1-transit)-16.5*transit;
    u.animal.position.z=z;
    u.animal.visible=z>-13.3;
    label='離場中';
   }else{
    u.animal.position.z=u.z;
    u.animal.visible=mode!=='cleaning'&&mode!=='complete';
    if(mode==='prepare'){label='前處理中';outputs.preparing++}
    if(mode==='attach'){label='接杯中';outputs.preparing++}
    if(mode==='milking'){label='榨乳中';outputs.milking++}
    if(mode==='detach'){label='脫杯中';outputs.finished++}
    if(mode==='cleaning'){label='清洗中';outputs.finished++}
    if(mode==='complete'){label='已完成';outputs.finished++}
   }
   if(mode==='attach')attach=smooth((p-i*.08)*1.55);
   if(mode==='milking')attach=1;
   if(mode==='detach')attach=1-smooth((p-i*.08)*1.55);
   u.cluster.visible=u.animal.visible&&attach>.013;
   u.cluster.position.y=-(1-attach)*.18;
   u.led.material=['milking','cleaning'].includes(mode)?lampOn:
     ['arrival','prepare','attach','detach','departure'].includes(mode)?warn:lampOff;
   u.meter.scale.x=mode==='milking'?.074+.036*(.5+.5*Math.sin(time*2.4+u.index)):.024;
   u.stage=label;outputs.stages[u.index]=label;
   const t=time*.88+u.index*.65;
   u.animal.scale.y=1+.0038*Math.sin(t);
   if(u.cow.head){u.cow.head.position.y=1.63+.018*Math.sin(t*.83);u.cow.head.rotation.z=.035*Math.sin(t*.49)}
   for(let k=0;k<u.cow.legs.length;k++){
    const limb=u.cow.legs[k];
    limb.rotation.z=.012*Math.sin(t*.56+k*1.6);
    limb.rotation.x=['arrival','departure'].includes(mode)?
      .13*Math.sin(time*6+u.index+k*Math.PI):0;
   }
  }
  const working=['prepare','attach','detach','cleaning'].includes(mode);
  const reach=working?.55+.45*Math.sin(time*2.4):.13;
  const zShift=mode==='prepare'?.35:mode==='attach'?-1.2:
    mode==='detach'?-1.8:mode==='cleaning'?5.45:mode==='milking'?2.1:0;
  const zWanted=Math.max(-9,Math.min(7,meiBase.z+zShift));
  meiling.root.position.z+=(zWanted-meiling.root.position.z)*.045;
  meiling.root.position.x=meiBase.x-.12*reach;
  meiling.limbs.rightArm.rotation.x=-.15-1.0*reach;
  meiling.limbs.leftArm.rotation.x=.1-.3*reach;
  const walking=['arrival','milking','departure'].includes(mode);
  const workerOffset=mode==='cleaning'?6.2:mode==='arrival'?5.7:mode==='milking'?1.1:0;
  worker.root.position.z+=(workerBase.z+workerOffset+
    (walking?.45*Math.sin(time*.7):0)-worker.root.position.z)*.04;
  worker.root.position.x=workerBase.x+.06*Math.sin(time*.6);
  worker.root.rotation.y=workerYaw+.15*Math.sin(time*.5);
  const swing=(walking?.2:.045)*Math.sin(time*4);
  worker.limbs.leftLeg.rotation.x=swing;worker.limbs.rightLeg.rotation.x=-swing;
  worker.limbs.leftArm.rotation.x=-swing*.7;worker.limbs.rightArm.rotation.x=swing*.7;
 }
 function getStage(index){return units[index]?.stage??'準備中'}
 return {animate,getStage,units,outputs};
}
