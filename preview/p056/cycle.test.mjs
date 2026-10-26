// node preview/p056/cycle.test.mjs
import assert from 'node:assert/strict';
import {STAGES,createMilkingCycle} from './cycle.mjs';
const c=createMilkingCycle();
assert.equal(STAGES.length,9);
assert.deepEqual(STAGES.map(x=>x.key),
 ['arrival','prepare','attach','milking','detach','postdip','departure','cleaning','complete']);
assert.equal(c.snapshot().playing,false);
c.toggle();assert.equal(c.snapshot().playing,true);
for(let i=0;i<8;i++){
 const key=c.snapshot().key;
 for(let n=0;n<550&&c.snapshot().key===key;n++)c.update(.1);
 assert.notEqual(c.snapshot().key,key,'stage advances: '+key);
}
assert.equal(c.snapshot().key,'complete');
assert.equal(c.snapshot().playing,false);
const round=c.snapshot().round;
c.replay();assert.equal(c.snapshot().round,round+1);
assert.equal(c.snapshot().key,'arrival');
c.jump();assert.equal(c.snapshot().key,'prepare');
const before=c.snapshot().elapsed;
c.help();assert(c.snapshot().elapsed>before);
assert.equal(c.snapshot().helps,1);
c.help();assert.equal(c.snapshot().helps,1,'no spam-assisted counters');
c.toggle();const paused=c.snapshot().key;c.update(99);assert.equal(c.snapshot().key,paused);
c.toggle();c.jump();assert.equal(c.snapshot().key,'attach');
console.log('PASS: 9-stage full parlor, optional help, pause, skip, replay, no forced-dialogue gates');
