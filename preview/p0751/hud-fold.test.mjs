// node preview/p066/hud-fold.test.mjs
// This checks the small-screen fold behavior without loading Three.js or DOM.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=new URL('.',import.meta.url);
const html=readFileSync(new URL('index.html',source),'utf8');
const scene=readFileSync(new URL('scene.js',source),'utf8');
const find=(id)=>new RegExp('id="'+id+'"').test(html);
for(const id of ['infoToggle','instruction','sceneToggle','roomNav','fieldStatus',
                  'mapOpen','mapOverlay','shiftPanel','lactatingGateToggle'])
  assert(find(id),'must retain DOM node '+id);
assert.match(html,/<div id="instruction" hidden>/,'info card collapsed on launch');
assert.match(html,/<nav id="roomNav"[^>]* hidden>/,'scene nav collapsed on launch');
assert.match(html,/#instruction\[hidden\],#roomNav\[hidden\]\{display:none!important\}/);
assert.match(html,/src="\.\/scene\.js\?v=p0751"/);
assert.match(html,/id="mainBarnDryJump"/);
assert.match(html,/id="mainBarnCloseupJump"/);
assert.match(html,/id="mainBarnFreshJump"/);
assert.match(html,/id="mainBarnVetJump"/);
assert.match(html,/id="heiferPregnantJump"/);
assert.match(html,/id="heiferLargeJump"/);
assert.match(html,/id="heiferSmallJump"/);
const start=scene.indexOf('function setHudPanelVisible(which,show){');
const end=scene.indexOf('const clamp=',start);
assert(start>=0 && end>start,'self-contained button handlers');
const handlers=scene.slice(start,end);
const elem=(initialHidden=false)=>({
 hidden:initialHidden,textContent:'',attributes:{},
 setAttribute(name,value){this.attributes[name]=value;},
 getAttribute(name){return this.attributes[name]},
});
const items={instruction:elem(true),roomNav:elem(true),
             infoToggle:elem(),sceneToggle:elem()};
new Function('$',handlers)(name=>items[name]);
assert.equal(items.infoToggle.attributes['aria-expanded'],undefined);
items.infoToggle.onclick();
assert.equal(items.instruction.hidden,false);
assert.equal(items.roomNav.hidden,true);
assert.equal(items.infoToggle.attributes['aria-expanded'],'true');
items.sceneToggle.onclick();
assert.equal(items.instruction.hidden,true,'opening scene nav automatically closes info');
assert.equal(items.roomNav.hidden,false);
items.sceneToggle.onclick();
assert.equal(items.roomNav.hidden,true);
items.infoToggle.onclick();
items.infoToggle.onclick();
assert.equal(items.instruction.hidden,true);
assert.match(scene,/setHudPanelVisible\('scene',false\);\s*setHudPanelVisible\('info',false\);/);
assert.match(scene,/btn\.addEventListener\('click',\(\)=>\{[\s\S]*?setArea\(btn\.dataset\.area\);[\s\S]*?setHudPanelVisible\('scene',false\);/);
assert.match(scene,/\$\('lactatingGateToggle'\)\.onclick/,'gate control retained');
assert.match(scene,/const seamlessEntry=mainBarnEntryAreas\.has\(requestedArea\)\?requestedArea:null/,'all five entrances resolve into the seamless barn');
assert.match(scene,/entryZ=seamlessEntry\?seamlessOffsets\[seamlessEntry\]/,'each seamless entrance uses its own world spawn');
assert.match(scene,/const heiferEntry=HEIFER_SECTIONS\[requestedArea\]\?requestedArea:null/,'three heifer entries resolve into one continuous barn');
console.log('PASS: left information and right scene nav start hidden, independently reopen, close each other, and fold after scene change');
