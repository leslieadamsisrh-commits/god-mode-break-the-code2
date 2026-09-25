import type {PieceKind} from './layout';

// Coordinates are within the 3072 × 2048 approved arena plate. Each mask
// encloses a single pictured object; mirrored placements reuse that object.
export const SOURCE_PIECES: Partial<Record<PieceKind,{box:readonly [number,number,number,number];path:string;height:number}>> = {
  platform:{box:[1185,755,700,445],height:0,path:'M 350 26 C 535 26 680 98 681 209 C 682 326 541 411 350 414 C 154 414 15 324 17 210 C 18 99 167 26 350 26 Z'},
  leftBridge:{box:[610,585,640,415],height:85,path:'M 6 174 L 76 141 L 153 169 L 181 134 L 221 125 L 284 173 L 353 223 L 431 267 L 502 293 L 627 312 L 632 385 L 543 405 L 444 381 L 348 337 L 269 306 L 188 274 L 112 251 L 56 274 L 9 248 Z'},
  curvedBarricade:{box:[1387,509,298,108],height:40,path:'M 5 30 L 54 12 L 118 3 L 177 3 L 244 12 L 293 30 L 291 96 L 238 106 L 181 90 L 118 90 L 61 106 L 7 97 Z'},
  middleBarricade:{box:[1170,530,180,130],height:46,path:'M 6 49 L 44 29 L 150 8 L 174 36 L 178 105 L 152 128 L 41 128 L 7 108 Z'},
  supplyContainer:{box:[790,1200,325,270],height:65,path:'M 8 111 L 39 75 L 191 13 L 286 42 L 316 81 L 320 191 L 253 250 L 83 259 L 13 212 Z'},
  frontPost:{box:[1110,1340,182,267],height:68,path:'M 34 24 L 139 10 L 168 36 L 177 168 L 155 230 L 120 260 L 19 251 L 7 213 L 12 82 Z'},
  sniperTower:{box:[405,382,235,310],height:105,path:'M 28 35 L 125 6 L 204 27 L 221 69 L 228 266 L 169 302 L 19 295 L 9 220 L 10 82 Z'},
};
