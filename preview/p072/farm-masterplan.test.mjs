// node preview/p059/farm-masterplan.test.mjs
import assert from 'node:assert/strict';
import {ZONES,AREA_IDS,SKELETON_ZONES,TAIWAN_LINEAR_LAYOUT,findZone,areaName,createMasterplan} from './farm-masterplan.mjs';
assert.equal(ZONES.length,16,'all major facility/traffic-site locations exist');
assert.equal(AREA_IDS.length,15,'farm exterior + 14 enterable rooms');
assert.equal(SKELETON_ZONES.length,11,'11 intentionally basic interiors');
assert.equal(ZONES.filter(z=>z.built).length,3,'protect 3 completed scenes');
assert.equal(findZone('lactating').refined,true,'lactating barn remains marked as refined');
for(const id of AREA_IDS){assert(id==='farm'||findZone(id));assert(areaName(id))}
assert.equal(new Set(ZONES.map(z=>z.id)).size,16,'unique IDs');
assert.deepEqual(TAIWAN_LINEAR_LAYOUT.front,['loading','tank','parlor','office']);
assert.deepEqual(TAIWAN_LINEAR_LAYOUT.milkingFlow,['lactating','holding','parlor','tank']);
assert.deepEqual(TAIWAN_LINEAR_LAYOUT.mainBarn,['lactating','dry','closeup','fresh']);
assert.deepEqual(TAIWAN_LINEAR_LAYOUT.youngstock,['heifer-pregnant','heifer-large','heifer-small','calf']);
assert(findZone('tank').z===findZone('parlor').z&&findZone('parlor').z===findZone('office').z,'milk collection, parlor and office share the front work line');
assert(findZone('lactating').x===findZone('dry').x&&findZone('dry').x===findZone('closeup').x&&findZone('closeup').x===findZone('fresh').x,'main cattle areas share one long barn axis');
assert(findZone('calf').x===findZone('heifer').x&&findZone('calf').z>findZone('heifer').z,'independent calf barn follows the youngstock side');
assert.equal(findZone('heifer').flow,'懷孕女牛 → 大女牛 → 小女牛');
class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Object3D{constructor(){this.position=new Vector3();this.rotation={x:0,y:0,z:0};this.scale=new Vector3(1,1,1);this.children=[];this.visible=true;}add(c){this.children.push(c)}}
class Mesh extends Object3D{constructor(geometry,material){super();this.geometry=geometry;this.material=material}}
class Dummy{constructor(...values){this.values=values}}
const THREE={Vector3,Group:Object3D,Mesh,
 MeshStandardMaterial:Dummy,MeshBasicMaterial:Dummy,BoxGeometry:Dummy,
 CylinderGeometry:Dummy,ConeGeometry:Dummy,PlaneGeometry:Dummy,
 CanvasTexture:Dummy,DoubleSide:2,SRGBColorSpace:'srgb'};
const ctx={fillRect(){},strokeRect(){},fillText(){}};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const scene=new Object3D();
const world=createMasterplan({THREE,scene,mobile:true});
assert.equal(world.entries.length,14);
assert.equal(world.interiors.size,11);
assert.equal(world.skeletonStations.length,11);
assert.equal(world.layout,TAIWAN_LINEAR_LAYOUT);
const portals=new Set();
for(const point of world.entries){
 assert(AREA_IDS.includes(point.travelTo),'portal targets live area');
 assert(Math.abs(point.x)<35&&Math.abs(point.z)<37,'portal reachable inside farm bounds');
 const key=point.x+'/'+point.z;
 assert(!portals.has(key),'portals never overlap');
 portals.add(key);
}
world.visibleArea('farm');
assert.equal(world.root.visible,true);
assert([...world.interiors.values()].every(g=>!g.visible));
for(const id of SKELETON_ZONES){
 world.visibleArea(id);
 assert.equal(world.root.visible,false);
 assert.equal(world.interiors.get(id).visible,true);
 assert([...world.interiors].every(([k,g])=>g.visible===(k===id)));
}
world.visibleArea('parlor');
assert.equal(world.root.visible,false);
assert([...world.interiors.values()].every(g=>!g.visible));
console.log('PASS: P0.7.2 Taiwan linear skeleton, 16 locations, 14 unique gateways and protected interiors');
