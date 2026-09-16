import test from 'node:test';
import assert from 'node:assert/strict';
import {createLabPlayer,stepLabMovement} from '../experiments/shotgun-powered-duel/lab-combat-rules.js';
import {stepLabMovement as baselineStep} from '../recovery/shotgun-lab-v57/lab-combat-rules.js';
const fields=['x','y','vx','vy','travel','slideUntil','state','frameMoved'];
function replay(step,refresh){const p=createLabPlayer(0,900,800),result=[];let accumulator=0,tick=0;for(let render=0;render<refresh*6;render++){accumulator+=1/refresh;while(accumulator+1e-12>=1/60){const now=++tick/60,slide=tick>=55?1:0;const input={x:tick<130?1:tick<210?-.4:0,y:tick<80?0:tick<210?.6:0,aim:tick/240,slide};step(p,input,1/60,now,[]);result.push(Object.fromEntries(fields.map(k=>[k,p[k]])));accumulator-=1/60;}}assert.equal(tick,360);return result;}
test('ordinary running, braking and open-ground slide match the saved build exactly',()=>{assert.deepEqual(replay(stepLabMovement,60),replay(baselineStep,60));});
test('fixed-step movement produces identical trajectories at simulated 30/60/120/144 Hz',()=>{const expected=replay(stepLabMovement,60);for(const hz of [30,120,144])assert.deepEqual(replay(stepLabMovement,hz),expected);});
