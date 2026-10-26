// node preview/p056/cycle.test.mjs
import assert from 'node:assert/strict';
import {STAGES,createMilkingCycle} from './cycle.mjs';
const c=createMilkingCycle();
assert.equal(STAGES.length,8);
assert.equal(c.snapshot().key,'arrival');
assert.equal(c.snapshot().playing,false);
c.toggle();assert.equal(c.snapshot().playing,true);
for(let i=0;i<7;i++){const start=c.snapshot();for(let j=0;j<500 && c.snapshot().key===start.key;j++)c.update(.1);assert.notEqual(c.snapshot().key,start.key)}
assert.equal(c.snapshot().key,'complete');assert.equal(c.snapshot().playing,false);
const last=c.snapshot().round;c.replay();assert.equal(c.snapshot().round,last+1);
c.jump();assert.equal(c.snapshot().key,'prepare');
c.help();assert.equal(c.snapshot().helps,1);
c.toggle();assert.equal(c.snapshot().playing,false);
c.update(1000);assert.equal(c.snapshot().key,'prepare');
assert.equal(c.snapshot().progress,0);
c.jump();assert.equal(c.snapshot().key,'attach');
assert.equal(c.snapshot().progress,0);
console.log('PASS: 8 steps, pausing, time, replay, jump, help and no forced dialogue');
