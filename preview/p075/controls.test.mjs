// node preview/p054/controls.test.mjs
import assert from 'node:assert/strict';
import {directionVelocity,safeTimeStep} from './controls.mjs';
for(const yaw of [0,.72,1.57,3.14,6.28,NaN]){
 for(const dir of ['up','down','left','right']){
  const v=directionVelocity({[dir]:true},yaw);
  assert(v&&Number.isFinite(v.x)&&Number.isFinite(v.z));
  assert(Math.abs(Math.hypot(v.x,v.z)-3.2)<1e-7);
 }
}
assert.equal(directionVelocity({},.72),null);
assert.equal(safeTimeStep(NaN),0);
console.log('P0.5.4 movement baseline checks: PASS');
