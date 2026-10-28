// node preview/p067/barn-operations.test.mjs
// Integration regression for seven new barn capabilities (no WebGL required).
import assert from 'node:assert/strict';
import {createMasterplan} from './farm-masterplan.mjs';
import {rebuildDairyFacilities} from './realistic-facilities.mjs';
class Vec{
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
}
class Group{
 constructor(){this.name='';this.children=[];this.position=new Vec();this.rotation={x:0,y:0,z:0};this.scale=new Vec(1,1,1);this.visible=true}
 add(obj){this.children.push(obj)}
}
class Mesh extends Group{constructor(geo,mat){super();this.geometry=geo;this.material=mat}}
class Geo{constructor(...args){this.args=args}}
const THREE={Vector3:Vec,Mesh,Group,BoxGeometry:Geo,SphereGeometry:Geo,CylinderGeometry:Geo,
 TorusGeometry:Geo,ConeGeometry:Geo,PlaneGeometry:Geo,TubeGeometry:Geo,CatmullRomCurve3:Geo,
 CanvasTexture:Geo,MeshBasicMaterial:Geo,MeshStandardMaterial:Geo,DoubleSide:2,SRGBColorSpace:'srgb'};
globalThis.document={createElement:()=>({width:512,height:160,getContext:()=>({fillText(){},fillRect(){},strokeRect(){}})})};
for(const mobile of [true,false]){
 const root=new Group(),master=createMasterplan({THREE,scene:root,mobile});
 const facilities=rebuildDairyFacilities({THREE,master,mobile});
 const barn=facilities.lactating,ops=barn.operations,pusher=barn.feedPusher;
 assert.equal(facilities.counts.lactating,16);
 assert.equal(facilities.interactables.length,56);
 assert.equal(barn.cowInfo.length,mobile?24:32);
 assert.equal(ops.state().lighting,'day');
 assert.equal(ops.cycleLighting(),'dusk');
 assert.equal(ops.cycleLighting(),'night');
 assert.match(ops.toggleHeadlocks(),/鎖定/);
 assert.equal(ops.state().headlockCount,8);
 assert.match(ops.toggleHeadlocks(),/釋放/);
 pusher.start();ops.toggleObstacle();
 for(let i=0;i<1000&&pusher.status.mode!=='blocked';i++){
  pusher.update(.05);ops.update(i*.05,.05);
 }
 assert.equal(pusher.status.mode,'blocked','robot must stop before maintenance obstruction');
 const distance=pusher.status.distance;pusher.update(.05);
 assert.equal(distance,pusher.status.distance,'blocked robot never crosses obstacle');
 ops.toggleObstacle();pusher.update(.05);
 assert.equal(pusher.status.mode,'running','robot resumes when passage becomes safe');
 const rationBefore=ops.state().rationPercent;
 for(let i=0;i<300;i++)ops.update(i*.05,.05);
 assert(ops.state().rationPercent<rationBefore,'TMR reduces over time');
 pusher.refill();assert.equal(ops.state().rationPercent,100);
 assert.match(ops.startTransfer(),/3 頭/);
 for(let i=0;i<320;i++)barn.animate(i*.07,.07);
 assert.equal(ops.state().transfer,'parlor-ready');
 assert.match(ops.returnHerd(),/返回/);
 for(let i=0;i<320;i++)barn.animate(23+i*.07,.07);
 assert.equal(ops.state().transfer,'idle');
 assert(ops.state().sensor.history.length>0,'simulated rolling sensor history present');
 const before=ops.state().sensor.id;ops.pickCow();
 assert.notEqual(ops.state().sensor.id,before);
 assert.match(ops.state().sensor.kind,/NOT CLINICAL/);
 console.log('PASS',mobile?'mobile':'desktop','P0.6.7 barn upgrades and legacy cow count');
}
