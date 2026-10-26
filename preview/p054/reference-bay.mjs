// P0.5.4 – one reference-quality milking bay (cow #1242).
// Original low-poly geometry. Inspired by the user's teaching slides:
// udder, four teat cups, claw, short milk tubes, long milk/vacuum hose,
// pulsator, gauge, milk meter and nearby pre-milking tools.
export function buildReferenceBay({THREE, farm, scene, cow, meiling, mobile=false}) {
  const material=(hex,metal=0,rough=.65,emissive=0)=>new THREE.MeshStandardMaterial({
    color:hex,metalness:metal,roughness:rough,emissive:emissive||0
  });
  const steel=material(0xaebbc0,.65,.26), rim=material(0xdde5e6,.75,.24);
  const rubber=material(0x222f32,0,.88), liner=material(0x182126,0,.95);
  const udderPink=material(0xd8a39b,0,.92), teatPink=material(0xce918a,0,.89);
  const milkTube=material(0xdad9c8,.05,.38), vacuumTube=material(0x427387,.04,.59);
  const plastic=material(0x34616f,.15,.6), label=material(0xf5ce65,0,.6);
  const green=new THREE.MeshBasicMaterial({color:0x4fe1ad});
  const milkGlass=new THREE.MeshPhysicalMaterial({color:0xdce8e6,transparent:true,opacity:.8,roughness:.16,metalness:.15});
  const cube=new THREE.BoxGeometry(1,1,1);
  function bx(p,x,y,z,w,h,d,m) {
    const o=new THREE.Mesh(cube,m);o.position.set(x,y,z);o.scale.set(w,h,d);
    o.castShadow=!mobile&&w*h*d>.13;o.receiveShadow=true;p.add(o);return o;
  }
  function cylinder(p,x,y,z,top,bottom,h,m,segments=12) {
    const o=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,h,segments),m);
    o.position.set(x,y,z);o.castShadow=!mobile&&top*bottom*h>.017;p.add(o);return o;
  }
  function sphere(p,x,y,z,rx,ry,rz,m,n=16) {
    const o=new THREE.Mesh(new THREE.SphereGeometry(1,n,10),m);
    o.scale.set(rx,ry,rz);o.position.set(x,y,z);
    o.castShadow=!mobile&&rx*ry*rz>.016;p.add(o);return o;
  }
  function hose(p,points,radius,m) {
    const curve=new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v)));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*7),radius,7,false),m);
    mesh.castShadow=false;p.add(mesh);return mesh;
  }
  // The existing prototype's milking unit sat in the central walking pit.
  // New equipment follows the real geometry: behind the cow's hind legs,
  // below the udder, with hoses extending to the fixed machine at the pit wall.
  const animal=cow.group;
  const bay=new THREE.Group();bay.name='P054_udder_and_cluster_1242';animal.add(bay);
  sphere(bay,-.23,.76,0,.62,.34,.47,udderPink,18);
  sphere(bay,-.40,.61,.03,.38,.22,.37,udderPink,12);
  // Four real-looking suspended teats (two in front, two behind).
  const cupCenters=[];
  for(const x of [-.48,-.05])for(const z of [-.245,.245]){
    const teat=cylinder(bay,x,.43,z,.078,.062,.33,teatPink,12);
    sphere(bay,x,.29,z,.065,.047,.065,teatPink,10);
    const cupY=.34;
    const cup=cylinder(bay,x,cupY,z,.098,.075,.35,steel,14);
    cylinder(bay,x,.515,z,.104,.096,.063,liner,14);
    cylinder(bay,x,.485,z,.114,.111,.023,rubber,14);
    cylinder(bay,x,.19,z,.065,.072,.085,rubber,12);
    const stripe=cylinder(bay,x,.22,z,.083,.079,.026,rim,14);
    cupCenters.push({x,z});
  }
  // One milking claw at the end of four individually routed short milk tubes.
  const clawX=-.43,clawY=.055,clawZ=0;
  for(const {x,z} of cupCenters) {
    hose(bay,[[x,.17,z],[x,.10,z],[x+(clawX-x)*.39,-.005,z*.85],[clawX,clawY,clawZ]],.033,milkTube);
    hose(bay,[[x,.51,z],[x,.59,z],[x-.29,.52,z],[clawX-.34,.30,z*.7]],.018,vacuumTube);
  }
  sphere(bay,clawX,clawY,clawZ,.25,.18,.23,rubber,16);
  sphere(bay,clawX,clawY+.10,clawZ,.22,.12,.19,milkGlass,16);
  cylinder(bay,clawX,clawY-.11,clawZ,.13,.09,.10,rim,12);
  // Curved hoses lead toward the work pit and connect to a fixed milk line.
  // Cow #1242 is on the left row (180° rotation): local -X points into the pit.
  hose(bay,[[clawX-.20,.02,0],[-.9,-.13,-.18],[-1.45,.02,-.36],[-2.05,.32,-.48],
           [-2.68,.63,-.42],[-2.72,1.13,-.20]],.057,milkTube);
  hose(bay,[[clawX-.31,.33,0],[-1.10,.33,.22],[-1.68,.54,.30],[-2.60,1.30,.16],
           [-2.72,1.98,.12]],.034,vacuumTube);
  // Cow detail: matching spots at the rump, flexible-looking tail tuft, udder crease.
  sphere(bay,-.86,1.56,.67,.31,.22,.037,rubber,12);
  sphere(bay,-.65,1.90,-.67,.32,.24,.032,rubber,12);
  bx(bay,-.10,.76,-.455,.49,.04,.03,teatPink);
  // Fixed accessories at operator-facing edge of this bay.
  const g=new THREE.Group();g.position.set(-2.7,0,-4.15);g.name='P054_pulsator_and_meter';farm.add(g);
  bx(g,0,2.00,0,.11,2.2,.12,steel);
  bx(g,.00,2.14,.12,.40,.32,.29,plastic);
  bx(g,0,2.16,.28,.30,.17,.02,rubber);
  bx(g,-.095,2.17,.294,.055,.047,.015,green);
  bx(g,.095,2.17,.294,.055,.047,.015,label);
  // Small milk-flow window and stylised readout.
  bx(g,-.02,1.63,.17,.46,.54,.20,steel);
  bx(g,-.02,1.72,.287,.36,.24,.02,plastic);
  bx(g,.08,1.70,.305,.18,.048,.01,green);
  for(let k=0;k<4;k++)bx(g,-.15+k*.085,1.61,.29,.032,.038,.01,k%2?label:green);
  // A circular vacuum gauge (visual model, no fabricated clinical number).
  const gauge=new THREE.Group();gauge.position.set(.03,2.75,-.01);g.add(gauge);
  const dial=cylinder(gauge,0,0,0,.19,.19,.09,steel,28);dial.rotation.x=Math.PI/2;
  const disk=cylinder(gauge,0,0,.06,.161,.161,.012,material(0xf4f4df),24);disk.rotation.x=Math.PI/2;
  const needle=bx(gauge,.017,.02,.075,.02,.125,.012,rubber);needle.rotation.z=-.54;
  // Storage shelf with a teat-dip bottle, cup and clean towels.
  const prep=new THREE.Group();prep.name='P054_preparation_tools';prep.position.set(-1.55,0,-2.35);farm.add(prep);
  bx(prep,0,1.12,0,.88,.09,.47,steel);
  for(const x of [-.38,.38])bx(prep,x,.65,.0,.055,.94,.055,steel);
  cylinder(prep,-.25,1.33,.0,.10,.10,.33,plastic,12);
  cylinder(prep,-.25,1.54,.0,.055,.07,.12,label,12);
  bx(prep,.08,1.22,.01,.31,.05,.25,material(0xf3f0e7));
  bx(prep,.08,1.28,.01,.31,.05,.25,material(0xfaf7ed));
  bx(prep,.30,1.27,-.08,.16,.21,.16,material(0x355869));
  // Non-animated shelf labels are low-overhead; avoid invented data.
  const textCanvas=document.createElement('canvas');textCanvas.width=384;textCanvas.height=128;
  const ctx=textCanvas.getContext('2d');ctx.fillStyle='#193945';ctx.fillRect(0,0,384,128);
  ctx.strokeStyle='#e7bb6a';ctx.lineWidth=8;ctx.strokeRect(4,4,376,120);
  ctx.fillStyle='#fff6e4';ctx.textAlign='center';ctx.font='bold 42px sans-serif';
  ctx.fillText('1242 號牛位',192,55);ctx.font='25px sans-serif';ctx.fillText('四乳杯 · 集乳座 · 管線',192,98);
  const tex=new THREE.CanvasTexture(textCanvas);tex.colorSpace=THREE.SRGBColorSpace;
  const board=new THREE.Mesh(new THREE.PlaneGeometry(1.55,.52),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));
  board.position.set(-2.30,2.75,-4.15);board.rotation.y=Math.PI/2;farm.add(board);
  // Work animation at the edge of the pit: reach toward the cups, inspect, relax.
  const initial=meiling.root.position.clone();
  const baseY=meiling.root.rotation.y;
  function animate(seconds) {
    const phase=(seconds%12+12)%12;
    const ease=t=>t*t*(3-2*t);
    const reach=phase<2?ease(phase/2):phase<5?1:phase<7?1-ease((phase-5)/2):0;
    meiling.root.position.x=initial.x-.11*reach;
    meiling.root.position.z=initial.z+.08*Math.sin(seconds*.6);
    meiling.root.rotation.y=baseY+.07*Math.sin(seconds*.7);
    meiling.limbs.rightArm.rotation.x=-.17-1.02*reach;
    meiling.limbs.leftArm.rotation.x=.12-.32*reach;
    if(meiling.limbs.rightArm.rotation.z!==undefined)meiling.limbs.rightArm.rotation.z=.15*reach;
  }
  return {animate,featured:animal,claw:bay,station:g};
}
