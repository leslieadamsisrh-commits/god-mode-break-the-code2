/* Pure eligibility rule shared with the server. Never retunes a legal slide. */
(function(root){'use strict';
function evaluate(actor,input){
 const requested=!!input.slide;
 const contextual=!!(actor.cover||actor.cornerTravel);
 const blocked=requested&&!contextual&&(actor.slide>0||actor.kick>0);
 return {input:{...input,slide:requested&&!blocked},blocked,reason:blocked?'active-slide-or-kick':null};
}
const api={evaluate};root.JadeSlideGate=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
