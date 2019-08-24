!function(t){var e={};function r(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(a,n,function(e){return t[e]}.bind(null,n));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(t,e,r){"use strict";function a(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.r(e);class n{static info(t){n.level>=1&&n.log(t)}static debug(t){n.level>=2&&n.log(t)}static trace(t){n.level>=3&&n.log(t)}}function i(t,e){return n.trace("Creating notification..."),t.alert({message:e,duration:10,display:"success"})}async function s(t,e,r,a){return n.trace("Starting new set"),e.is_active=!0,e.is_break=!1,e.start_ms=Date.now(),e.set_length=6e4*r,e.break_length=6e4*a,e.sync(t)}async function o(t,e){return n.trace(`Break for card ${e.name} finished.`),i(t,`Break for card ${e.name} has ended!`),e.is_active=!1,e.is_break=!1,e.start_ms=0,e.sync(t)}function c(t,e){n.trace("Showing dropdown status menu");const r={text:"Cancel Set",callback:t=>o(t,e)};return t.popup({title:"Active Set Menu",items:[r]})}a(n,"level",3),a(n,"log",console.log);const l="./target.svg",d="./clock.svg",u="./single-bed.svg",h="./award.svg";function g(t){n.trace(`Formatting time from ${t}`);const e=Math.floor(t/3600)%24,r=e.toFixed(0),a=(Math.floor(t/60)%60).toFixed(0),i=(t%60).toFixed(0);return e?`${r} h, ${a} m`:`${a} m, ${i} s`}class b{constructor(t=10){n.trace(`Constructing new card with refresh ${t}`),this.is_active=!1,this.is_break=!1,this.start_ms=0,this.set_length=15e5,this.break_length=3e5,this.break_parity=0,this.set_hist={},this.name="?",this.refresh=t}async fetch(t){n.trace("Fetching data");const e=t.card("name");let r=await t.getAll();r=r.card.shared||{},n.trace("Got data"),this.is_active=r.POMORELLO_ACTIVE||this.is_active,this.is_break=r.POMORELLO_BREAK||this.is_break,this.start_ms=r.POMORELLO_START||this.start_ms,this.set_length=r.POMORELLO_SET_LENGTH||this.set_length,this.break_length=r.POMORELLO_BREAK_LENGTH||this.break_length,this.break_parity=r.POMORELLO_BREAK_PARITY||this.break_parity,this.set_hist=r.POMORELLO_SET_HISTORY||this.set_hist,this.name=(await e).name,n.info(JSON.stringify(this,null,2))}async sync(t){return n.trace(`Syncing card ${this.name}`),t.set("card","shared",{POMORELLO_ACTIVE:this.is_active,POMORELLO_BREAK:this.is_break,POMORELLO_START:this.start_ms,POMORELLO_SET_LENGTH:this.set_length,POMORELLO_BREAK_LENGTH:this.break_length,POMORELLO_BREAK_PARITY:this.break_parity,POMORELLO_SET_HISTORY:this.set_hist})}age(){const t=Date.now()-this.start_ms;return n.trace(`Computing age for card ${this.name}: ${t}`),t}timeStr(){let t;n.trace(`Formatting time for card ${this.name}`),this.is_active?t=this.set_length:this.is_break&&(t=this.break_length,this.break_parity%3==0&&(t*=3));const e=t-this.age();let r=Math.floor(e/1e3);return this.refresh&&(r=this.refresh*Math.ceil(r/this.refresh)),g(r)}addSet(){n.trace(`Incrementing history of completed set for card ${this.name}`);const t=this.set_hist[this.set_length]||0;this.set_hist[this.set_length]=t+1,this.break_parity+=1}}function f(t,e){return t.refresh?{refresh:t.refresh,...e}:e}function _(t){n.debug(`Displaying empty badge for card ${t.name}`);return f(t,{})}function m(t){n.debug(`Displaying status badge for card ${t.name}`);const e={icon:d,title:"Pomorello",text:`Pomodoro: ${t.timeStr()}`,color:"green",callback:e=>c(e,t)};return f(t,e)}function p(t){if(t.break_parity%3==0)return function(t){n.debug(`Displaying long break badge for card ${t.name}`);const e={icon:h,title:"Pomorello",text:`Long Break: ${t.timeStr()}`,color:"blue",callback:e=>c(e,t)};return f(t,e)}(t);n.debug(`Displaying break badge for card ${t.name}`);const e={icon:u,title:"Pomorello",text:`Break: ${t.timeStr()}`,color:"blue",callback:e=>c(e,t)};return f(t,e)}window.TrelloPowerUp.initialize({"card-buttons":async t=>{const e=new b;return await e.fetch(t),[{icon:l,text:"Pomorello",callback:t=>(function(t,e){n.trace("Showing dropdown powerup menu");const r={text:"Short Set "+"15m active, 3m break, 9m long break".replace(/ /g," "),callback:t=>s(t,e,15,3)},a={text:"Standard Set "+"25m active, 5m break, 15m long break".replace(/ /g," "),callback:t=>s(t,e,25,5)},i={text:"Long Set "+"45m active, 10m break, 30m long break".replace(/ /g," "),callback:t=>s(t,e,45,5)};let o={};n.level>=2&&(o={text:"Debug Set "+"1m active, 10s break, 30s long break".replace(/ /g," "),callback:t=>s(t,e,1,1/6)});const l={text:"Cancel Active Set",callback:t=>c(t,e)};return t.popup({title:"Start a Pomodoro",items:[l,r,a,i,o]})})(t,e)}]},"card-badges":t=>(n.trace("Loading card-badges"),[{dynamic:async()=>{const e=new b;n.debug("State initialized"),await e.fetch(t),n.info(`State retrieved for card ${e.name}`);const r=e.age();return e.is_active?(n.trace("Pomodoro active"),r>e.set_length?(n.trace("Pomodoro expired"),await async function(t,e){return n.trace(`Pomodoro for card ${e.name} finished.`),i(t,`Pomodoro for card ${e.name} complete.\nTime to take a break!`),e.is_active=!1,e.is_break=!0,e.start_ms=Date.now(),e.addSet(),e.sync(t)}(t,e),p(e)):(n.trace("Pomodoro in progress"),m(e))):e.is_break?(n.trace("Break active"),r>e.break_length*(e.break_parity%3==0?3:1)?(n.trace("Break expired"),await o(t,e),_(e)):(n.trace("Break in progress"),p(e))):(n.trace("No Pomodoro active"),_(e))}}]),"card-detail-badges":t=>(n.trace("Loading card-detail-badges"),[{dynamic:async()=>{const e=new b;return await e.fetch(t),e.is_active?m(e):e.is_break?p(e):_(e)}},{dynamic:async()=>{const e=new b;return await e.fetch(t),function(t){n.debug(`Displaying statistics badge for card ${t.name}`);let e=Object.entries(t.set_hist||{}).reduce((t,e)=>t+e[0]*e[1],0);const r=Math.floor(e/1e3);n.debug(`Stats for card ${t.name}: ${r} seconds`);const a={icon:l,title:"Activity Summary",text:`Time spent : ${g(r)}`,color:null};return n.info(`Stats badge for card ${t.name}:\n${JSON.stringify(a,null,2)}`),f(t,a)}(e)}}])})}]);