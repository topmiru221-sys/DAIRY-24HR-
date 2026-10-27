// DAIRY 24HR P0.5.6 — contextual architecture of a dairy milking parlor.
// Approximated for an explorable game; not a dimensioned dairy-facility drawing.
export function createMilkingRoomAssets({THREE,farm,scene,mobile}){
 const palette={
   steel:new THREE.MeshStandardMaterial({color:0xb4c5c7,metalness:.55,roughness:.35}),
   metal:new THREE.MeshStandardMaterial({color:0xd8e2e0,metalness:.64,roughness:.28}),
   pipe:new THREE.MeshStandardMaterial({color:0x598ca6,metalness:.3,roughness:.45}),
   floor:new THREE.MeshStandardMaterial({color:0xc2cebf,roughness:.8}),
   rail:new THREE.MeshStandardMaterial({color:0x759ba2,metalness:.35,roughness:.45}),
   warning:new THREE.MeshBasicMaterial({color:0xe8c260}),
   running:new THREE.MeshBasicMaterial({color:0x61e8bf}),
   stopped:new THREE.MeshBasicMaterial({color:0x5c6c69}),
   cleaning:new THREE.MeshBasicMaterial({color:0x65c9f3}),
   tank:new THREE.MeshStandardMaterial({color:0xd2dddc,metalness:.72,roughness:.25})
 };
 const cube=new THREE.BoxGeometry(1,1,1), mats=palette;
 function b(p,x,y,z,w,h,d,m=mats.steel){
   const obj=new THREE.Mesh(cube,m);obj.position.set(x,y,z);obj.scale.set(w,h,d);
   obj.castShadow=!mobile&&w*h*d>.2;obj.receiveShadow=!mobile;p.add(obj);return obj;
 }
 function cy(p,x,y,z,r1,r2,h,m=mats.steel,segments=mobile?12:20){
   const obj=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),m);obj.position.set(x,y,z);
   obj.castShadow=!mobile;p.add(obj);return obj;
 }
 function tube(p,pts,r,m){
   const curve=new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(...v)));
   const obj=new THREE.Mesh(new THREE.TubeGeometry(curve,mobile?14:32,r,6,false),m);
   p.add(obj);return obj;
 }
 function label(p,text,x,y,z,width=2){
   const canvas=document.createElement('canvas');canvas.width=384;canvas.height=112;
   const ctx=canvas.getContext('2d');
   ctx.fillStyle='#163945';ctx.fillRect(0,0,384,112);
   ctx.strokeStyle='#d9b865';ctx.lineWidth=5;ctx.strokeRect(3,3,378,106);
   ctx.fillStyle='#fff6dc';ctx.textAlign='center';ctx.font='bold 41px "Noto Sans TC",sans-serif';
   ctx.fillText(text,192,72);
   const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(width,width*.29),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
   plane.position.set(x,y,z);p.add(plane);return plane;
 }
 // Recognisable cow holding and departure gates at either end of the two rows.
 const gates=[];
 for(const side of [-1,1]){
   const x=side*5.2;
   b(farm,x,0,11.50,3.7,.13,1.2,mats.floor);
   b(farm,x,0,-11.55,3.7,.13,1.2,mats.floor);
   for(const z of [11.15,-11.15]){
     b(farm,x-side*1.70,.95,z,.12,1.75,.12);
     b(farm,x+side*1.70,.95,z,.12,1.75,.12);
     const hinge=new THREE.Group();hinge.position.set(x-side*1.60,0,z);farm.add(hinge);
     b(hinge,side*1.55,1.18,0,3.10,.09,.09);
     b(hinge,side*1.55,.69,0,3.10,.08,.09);
     for(let i=0;i<5;i++)b(hinge,side*(.30+i*.62),.96,0,.065,.58,.065);
     gates.push({hinge,inbound:z>0,side});
   }
 }
 for(const side of [-1,1]){
   label(farm,side===-1?'左列 · 進牛':'右列 · 進牛',side*5.3,3.05,12.00,2.1);
   label(farm,side===-1?'左列 · 出牛':'右列 · 出牛',side*5.3,3.05,-12.0,2.1);
 }
 // Pipeline is above the pit; two circuits shown with different colors.
 for(const x of [-2.95,2.95]){
   tube(farm,[[x,2.72,-11.3],[x,2.72,-4.5],[x,2.72,2.1],[x,2.72,11.3]],.067,mats.metal);
   tube(farm,[[x*.92,3.08,-11.3],[x*.92,3.08,-4.5],[x*.92,3.08,2.1],[x*.92,3.08,11.3]],.045,mats.pipe);
   for(const z of [-9,-3,3,9]){
      b(farm,x,2.83,z,.11,.30,.09,mats.rail);
   }
 }
 // Prep shelf: teat dip, disposable towels, strip-cup, nearby hand wash.
 const prep=new THREE.Group();prep.position.set(-1.72,0,4.8);farm.add(prep);
 b(prep,0,1.04,0,.75,.1,.43,mats.steel);
 for(const xx of [-.32,.32])b(prep,xx,.52,0,.05,.98,.05);
 cy(prep,-.25,1.28,0,.09,.105,.33,mats.pipe,12);
 cy(prep,-.25,1.51,0,.057,.063,.12,mats.warning,12);
 for(let n=0;n<4;n++)b(prep,.11,1.17+n*.035,0,.28,.03,.22,mats.floor);
 cy(prep,.32,1.20,-.1,.10,.095,.16,mats.metal,12);
 b(farm,-1.70,.86,6.25,.44,1.52,.35,mats.steel);
 b(farm,-1.70,1.54,6.05,.44,.15,.4,mats.metal);
 cy(farm,-1.70,1.63,6.0,.13,.15,.08,mats.pipe);
 label(farm,'作業用品',-1.70,2.2,4.7,1.65);
 // Operator console and CIP loop accessible from the centre work pit.
 const control=new THREE.Group();control.position.set(1.73,0,5.20);farm.add(control);
 b(control,0,1.21,0,.55,2.10,.46,mats.steel);
 b(control,0,2.12,-.20,.50,.38,.07,mats.rail);
 const signal=b(control,0,2.13,-.239,.27,.14,.014,mats.running);
 for(let i=0;i<3;i++)cy(control,-.15+i*.15,1.75,-.25,.045,.045,.04,i===1?mats.warning:mats.running,10).rotation.x=Math.PI/2;
 label(farm,'清洗控制',1.35,3.02,5.42,1.72);
 const wash=new THREE.Group();wash.position.set(10.5,0,8.3);scene.add(wash);
 for(const [i,cx] of [[0,-1.25],[1,.12],[2,1.50]]){
   cy(wash,cx,1.17,0,.62,.62,2.25,i===1?mats.tank:mats.steel);
   cy(wash,cx,2.31,0,.64,.64,.13,mats.metal);
   cy(wash,cx,.11,0,.64,.64,.09,mats.steel);
   b(wash,cx,1.14,.61,.21,.42,.06,mats.pipe);
 }
 tube(wash,[[-1.25,2.41,0],[-1.25,3.0,-.35],[0,3.05,-.35],[1.5,3.05,-.35],[1.5,2.40,0]],.052,mats.pipe);
 label(wash,'CIP 清洗區',0,3.85,.66,2.8);
 // Stainless buffer tank, milk transfer and vacuum pump outside the operator pit.
 const room=new THREE.Group();room.position.set(-12.0,0,-3);scene.add(room);
 cy(room,0,1.55,0,1.42,1.42,3.0,mats.tank,24);
 cy(room,0,3.08,0,1.43,1.43,.2,mats.metal,24);
 for(const zz of [-.65,.65])b(room,.7,.55,zz,.20,1,.20,mats.steel);
 tube(room,[[1.40,1.58,0],[2.16,1.6,0],[2.34,2.2,0],[3.7,2.2,.5]],.11,mats.pipe);
 const motor=new THREE.Group();motor.position.set(-2.15,0,1.65);room.add(motor);
 cy(motor,0,.57,0,.47,.47,.83,mats.steel,16);
 b(motor,0,.18,0,1.2,.25,1.05,mats.rail);
 label(room,'設備間 · 集乳系統',0,4.2,-.1,3.6);
 // Decorated floor runners: damp but not pooled; hazards not assumed.
 for(const side of [-1,1])for(const z of [-9,-3,3,9]){
   b(farm,side*2.10,.13,z,.095,.015,2.2,mats.warning);
 }
 function animate(stage,t){
   for(const g of gates){
     const open=g.inbound?stage==='arrival':stage==='departure';
     const k=open?1:0;
     const targetAngle=(g.side===-1?-1:1)*k*.95;
     g.hinge.rotation.y+=(targetAngle-g.hinge.rotation.y)*.12;
   }
   signal.material=stage==='cleaning'?mats.cleaning:(stage==='complete'?mats.stopped:mats.running);
   signal.scale.x=stage==='cleaning'?.36:.27;
   signal.material.needsUpdate=false;
 }
 return {animate,points:[
   {id:'washStation',name:'清洗控制',x:1.40,z:5.20,kind:'cleaning'},
   {id:'tools',name:'前處理用品',x:-1.48,z:4.75,kind:'tools'},
   {id:'pipeline',name:'乳管與真空管',x:-1.52,z:1.4,kind:'pipeline'}
 ]};
}
