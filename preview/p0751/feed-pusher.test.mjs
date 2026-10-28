// node preview/p066/feed-pusher.test.mjs
import assert from 'node:assert/strict';
import {createMasterplan} from './farm-masterplan.mjs';
import {createFeedPusher,FUTURE_FEED_JOB} from './feed-pusher.mjs';
import {rebuildDairyFacilities} from './realistic-facilities.mjs';
class Vec{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Group{constructor(){this.name='';this.children=[];this.position=new Vec();this.rotation={x:0,y:0,z:0};this.scale=new Vec(1,1,1);this.visible=true;}add(x){this.children.push(x)}}
class Mesh extends Group{constructor(geometry,material){super();this.geometry=geometry;this.material=material}}
class Geo{constructor(...args){this.args=args}}
const THREE={Vector3:Vec,Mesh,Group,BoxGeometry:Geo,SphereGeometry:Geo,CylinderGeometry:Geo,
 TorusGeometry:Geo,ConeGeometry:Geo,PlaneGeometry:Geo,TubeGeometry:Geo,CatmullRomCurve3:Geo,
 CanvasTexture:Geo,MeshBasicMaterial:Geo,MeshStandardMaterial:Geo,DoubleSide:2,SRGBColorSpace:'srgb'};
const ctx={fillText(){},fillRect(){},strokeRect(){}};
globalThis.document={createElement:()=>({width:512,height:160,getContext:()=>ctx})};
assert.equal(FUTURE_FEED_JOB.status,'preview-only');
for(const mobile of [true,false]){
 const root=new Group();
 const world=createMasterplan({THREE,scene:root,mobile});
 const facility=rebuildDairyFacilities({THREE,master:world,mobile});
 assert.equal(facility.interactables.length,56);
 assert.equal(facility.counts.lactating,16);
 const cows=facility.lactating.cowInfo, robot=facility.lactating.feedPusher;
 assert.equal(cows.length,mobile?24:32);
 assert(cows.every(c=>c.monitor&&c.estrusMonitor&&c.number));
 assert.equal(facility.lactating.assetCounts.estrusSensors,cows.length);
 assert.equal(robot.assets.tmrPortions,mobile?32:44);
 assert.equal(robot.status.mode,'docked');
 assert.equal(robot.status.distance,0);
 let last=0,count=0;
 assert.match(robot.start(),/出發/);
 while(robot.status.mode==='running'&&count<2000){
   robot.update(.035);
   assert(robot.status.distance>=last);
   last=robot.status.distance;count++;
 }
 assert.equal(robot.status.mode,'finished');
 assert.equal(robot.status.completed,robot.status.total,'feed portions pushed');
 assert(Math.hypot(robot.status.position.x,robot.status.position.z+24.9)<.3,'docked at base');
 assert.match(robot.reset(),/回到充電站/);
 assert.equal(robot.status.mode,'docked');
 assert.equal(robot.status.completed,0);
 robot.start();robot.update(.1);robot.pause();
 const hold=robot.status.distance;robot.update(3);assert.equal(robot.status.distance,hold,'pause respects operator');
 robot.start();robot.update(.2);assert(robot.status.distance>hold,'resume is possible');
 const all=(g,key)=> (g.name?.includes(key)?1:0)+g.children.reduce((sum,x)=>sum+all(x,key),0);
 assert.equal(all(world.interiors.get('lactating'),'Estrus detection accelerometer transmitter'),2*cows.length);
 assert(all(world.interiors.get('lactating'),'TMR visible chopped forage piece')>=90);
 assert.equal(all(world.interiors.get('lactating'),'Autonomous low-profile circular feed pusher'),1);
 assert.equal(all(world.interiors.get('lactating'),'Autonomous pusher charging point'),1);
 for(const id of ['lactating-tmr','lactating-pusher','lactating-estrus'])
   assert(facility.interactables.some(x=>x.id===id));
 console.log('PASS',mobile?'mobile':'desktop','cows',cows.length,'feed portions',robot.assets.tmrPortions,'segments',count);
}
