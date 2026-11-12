import {NextResponse} from 'next/server';
import manifest from '../../../public/assets/raptor-v2/manifest.json';
import inventory from '../../../docs/raptor-fluidity/runtime-inventory.json';
import ready from '../../../docs/raptor-fluidity/batch26-registration.json';
import front from '../../../docs/raptor-fluidity/batch27-registration.json';

export const dynamic = 'force-dynamic';

export function GET() {
 const registrations = Object.values({...ready,...front});
 const integrated = registrations.length;
 const newDrawings = new Set(registrations.map(frame => frame.sha256)).size;
 const fastMovementPlayable = [...new Set([...manifest.fastMovementDirections,...manifest.designGaitDirections])];
 const approved = inventory.slots.filter(slot => slot.status === 'replaced-in-design-pass').length;
 const reused = inventory.slots.filter(slot => slot.status === 'reused-approved').length;
 const open = inventory.slots.filter(slot => slot.status === 'open-for-replacement').length;
 return NextResponse.json({
  commit: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GOD_MODE_BUILD_SHA || null,
  build: manifest.build,
  movementPlayable: manifest.movementDirections,
  movementReview: manifest.movementReviewDirections,
  fastMovementPlayable,
  restoredActionDirections: manifest.restoredActionDirections,
  restoredActionCount: manifest.restoredActionCount,
  batch: {newDrawings, replacedLegacyDrawings: integrated, activated: integrated, totalMovementPlayable: 8 + 8 * (manifest.movementDirections.length + fastMovementPlayable.length) + 4 * manifest.designGaitDirections.length},
  inventory: {reachable: approved+reused+open, approved: approved+reused, reused, open},
 }, {headers: {'Cache-Control':'no-store'}});
}
