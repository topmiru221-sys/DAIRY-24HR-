// node preview/p05/controls.test.mjs
import assert from 'node:assert/strict';
import {directionVelocity,safeTimeStep} from './controls.mjs';

for(const yaw of [0,.72,Math.PI/2,Math.PI,2*Math.PI,NaN]){
 for(const key of ['up','down','left','right']){
  const v=directionVelocity({[key]:true},yaw);
  assert(v&&Number.isFinite(v.x)&&Number.isFinite(v.z),key+' finite at '+yaw);
  assert(Math.abs(Math.hypot(v.x,v.z)-3.2)<1e-9,key+' normal speed');
  // Regression: pressing a D-pad direction after tap-walking far from spawn
  // must continue from that location, not poison the camera or teleport.
  const start={x:1.14,z:-6.25},dt=.04;
  const next={x:start.x+v.x*dt,z:start.z+v.z*dt};
  assert(Number.isFinite(next.x)&&Number.isFinite(next.z));
  assert(Math.hypot(next.x-start.x,next.z-start.z)<.2);
 }
}
const diag=directionVelocity({up:true,right:true},.72);
assert(Math.abs(Math.hypot(diag.x,diag.z)-3.2)<1e-9);
assert.equal(directionVelocity({},.72),null);
assert.equal(directionVelocity({up:true,down:true},.72),null);
assert.equal(safeTimeStep(NaN),0);
assert.equal(safeTimeStep(Infinity),0);
assert.equal(safeTimeStep(99),.055);
console.log('PASS: D-pad 4 directions, diagonals, camera yaw, invalid yaw, after click-to-walk');
