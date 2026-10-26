// node preview/p060/farm-content.test.mjs
import assert from 'node:assert/strict';
import {createMasterplan} from './farm-masterplan.mjs';
import {CONTENT_AREAS,CONTENT_SPEC,populateFarmContents} from './farm-content.mjs';
class Vec{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Group{constructor(){this.children=[];this.position=new Vec();this.rotation={x:0,y:0,z:0};this.scale=new Vec(1,1,1);this.visible=true;this.name=''}add(x){this.children.push(x)}}
class Mesh extends Group{constructor(geo,material){super();this.geometry=geo;this.material=material}}
class Obj{constructor(...args){this.args=args}}
const THREE={Vector3:Vec,Group,Mesh,BoxGeometry:Obj,CylinderGeometry:Obj,
 SphereGeometry:Obj,ConeGeometry:Obj,PlaneGeometry:Obj,CanvasTexture:Obj,
 MeshStandardMaterial:Obj,MeshBasicMaterial:Obj,DoubleSide:2,SRGBColorSpace:'srgb'};
const ctx={fillRect(){},strokeRect(){},fillText(){}};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const scene=new Group();
const master=createMasterplan({THREE,scene,mobile:true});
const content=populateFarmContents({THREE,master,mobile:true});
assert.equal(CONTENT_AREAS.length,11);
assert.equal(content.stations.length,33);
assert.equal(content.totalProps,38);
assert.equal(new Set(content.stations.map(s=>s.id)).size,33);
for(const zone of CONTENT_AREAS){
 const root=master.interiors.get(zone);
 assert(root,'room exists for '+zone);
 assert(root.children.some(ch=>ch.name?.startsWith('P060 real scene content')),'content added '+zone);
 assert.equal(content.counts[zone],3,'3 hotspots per area');
 assert.equal(CONTENT_SPEC[zone].spots.length,3);
 for(const s of content.stations.filter(s=>s.area===zone)){
  assert(Math.abs(s.x)<=1.82 && Math.abs(s.z)<=9.7,'reachable aisle '+s.id);
  assert(s.text && s.alternate && s.name,'contextual dialogue '+s.id);
 }
}
for(const t of [0,2,15,120]){
 for(const zone of CONTENT_AREAS)content.animate(t,zone);
}
const traverse=(node,arr=[])=>{arr.push(node);for(const child of node.children||[])traverse(child,arr);return arr};
for(const zone of CONTENT_AREAS){
 const objects=traverse(master.interiors.get(zone));
 assert(objects.length>25,'recognizable 3D composition '+zone);
 for(const o of objects){
  if(o.position)assert([o.position.x,o.position.y,o.position.z].every(Number.isFinite),'no NaN in '+zone);
 }
}
console.log('PASS: 11 populated interiors, 33 unique accessible hotspots, restrained zone animation, finite geometry');
