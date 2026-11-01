/** Build 38 camera director: presentation-only framing. No world transforms or physics edits.
 * Tactical rotation is deliberately gated until world/screen projection and aim inversion are audited.
 */
export type CameraMode38="auto"|"wide"|"cinematic"|"tactical";
export const CAMERA_MODES38:readonly CameraMode38[]=["auto","wide","cinematic","tactical"];
export type CameraSettings38={mode:CameraMode38;zoomAdjustment:number;rotation:number;elevation:number};
export const DEFAULT_CAMERA38:CameraSettings38={mode:"auto",zoomAdjustment:0,rotation:18,elevation:32};
const clamp=(x:number,a:number,b:number)=>Math.min(b,Math.max(a,x));
export function cameraTarget38(mode:CameraMode38,baseline:number,zoomAdjustment=0){
 const target=mode==="wide"?2.8:mode==="cinematic"?3.75:mode==="tactical"?3.15:baseline;
 return clamp(target+zoomAdjustment,2.5,4.1);
}
export function cameraZoomStep38(current:number,target:number,dt:number){
 const blend=1-Math.exp(-2.2*clamp(dt,0,.05));
 return current+(target-current)*blend;
}
export function nextCameraMode38(mode:CameraMode38):CameraMode38{
 return CAMERA_MODES38[(CAMERA_MODES38.indexOf(mode)+1)%CAMERA_MODES38.length];
}
