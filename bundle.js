!function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(t,e,r){"use strict";function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.r(e);class s{static info(t){s.level>=1&&s.log(t)}static debug(t){s.level>=2&&s.log(t)}static trace(t){s.level>=3&&s.log(t)}}n(s,"level",0),n(s,"log",console.log);async function a(t,e,r){return s.trace("Starting new set"),t.set("card","shared",{POMORELLO_ACTIVE:!0,POMORELLO_BREAK:!1,POMORELLO_START:Date.now(),POMORELLO_SET_LENGTH:e,POMORELLO_BREAK_LENGTH:r})}function i(t,e){return t.refresh?{refresh:t.refresh,...e}:e}function o(t){s.debug(`Displaying empty badge for card ${t.name}`);return i(t,{text:"No Pomodoro Active",color:"yellow"})}function c(t){s.debug(`Displaying break badge for card ${t.name}`);const e={text:`Resting: ${t.timeStr()}`,color:"blue"};return i(t,e)}new class{constructor(t){this.sound=document.createElement("audio"),this.sound.src=t,this.sound.setAttribute("preload","auto"),this.sound.setAttribute("controls","none"),this.sound.style.display="none",document.body.appendChild(this.sound)}play(){return this.sound.play()}}("https://raw.githubusercontent.com/benchislett/Pomorello/gh-pages/resources/bell.mp3").play().then(()=>console.log("sound played fine!")).catch(t=>console.error(JSON.stringify(t,null,2)));class l{constructor(t=10){s.trace(`Constructing new card with refresh ${t}`),this.is_active=!1,this.is_break=!1,this.start_ms=0,this.set_length=15e5,this.break_length=3e5,this.set_hist={},this.name="?",this.refresh=t}async fetch(t){s.trace("Fetching data");const e=t.card("name");let r=await t.getAll();r=r.card.shared||{},s.trace("Got data"),this.is_active=r.POMORELLO_ACTIVE||this.is_active,this.is_break=r.POMORELLO_BREAK||this.is_break,this.start_ms=r.POMORELLO_START||this.start_ms,this.set_length=r.POMORELLO_SET_LENGTH||this.set_length,this.break_length=r.POMORELLO_BREAK_LENGTH||this.break_length,this.set_hist=r.POMORELLO_SET_HISTORY||this.set_hist,this.name=(await e).name,s.info(JSON.stringify(this,null,2))}async sync(t){return s.trace(`Syncing card ${this.name}`),t.set("card","shared",{POMORELLO_ACTIVE:this.is_active,POMORELLO_BREAK:this.is_break,POMORELLO_START:this.start_ms,POMORELLO_SET_LENGTH:this.set_length,POMORELLO_BREAK_LENGTH:this.break_length,POMORELLO_SET_HISTORY:this.set_hist})}age(){return s.trace(`Computing age for card ${this.name}`),Date.now()-this.start_ms}timeStr(){let t;s.trace(`Formatting time for card ${this.name}`),this.is_active?t=this.set_length:this.is_break&&(t=this.break_length);const e=t-this.age();let r=Math.floor(e/1e3);return this.refresh&&(r=this.refresh*Math.ceil(r/this.refresh)),s.trace(`Formatting time for card ${this.name}: ${r} seconds`),`${(Math.floor(r/60)%60).toFixed(0).padStart(2,"0")}:${(r%60).toFixed(0).padStart(2,"0")}`}addSet(){s.trace(`Incrementing history of completed set for card ${this.name}`);const t=this.set_hist[this.set_length]||0;this.set_hist[this.set_length]=t+1}}function h(t,e){s.trace("Showing dropdown powerup menu"),t.popup({title:"Start a Pomodoro",items:[{text:"Plain 25/5",callback:(t,e)=>a(t,15e5,3e5)},{text:"Debug 1/0.5",callback:(t,e)=>a(t,6e4,3e4)}]})}window.TrelloPowerUp.initialize({"card-buttons":async(t,e)=>[{text:"Pomorello",callback:h}],"card-badges":async(t,e)=>(s.trace("Loading card-badges"),[{dynamic:async()=>{const e=new l;s.debug("State initialized"),await e.fetch(t),s.info(`State retrieved for card ${e.name}`);const r=e.age();return e.is_active?(s.trace("Pomodoro active"),r>e.set_length?(s.trace("Pomodoro expired"),await async function(t,e){return s.trace(`Pomodoro for card ${e.name} finished.`),e.is_active=!1,e.is_break=!0,e.start=Date.now(),e.addSet(),e.sync(t)}(t,e),c(e)):(s.trace("Pomodoro in progress"),function(t){s.debug(`Displaying status badge for card ${t.name}`);const e={text:`Pomodoro Active: ${t.timeStr()}`,color:"green"};return i(t,e)}(e))):e.is_break?(s.trace("Break active"),r>e.break_length?(s.trace("Break expired"),await async function(t,e){return s.trace(`Break for card ${e.name} finished.`),e.is_active=!1,e.is_break=!1,e.sync(t)}(t,e),o(e)):(s.trace("Break in progress"),c(e))):(s.trace("No Pomodoro active"),o(e))}}])})}]);