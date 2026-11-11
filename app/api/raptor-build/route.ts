import {NextResponse} from 'next/server';
import inventory from '../../../public/assets/raptor-v2/manifest.json';
import jumpRegistration from '../../../docs/raptor-fluidity/batch25-registration.json';
export const dynamic='force-dynamic';
export function GET(){
 const jumpDrawings = Object.keys(jumpRegistration).length;
 return NextResponse.json({commit:process.env.RAILWAY_GIT_COMMIT_SHA||process.env.GOD_MODE_BUILD_SHA||null,build:inventory.build,movementPlayable:inventory.movementDirections,movementReview:inventory.movementReviewDirections,fastMovementPlayable:inventory.fastMovementDirections,restoredActionDirections:inventory.restoredActionDirections,restoredActionCount:inventory.restoredActionCount,batch:{newDrawings:jumpDrawings,replacedLegacyDrawings:jumpDrawings,activated:jumpDrawings,totalMovementPlayable:48}},{headers:{'Cache-Control':'no-store'}});
}
