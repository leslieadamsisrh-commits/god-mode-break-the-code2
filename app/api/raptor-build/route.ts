import {NextResponse} from 'next/server';
import manifest from '../../../public/assets/raptor-v2/manifest.json';
import inventory from '../../../docs/raptor-fluidity/runtime-inventory.json';
import batch from '../../../docs/raptor-fluidity/batch36-registration.json';

export const dynamic = 'force-dynamic';

export function GET() {
 const fastMovementPlayable = [...new Set([...manifest.fastMovementDirections,...manifest.designGaitDirections])];
 const approved = inventory.slots.filter(slot => slot.status === 'replaced-in-design-pass').length;
 const reused = inventory.slots.filter(slot => slot.status === 'reused-approved').length;
 const revalidated = inventory.slots.filter(slot => slot.status === 'revalidated-design-pass').length;
 const open = inventory.slots.filter(slot => slot.status === 'open-for-replacement').length;
 return NextResponse.json({
  commit: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GOD_MODE_BUILD_SHA || null,
  build: manifest.build,
  movementDefault: "39T35 DEFAULT",
  movementPlayable: manifest.movementDirections,
  movementReview: manifest.movementReviewDirections,
  fastMovementPlayable,
  restoredActionDirections: manifest.restoredActionDirections,
  restoredActionCount: manifest.restoredActionCount,
  batch: {continuityFrames: Object.keys(batch).length, activated: Object.keys(batch).length},
  inventory: {reachable: approved+reused+revalidated+open, approved: approved+reused+revalidated, reused, revalidated, open},
 }, {headers: {'Cache-Control':'no-store'}});
}
