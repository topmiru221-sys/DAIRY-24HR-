// DAIRY 24HR — P0.6.6: feed presentation and autonomous feed-pusher preview.
// Not genuine robot navigation or TMR ration formulation.
// Official functional reference: https://www.lely.com/tw/solutions/feeding/juno/
export const FUTURE_FEED_JOB=Object.freeze({
 id:'daily-feed-front-check',area:'lactating',status:'preview-only',
 name:'泌乳牛舍每日飼槽巡視與推料',
 plannedSteps:Object.freeze(['巡查 TMR 採食前緣','確認機器人充電及通道安全','巡視推料工作','回到採食線查看飼料狀況'])
});
const ROUTE=Object.freeze([
 {x:0,z:-24.9},{x:-1.4,z:-24.9},{x:-3.3,z:-23.1},
 {x:-3.3,z:-16},{x:-3.3,z:-8},{x:-3.3,z:0},{x:-3.3,z:4.2},
 {x:-2.0,z:5.6},{x:0,z:5.8},{x:2.0,z:5.6},
 {x:3.3,z:4.2},{x:3.3,z:0},{x:3.3,z:-8},{x:3.3,z:-16},{x:3.3,z:-23.1},
 {x:1.4,z:-24.9},{x:0,z:-24.9}
]);
export function createFeedPusher({THREE,parent,mobile=false}){
 const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.73,flatShading:true});
 const M={tmr:mat(0x857344),hay:mat(0xb7a36a),silage:mat(0x607342),
 corn:mat(0xd5b673),grain:mat(0xa08e64),wheel:mat(0x373b39),
 red:mat(0xb84f37,.25),white:mat(0xe4e7e1,.4),metal:mat(0xa6b9b6,.5),
 screen:new THREE.MeshBasicMaterial({color:0x75e5db}),led:new THREE.MeshBasicMaterial({color:0xf4d15a})};
 const cube=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,mobile?6:9,mobile?5:7);
 const cylinderCache=new Map();
 function group(par,name,x=0,y=0,z=0){const obj=new THREE.Group();obj.name=name;obj.position.set(x,y,z);par.add(obj);return obj}
 function box(par,name,x,y,z,w,h,d,m){
  const obj=new THREE.Mesh(cube,m);obj.name=name;obj.position.set(x,y,z);obj.scale.set(w,h,d);par.add(obj);return obj;
 }
 function cylinder(par,name,x,y,z,rt,rb,h,m){
  const key=[rt,rb,h,mobile?10:14].join('-');
  if(!cylinderCache.has(key))cylinderCache.set(key,new THREE.CylinderGeometry(rt,rb,h,mobile?10:14));
  const obj=new THREE.Mesh(cylinderCache.get(key),m);obj.name=name;obj.position.set(x,y,z);par.add(obj);return obj;
 }
 function pile(par,name,x,y,z,w,h,d,m){
  const obj=new THREE.Mesh(sphere,m);obj.name=name;obj.position.set(x,y,z);obj.scale.set(w,h,d);par.add(obj);return obj
 }
 // Each side has a windrow visibly made of chopped forage and silage rather than flat turf.
 const feed=group(parent,'Both headlock feed troughs filled with TMR');
 const portions=[],pieces=[],n=mobile?16:22;
 for(const side of [-1,1]){
  for(let i=0;i<n;i++){
   const z=-24.0+i*(29.2/(n-1));
   const base=group(feed,'Visible mixed ration TMR windrow '+side+' '+i,side*4.56,0,z);
   pile(base,'Chopped silage and grain mixed ration',0,.61,0,.50,.13,.68,M.tmr);
   for(let j=0;j<(mobile?3:5);j++){
    const m=[M.hay,M.silage,M.corn,M.grain][(i+j)%4];
    const strand=box(base,'TMR visible chopped forage piece',-.26+j*.13,.73+(j%2)*.02,
      -.36+((i*2+j*3)%7)*.12,.12,.032,.16+(j%2)*.06,m);
    strand.rotation.y=(i+j)*.6;
   }
   const loose=group(feed,'TMR on feed alley edge before push '+side+' '+i,side*3.84,0,z);
   pile(loose,'Loose TMR pushed closer after robot passes',0,.57,0,.22,.11,.40,M.hay);
   portions.push({side,z,loose,completed:false});
  }
 }
 const robot=group(parent,'Autonomous low-profile circular feed pusher',0,.13,-24.9);
 const turning=group(robot,'Robot body rotates with feed alley direction');
 cylinder(turning,'Rotating stainless skirt that actually pushes feed',0,.43,0,.80,.90,.67,M.metal);
 cylinder(turning,'Short conical sloping robot top',0,.91,0,.51,.80,.34,M.red);
 cylinder(turning,'Top access dome',0,1.09,0,.30,.51,.22,M.white);
 cylinder(turning,'Low rubber feed push rim',0,.18,0,.83,.83,.20,M.wheel);
 for(const z of [-.50,.50]){
  const wheel=cylinder(turning,'Concealed drive wheel',.30,.18,z,.16,.16,.26,M.wheel);
  wheel.rotation.z=Math.PI/2;
 }
 const beacon=cylinder(turning,'Autonomous robot status beacon',0,1.24,.15,.09,.09,.09,M.led);
 box(turning,'Obstacle and safety bumper sensors',-.45,.36,.31,.25,.18,.12,M.screen);
 box(turning,'Sensor display panel',.1,1.24,-.22,.45,.05,.20,M.screen);
 const dock=group(parent,'Autonomous pusher charging point',0,0,-25.8);
 box(dock,'Charging dock floor target',0,.08,0,2.1,.11,1.3,M.metal);
 box(dock,'Dock post',0,.60,-.62,.15,1.08,.15,M.red);
 box(dock,'Dock charge display',0,1.15,-.64,.48,.38,.12,M.screen);
 // Arc-length path: move at roughly constant preview speed, never teleport turns.
 const points=[];
 function catmull(p0,p1,p2,p3,t){
  const t2=t*t,t3=t2*t;return .5*((2*p1)+(-p0+p2)*t+
    (2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);
 }
 function get(i){return ROUTE[Math.max(0,Math.min(ROUTE.length-1,i))]}
 for(let i=0;i<ROUTE.length-1;i++)for(let j=0;j<12;j++){
  const t=j/12,a=get(i-1),b=get(i),c=get(i+1),d=get(i+2);
  points.push({x:catmull(a.x,b.x,c.x,d.x,t),z:catmull(a.z,b.z,c.z,d.z,t)});
 }
 points.push({...ROUTE[ROUTE.length-1]});
 let length=0;for(let i=0;i<points.length;i++){
  if(i)length+=Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z);
  points[i].distance=length;
 }
 function sample(s){
  const dist=Math.max(0,Math.min(length,s));
  let lo=0,hi=points.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(points[mid].distance<dist)lo=mid+1;else hi=mid}
  const p=points[lo],q=points[Math.max(0,lo-1)];
  if(p===q)return p;
  const k=(dist-q.distance)/Math.max(1e-6,p.distance-q.distance);
  return {x:q.x+(p.x-q.x)*k,z:q.z+(p.z-q.z)*k,distance:dist};
 }
 let distance=0, mode='docked',completed=0,animClock=0;
 const SPEED=3.4; // game-units per second; NOT the actual Lely machine's speed.
 function start(){
  if(mode==='running')return '推料機正在沿飼槽巡航。';
  if(mode==='finished'||distance>=length-.1)reset();
  mode='running';return '推料機從充電站出發，先推左側 TMR，再轉彎巡視右側飼槽。';
 }
 function pause(){if(mode!=='running')return '推料機目前沒有執行巡航。';mode='paused';return '推料機示意巡航已暫停。'}
 function reset(){
  mode='docked';distance=0;completed=0;animClock=0;
  for(const f of portions){f.completed=false;f.loose.position.x=f.side*3.84;}
  robot.position.set(0,.13,-24.9);turning.rotation.y=0;
  return '推料機已回到充電站，TMR 示意場景重設。';
 }
 function update(dt){
  if(mode!=='running')return;
  const time=Math.max(0,Math.min(dt,.06));
  distance=Math.min(length,distance+SPEED*time);animClock+=time;
  const p=sample(distance),next=sample(Math.min(length,distance+.2));
  robot.position.x=p.x;robot.position.z=p.z;
  // Forward heading axis of low-poly robot follows tangent.
  const dx=next.x-p.x,dz=next.z-p.z;
  if(Math.abs(dx)+Math.abs(dz)>.001)turning.rotation.y=Math.atan2(dx,dz);
  beacon.visible=Math.sin(animClock*5)>-.2;
  // Push feed toward headlock on the currently followed side as the pusher passes.
  for(const segment of portions){
   if(segment.completed)continue;
   if((segment.side<0&&p.x < -2.5)||(segment.side>0&&p.x>2.5)){
    if(Math.abs(p.z-segment.z)<1.1){
     segment.completed=true;completed++;
     segment.loose.position.x=segment.side*4.23;
    }
   }
  }
  if(distance>=length-.001){mode='finished';robot.position.set(0,.13,-24.9);beacon.visible=false;}
 }
 return {robot,feed,route:points,start,pause,reset,update,
  get status(){return {mode,distance,routeLength:length,completed,total:portions.length,position:{x:robot.position.x,z:robot.position.z}}},futureJob:FUTURE_FEED_JOB,
  assets:{tmrPortions:portions.length,robotName:'original circular feed pusher demo',twoFeedLanes:true,chargingStation:true}};
}
