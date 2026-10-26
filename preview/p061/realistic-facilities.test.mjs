// Run: node preview/p061/realistic-facilities.test.mjs
import assert from 'node:assert/strict';
import {createMasterplan,ZONES,AREA_IDS,SKELETON_ZONES} from './farm-masterplan.mjs';
import {rebuildDairyFacilities,FACILITY_IDS,FACILITY_LABELS,REAL_WORLD_SOURCES} from './realistic-facilities.mjs';
class Vec{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Group{constructor(){this.position=new Vec();this.rotation={x:0,y:0,z:0};this.scale=new Vec(1,1,1);this.children=[];this.visible=true;this.name=''}add(c){this.children.push(c)}}
class Mesh extends Group{constructor(g,m){super();this.geometry=g;this.material=m}}
class Obj{constructor(...args){this.args=args}}
const THREE={Vector3:Vec,Group,Mesh,BoxGeometry:Obj,SphereGeometry:Obj,
 CylinderGeometry:Obj,ConeGeometry:Obj,CatmullRomCurve3:Obj,TubeGeometry:Obj,
 PlaneGeometry:Obj,CanvasTexture:Obj,MeshBasicMaterial:Obj,
 MeshStandardMaterial:Obj,SRGBColorSpace:'srgb',DoubleSide:2};
const ctx={fillRect(){},strokeRect(){},fillText(){}};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
assert.equal(ZONES.length,16);
assert.equal(AREA_IDS.length,15);
assert.equal(SKELETON_ZONES.length,11);
assert.equal(FACILITY_IDS.length,11);
const scene=new Group(),master=createMasterplan({THREE,scene,mobile:true});
const model=rebuildDairyFacilities({THREE,master,mobile:true});
assert.equal(master.entries.length,14);
assert.equal(master.interiors.size,11);
assert.equal(model.interactables.length,33);
const counter=(g)=>1+g.children.reduce((n,c)=>n+counter(c),0);
const sceneCounts={};
for(const area of FACILITY_IDS){
 const root=master.interiors.get(area);
 assert(root,'each rebuilt area has original room locator: '+area);
 assert(FACILITY_LABELS[area]&&REAL_WORLD_SOURCES[area]);
 assert.equal(model.counts[area],3);
 assert(root.children.some(o=>String(o.name).includes('Real-farm redesign')),'real-specific group '+area);
 sceneCounts[area]=counter(root);
 assert(sceneCounts[area]>45,'sufficient unique geometry '+area);
 for(const hotspot of model.interactables.filter(v=>v.area===area)){
  assert(hotspot.kind==='real-facility');
  assert(hotspot.text&&hotspot.name&&hotspot.source);
  assert(Math.abs(hotspot.x)<=1.82 && Math.abs(hotspot.z)<=9.75,'in accessible aisle '+hotspot.id);
 }
 for(const t of [0,1,12,88])model.animate(t,area);
}
assert.equal(new Set(model.interactables.map(v=>v.id)).size,33);
function find(node,needle){if(node.name?.includes(needle))return node;for(const c of node.children){const f=find(c,needle);if(f)return f}return null}
assert(find(master.interiors.get('calf'),'Cow')&&find(master.interiors.get('calf'),'Real-farm redesign'),'calf pen animals');
assert(find(master.interiors.get('veterinary'),'Treatment restraint chute'),'separate treatment chute');
assert(find(master.interiors.get('manure'),'Liquid containment'),'fenced wastewater containment');
assert(find(master.interiors.get('feed'),'TMR wagon'),'mixer truck');
assert(find(master.interiors.get('machinery'),'Parked tractor'),'maintenance tractor');
assert(find(master.interiors.get('lactating'),'Barn roof fan'),'barn ventilation');
console.log('PASS: 11 realistic layout families, 33 accessible hotspots, 14 original gateways, old map preserved');
console.log(sceneCounts);
