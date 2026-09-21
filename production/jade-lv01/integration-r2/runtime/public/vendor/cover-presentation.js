/* R2 render-only calibration of existing cover cutouts. Pixels and simulation
 * are unchanged. These are manual first-pass visual registrations, not a rig.
 * Never apply them to K01/K02/K03: their firing sockets retain their baseline.
 */
(function(root){'use strict';
const records=Object.freeze({
 CE05:Object.freeze({scale:.100,anchor:Object.freeze([545,1455]),helmetWidth:320,footY:1455}),
 CE03:Object.freeze({scale:.105,anchor:Object.freeze([650,1178]),helmetWidth:305,footY:1178}),
 CE08:Object.freeze({scale:.094,anchor:Object.freeze([645,1175]),helmetWidth:340,footY:1175}),
 B06B:Object.freeze({scale:.100,anchor:Object.freeze([650,1130]),helmetWidth:320,footY:1130})
});
function calibrate(record,enabled=true){
 const key=record.file.split('/').pop().replace('.png',''),q=enabled&&records[key];
 return q?{...record,scale:q.scale,anchor:[...q.anchor],registration:'R2 manual cover calibration'}:record;
}
const api={records,calibrate};root.JadeCoverPresentation=api;
if(typeof module==='object')module.exports=api;
})(globalThis);
