// P0.5.6.1 — Holstein locomotion along the cow's forward body axis (+X local).
// Three.js yaw +PI/2 aims the head down the room's -Z entry/exit lane.
// Turns happen while slowing or stopped, not while sliding sideways.
export const FORWARD_YAW=Math.PI/2;
const clamp01=v=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const ease=v=>{const t=clamp01(v);return t*t*(3-2*t)};
export function cowMotionPose({mode,progress,order,side,standZ,playing=true}) {
  const stallYaw=side<0?Math.PI:0;
  const delayed=clamp01((clamp01(progress)-order*.105)/(1-order*.105));
  let z=standZ,yaw=stallYaw,visible=true,stride=0;
  if(mode==='arrival') {
    const startZ=14+order*3.55; // same 3.55-unit spacing as holding stalls
    const travel=ease(delayed);
    z=startZ+(standZ-startZ)*travel;
    const turn=ease((delayed-.82)/.18); // turn toward individual stall only at arrival
    yaw=FORWARD_YAW+(stallYaw-FORWARD_YAW)*turn;
    visible=delayed>.0001;
    stride=playing&&delayed>.008&&delayed<.98?(1-turn)*.22:0;
  } else if(mode==='departure') {
    const turn=ease(delayed/.16); // turn in place before moving
    const travel=ease((delayed-.16)/.84);
    z=standZ+(-16.5-standZ)*travel;
    yaw=stallYaw+(FORWARD_YAW-stallYaw)*turn;
    visible=z>-13.3;
    stride=playing&&delayed>.16&&delayed<.99?turn*.22:0;
  } else if(mode==='cleaning'||mode==='complete') {
    visible=false;
  }
  return {z,yaw,visible,stride,phase:delayed};
}
