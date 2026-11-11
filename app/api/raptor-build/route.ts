import {NextResponse} from 'next/server';
import inventory from '../../../public/assets/raptor-v2/manifest.json';
import slideRegistration from '../../../docs/raptor-fluidity/batch24-registration.json';
export const dynamic='force-dynamic';
export function GET(){
 const slideDrawings = Object.keys(slideRegistration).length;
 return NextResponse.json({commit:process.env.RAILWAY_GIT_COMMIT_SHA||process.env.GOD_MODE_BUILD_SHA||null,build:inventory.build,movementPlayable:inventory.movementDirections,movementReview:inventory.movementReviewDirections,fastMovementPlayable:inventory.fastMovementDirections,restoredActionDirections:inventory.restoredActionDirections,restoredActionCount:inventory.restoredActionCount,batch:{newDrawings:slideDrawings,replacedLegacyDrawings:slideDrawings,activated:slideDrawings,totalMovementPlayable:48}},{headers:{'Cache-Control':'no-store'}});
}
