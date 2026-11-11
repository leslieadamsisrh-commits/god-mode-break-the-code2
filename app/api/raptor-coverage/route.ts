import {NextResponse} from 'next/server';
import coverage from '../../../docs/raptor-fluidity/coverage.json';
export function GET(){return NextResponse.json(coverage);}
