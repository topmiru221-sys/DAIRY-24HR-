// Optional low-volume, procedural milking-room ambience.
// Starts only after user taps the sound button; no audio files/CDN required.
export function setupAmbience(button){
 let ctx=null,playing=false,oscillators=[];
 const AudioCtor=window.AudioContext||window.webkitAudioContext;
 button.textContent='🔇';
 button.title='開啟／關閉設備環境音';
 button.setAttribute('aria-label','開啟背景機械音效');
 async function toggle(){
  if(!AudioCtor){button.title='此瀏覽器不支援音效';return}
  try{
   if(!ctx){
    ctx=new AudioCtor();
    const low=ctx.createOscillator(),lowGain=ctx.createGain();
    low.type='sine';low.frequency.value=59;lowGain.gain.value=.009;
    low.connect(lowGain);lowGain.connect(ctx.destination);low.start();
    const high=ctx.createOscillator(),highGain=ctx.createGain();
    high.type='triangle';high.frequency.value=117;highGain.gain.value=.0022;
    high.connect(highGain);highGain.connect(ctx.destination);high.start();
    oscillators=[low,high];
    await ctx.suspend();
   }
   if(playing){await ctx.suspend();playing=false;}
   else{await ctx.resume();playing=true;}
   button.textContent=playing?'🔊':'🔇';
   button.setAttribute('aria-label',playing?'關閉背景機械音效':'開啟背景機械音效');
  }catch(err){playing=false;button.textContent='🔇';console.warn('Ambience unavailable',err)}
 }
 button.addEventListener('click',toggle);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&ctx&&playing){ctx.suspend().catch(()=>{});playing=false;button.textContent='🔇'}});
 return {isPlaying:()=>playing};
}
