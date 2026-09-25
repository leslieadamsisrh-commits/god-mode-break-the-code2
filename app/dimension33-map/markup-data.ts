export type MarkKind = 'cover' | 'breakable' | 'scenery' | 'blocked' | 'route';
export type Mark = { id: string; kind: MarkKind; x1: number; y1: number; x2: number; y2: number };
export type Layout = { version: 1; marks: Mark[]; disabled: number[] };
export const LAYOUT_KEY = 'dimension33-layout-v1';
export const EMPTY_LAYOUT: Layout = { version: 1, marks: [], disabled: [] };
export const existingCover = [
  [605,295,100,53],[930,295,100,53],[671,358,99,54],[867,358,99,54],
  [547,365,68,47],[981,365,68,47],[601,613,72,61],[937,613,72,61],
  [681,668,72,54],[855,668,72,54],[518,317,60,58],[1017,317,60,58],
] as const;
export function readLayout(): Layout {
  try {
    const raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}');
    if (raw.version !== 1 || !Array.isArray(raw.marks) || !Array.isArray(raw.disabled)) return EMPTY_LAYOUT;
    return {
      version: 1,
      marks: raw.marks.filter((m: Mark) => ['cover','breakable','scenery','blocked','route'].includes(m.kind) &&
        [m.x1,m.y1,m.x2,m.y2].every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1536)).slice(0, 250),
      disabled: raw.disabled.filter((n: number) => Number.isInteger(n) && n >= 0 && n < existingCover.length),
    };
  } catch { return EMPTY_LAYOUT; }
}
export function lineDistance(x: number, y: number, m: Mark) {
  const dx=m.x2-m.x1,dy=m.y2-m.y1,t=Math.max(0,Math.min(1,((x-m.x1)*dx+(y-m.y1)*dy)/(dx*dx+dy*dy||1)));
  return Math.hypot(x-m.x1-t*dx,y-m.y1-t*dy);
}
