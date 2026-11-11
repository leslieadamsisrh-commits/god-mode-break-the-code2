import {NextResponse} from 'next/server';
import inventory from '../../../public/assets/raptor-v2/manifest.json';
export const dynamic='force-dynamic';
export function GET(){
 return NextResponse.json({commit:process.env.RAILWAY_GIT_COMMIT_SHA||process.env.GOD_MODE_BUILD_SHA||null,build:inventory.build,movementPlayable:inventory.movementDirections,movementReview:inventory.movementReviewDirections,batch:{newDrawings:16,active:8,review:8}},{headers:{'Cache-Control':'no-store'}});
}
