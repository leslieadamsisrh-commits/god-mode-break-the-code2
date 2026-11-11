import {NextResponse} from 'next/server';
import inventory from '../../../public/assets/raptor-v2/manifest.json';
export const dynamic='force-dynamic';
export function GET(){
 return NextResponse.json({commit:process.env.RAILWAY_GIT_COMMIT_SHA||process.env.GOD_MODE_BUILD_SHA||null,build:inventory.build,movementPlayable:inventory.movementDirections,movementReview:inventory.movementReviewDirections,fastMovementPlayable:inventory.fastMovementDirections,batch:{newDrawings:8,replacedLegacyDrawings:8,activated:8,totalMovementPlayable:48}},{headers:{'Cache-Control':'no-store'}});
}
