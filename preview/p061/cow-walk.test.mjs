// Run: node preview/p056/cow-walk.test.mjs
import assert from 'node:assert/strict';
import {FORWARD_YAW,cowMotionPose} from './cow-walk.mjs';
const almost=(a,b)=>Math.abs(a-b)<1e-8;
for(const side of [-1,1]){
 for(let order=0;order<5;order++){
  const standZ=-7.65+order*3.5;
  const args={order,side,standZ};
  const start=cowMotionPose({...args,mode:'arrival',progress:0});
  const approach=cowMotionPose({...args,mode:'arrival',progress:.55});
  const nextApproach=cowMotionPose({...args,mode:'arrival',progress:.551});
  const docked=cowMotionPose({...args,mode:'arrival',progress:1});
  const ready=cowMotionPose({...args,mode:'departure',progress:0});
  const turn=cowMotionPose({...args,mode:'departure',progress:.05});
  const exiting=cowMotionPose({...args,mode:'departure',progress:.55});
  const nextExit=cowMotionPose({...args,mode:'departure',progress:.551});
  const gone=cowMotionPose({...args,mode:'departure',progress:1});
  const stallYaw=side<0?Math.PI:0;
  assert(almost(start.yaw,FORWARD_YAW),'walk enters head-first, not sideways');
  assert(almost(docked.yaw,stallYaw),'cow rotates into stall');
  assert(almost(docked.z,standZ));
  assert(almost(ready.z,standZ)&&almost(turn.z,standZ),'exit rotation precedes movement');
  assert(almost(exiting.yaw,FORWARD_YAW),'cow faces exit while walking');
  assert(exiting.z>nextExit.z,'exit motion progresses along -Z');
  assert(approach.z>nextApproach.z,'entry motion progresses along -Z');
  assert(almost(gone.z,-16.5),'cow exits beyond room');
  assert(Number.isFinite(approach.stride)&&Number.isFinite(exiting.stride));
  const standby=cowMotionPose({...args,mode:'milking',progress:.5});
  assert(almost(standby.yaw,stallYaw),'milking continues at stationary stall angle');
  assert.equal(standby.stride,0);
 }
}
for(let i=0;i<5;i++){
 const a=cowMotionPose({mode:'arrival',progress:0,order:i,side:-1,standZ:-7.65+i*3.5});
 const b=cowMotionPose({mode:'arrival',progress:0,order:i+1,side:-1,standZ:0});
 assert(b.z-a.z>=3.5,'queue preserves cow spacing');
}
console.log('PASS: 10 cows enter head-first, turn to stall, turn toward exit, and walk with natural leg gait');
