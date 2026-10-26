// DAIRY 24HR P0.5.3 — pure numeric, frame-independent direction-pad math.
// No Three.js state; shared by the browser game and its regression tests.
export function directionVelocity(keys, yaw, speed=3.2) {
  const dx=Number(Boolean(keys.right))-Number(Boolean(keys.left));
  const dz=Number(Boolean(keys.down))-Number(Boolean(keys.up));
  if(dx===0 && dz===0)return null;
  const a=Number.isFinite(yaw)?yaw:.72;
  const magnitude=Math.hypot(dx,dz);
  const x=(dx*Math.cos(a)+dz*Math.sin(a))/magnitude*speed;
  const z=(-dx*Math.sin(a)+dz*Math.cos(a))/magnitude*speed;
  return {x:Number.isFinite(x)?x:0,z:Number.isFinite(z)?z:0};
}
export function safeTimeStep(dt) {
  return Number.isFinite(dt)?Math.min(.055,Math.max(0,dt)):0;
}
