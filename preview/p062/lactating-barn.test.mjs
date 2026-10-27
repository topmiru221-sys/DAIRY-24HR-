// node preview/p062/lactating-barn.test.mjs
import assert from 'node:assert/strict';
import {createMasterplan,ZONES} from './farm-masterplan.mjs';
import {rebuildDairyFacilities,FACILITY_IDS} from './realistic-facilities.mjs';
import {LACTATING_AREA} from './lactating-barn.mjs';
class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class Obj{constructor(){this.name='';this.position=new Vector3();this.rotation={x:0,y:0,z:0};this.scale=new Vector3(1,1,1);this.visible=true;this.children=[]}add(c){this.children.push(c)}}
class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}}
class Material{constructor(args){this.args=args}}
class Geometry{constructor(...args){this.args=args}}
const THREE={Vector3,Mesh,Group:Obj,MeshStandardMaterial:Material,MeshBasicMaterial:Material,
 BoxGeometry:Geometry,CylinderGeometry:Geometry,SphereGeometry:Geometry,TubeGeometry:Geometry,
 TorusGeometry:Geometry,ConeGeometry:Geometry,CatmullRomCurve3:Geometry,
 PlaneGeometry:Geometry,CanvasTexture:Geometry,DoubleSide:2,SRGBColorSpace:'srgb'};
const context={fillRect(){},strokeRect(){},fillText(){}};
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
function search(g,needle){
 if(g.name?.includes(needle))return g;
 for(const child of g.children){const found=search(child,needle);if(found)return found}
 return null
}
function collect(g,fn,result=[]){
 if(fn(g))result.push(g);
 for(const child of g.children)collect(child,fn,result);
 return result;
}
function run(mobile){
 const scene=new Obj(),master=createMasterplan({THREE,scene,mobile});
 const rebuilt=rebuildDairyFacilities({THREE,master,mobile});
 const enriched=rebuilt.lactating;
 const room=master.interiors.get('lactating');
 assert(room);
 assert.equal(FACILITY_IDS.length,11);
 assert.equal(ZONES.length,16);
 assert.equal(master.entries.length,14);
 assert.equal(rebuilt.counts.lactating,6);
 for(const zone of FACILITY_IDS.filter(v=>v!=='lactating'))assert.equal(rebuilt.counts[zone],3);
 assert.equal(rebuilt.interactables.length,36);
 assert.equal(enriched.cowInfo.length,mobile?12:16);
 assert.equal(enriched.assetCounts.cows,mobile?12:16);
 assert.equal(enriched.assetCounts.fans,mobile?12:18);
 assert.equal(enriched.assetCounts.scrapers,2);
 assert.equal(enriched.assetCounts.sprinklerNozzles,10);
 assert(enriched.cowInfo.every(c=>c.monitor&&c.number));
 assert.equal(new Set(enriched.cowInfo.map(c=>c.id)).size,enriched.cowInfo.length);
 const behavior=new Set(enriched.cowInfo.map(c=>c.behavior));
 for(const required of ['lying-stall','barn-walking','feeding','yard-walking','yard-standing','yard-lying'])
   assert(behavior.has(required),'mixed natural herd behaviors: '+required);
 assert(search(room,'OUTDOOR_EXERCISE_YARD'),'yard connected to barn');
 assert(search(room,'High open-sided roof'),'ventilated structure');
 assert(search(room,'manure scraper'),'mechanical scrapers installed');
 assert(search(room,'Cow back number 1201'),'cow back ID texture');
 assert(search(room,'Rumination and activity sensor'),'neck health sensor');
 assert(search(room,'Intermittent cow-only soaking droplets'),'feed-front nozzles');
 assert.equal(enriched.state().soakerOn,false,'spray OFF until explicitly activated');
 assert.match(enriched.interact('lactating-soaker'),/已啟動/);
 assert.equal(enriched.state().soakerOn,true);
 for(let i=0;i<91;i++)enriched.animate(i*.1,.1);
 assert.equal(enriched.state().soakerOn,false,'demonstration soaker auto-off');
 assert.match(enriched.interact('lactating-scraper'),/啟動/);
 for(let i=0;i<225;i++)enriched.animate(i*.1,.1);
 assert.equal(enriched.state().scraperRunning,false,'scraper auto-off');
 const entry=LACTATING_AREA.entry,b=LACTATING_AREA.bounds;
 assert(b.xmin< -20&&b.xmax>20&&b.zmin< -25&&b.zmax>29);
 assert(entry.x>=b.xmin&&entry.x<=b.xmax&&entry.z>=b.zmin&&entry.z<=b.zmax);
 for(const hotspot of rebuilt.interactables.filter(v=>v.area==='lactating'))
  assert(hotspot.x>=b.xmin&&hotspot.x<=b.xmax&&hotspot.z>=b.zmin&&hotspot.z<=b.zmax,'six visitable points');
 const negative=collect(room,x=>x.geometry?.args?.some(v=>typeof v==='number'&&v<0));
 // Some negative numbers are valid Three.js transformed coordinates, so
 // check only that poses and per-object scale remain finite.
 const all=collect(room,x=>x.position);
 assert(all.every(o=>[o.position.x,o.position.y,o.position.z,o.scale.x,o.scale.y,o.scale.z].every(Number.isFinite)));
 return {mobile,geometryNodes:all.length,herd:enriched.cowInfo.length,fanCount:enriched.assetCounts.fans,
  behavior:[...behavior],manureScrapers:enriched.assetCounts.scrapers};
}
console.log('PASS',run(true),run(false));
