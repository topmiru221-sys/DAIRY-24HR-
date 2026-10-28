import assert from 'node:assert/strict';
import {TRANSITION_BARN_AREAS,TRANSITION_BARN_POINTS} from './transition-barns.mjs';

assert.deepEqual(TRANSITION_BARN_AREAS,['dry','closeup']);
for(const area of TRANSITION_BARN_AREAS){
 assert.equal(TRANSITION_BARN_POINTS[area].length,5,area+' has five new refinement interactions');
 assert.equal(new Set(TRANSITION_BARN_POINTS[area].map(v=>v.id)).size,5,area+' ids are unique');
 for(const point of TRANSITION_BARN_POINTS[area]){
  assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.z),'interaction is reachable');
  assert.ok(point.text.length>20,'interaction explains its scope');
 }
}
const all=[...TRANSITION_BARN_POINTS.dry,...TRANSITION_BARN_POINTS.closeup];
assert.equal(new Set(all.map(v=>v.id)).size,10,'cross-area ids are unique');
assert.ok(all.some(v=>v.id==='dry-gate'));
assert.ok(all.some(v=>v.id==='closeup-light'));
console.log('PASS: P0.6.8 dry and Close-up refinement interaction contract');
