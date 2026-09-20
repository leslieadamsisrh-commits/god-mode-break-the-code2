/* B11 rough 8-direction coverage helper.
 * Missing recovered directions resolve to nearest existing atlas as an explicit placeholder.
 * Final approved art can replace a family+direction slot later without changing gameplay.
 */
(function(root){'use strict';
function resolve(atlases,family,direction){
 const exact=atlases[family+':'+direction];if(exact)return{record:exact,direction,placeholder:false,requested:direction};
 for(let d=1;d<12;d++){for(const s of [-1,1]){const q=(direction+s*d+24)%24,r=atlases[family+':'+q];if(r)return{record:r,direction:q,placeholder:true,requested:direction};}}
 return{record:null,direction,placeholder:true,requested:direction};
}
const api={resolve};root.JadeB11Fast=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
