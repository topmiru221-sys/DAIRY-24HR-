// node preview/p055/working-parlor.test.mjs
import assert from 'node:assert/strict';
import {installWorkingParlor} from './working-parlor.mjs';
class V {
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
 clone(){return new V(this.x,this.y,this.z)}
}
class Group {
 constructor(){this.position=new V();this.rotation={x:0,y:0,z:0};this.scale=new V(1,1,1);this.children=[]}
 add(o){this.children.push(o)}
}
class Mesh extends Group {
 constructor(geometry,material){super();this.geometry=geometry;this.material=material}
}
class Stub {constructor(...args){this.args=args}}
const THREE={Vector3:V,Group,Mesh,
 MeshStandardMaterial:Stub,MeshBasicMaterial:Stub,
 BoxGeometry:Stub,CylinderGeometry:Stub,SphereGeometry:Stub,
 CatmullRomCurve3:Stub,TubeGeometry:Stub};
const cattle=Array.from({length:10},(_,i)=>{
 const group=new Group();group.position.set(i<5?-5.35:5.35,.38,-7.65+(i%5)*3.5);
 const head=new Group();head.position.set(.95,1.63,0);
 return {group,head,legs:Array.from({length:4},()=>new Group())};
});
function person(x,z) {
 const root=new Group();root.position.set(x,0,z);
 return {root,limbs:{rightArm:new Group(),leftArm:new Group(),rightLeg:new Group(),leftLeg:new Group()}};
}
const meiling=person(-.78,-2.75),worker=person(1.05,-7);
const system=installWorkingParlor({THREE,farm:new Group(),cattle,meiling,worker,mobile:true});
assert.equal(system.units.length,10,'ten dairy-cow work stations');
for(const seconds of [0,2.5,19,49,89,123,151,300]){
 system.animate(seconds);
 assert.equal(system.outputs.stages.length,10);
 assert.equal(system.outputs.milking+system.outputs.preparing+system.outputs.finished,10);
 for(const u of system.units){
  assert(Number.isFinite(u.animal.scale.y));
  assert(u.meter.scale.x>0&&u.meter.scale.x<=.12);
  assert(u.cow.head.position.y>1.60&&u.cow.head.position.y<1.66,
    'cow heads stay attached to necks');
  assert(['準備中','榨乳中','完成'].includes(u.stage));
 }
}
assert.equal(system.units.filter(u=>u.cluster.children.length>10).length,10);
console.log('PASS: ten bays, flow meters, 3 work stages, animal/staff animation, finite transforms');
