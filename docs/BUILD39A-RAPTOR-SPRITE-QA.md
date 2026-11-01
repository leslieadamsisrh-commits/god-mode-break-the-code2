# Build 39A — Raptor V2 Sprite Production Gate

## Approved source
The user-provided 2026-10-31 Raptor V2 eight-direction image with humanized legs is the visual authority. Preserve olive/tan striped skin, red optic, gunmetal/white armor, backpack, shotgun, claws and tail. No alternate designs.

## Renderer contract
- 512 x 512 transparent RGBA PNG, no embedded grid or labels
- Foot anchor at (256,450), weapon muzzle anchor separately verified
- Paths: public/assets/raptor-v2/{action}/{direction}/{000..N-1}.png
- Directions: right, front-right, front, front-left, left, back-left, back, back-right
- Actions/counts: idle 8, walk 8, run 12, slide 10, jump 8, land 6, shoot 8, hit 6
- 528 target frames total
- One visually distinct articulated pose per numbered frame; duplicates are not a completed animation

## Status as of Build 39A
- Latest eight-direction idle contact sheet: visual reference only; not a transparent sprite package
- Idle: 64 reference poses, **0 verified production PNGs**
- Walk/run/slide/jump/land/shoot/hit: **0 verified production PNGs**
- Existing older provisional movement ZIP is not accepted as completed Raptor V2 art
- Sprite-only renderer is present, but final artwork is not installed
- No claims of runtime artwork or movement verification

## Gate before deployment
Validate true alpha, no checkerboard pixels, 512x512, no clipping, stable anchors, visual consistency and actual browser animation. Preserve Jade, camera, physics, bullet time, cover, grip and throw. Do not merge rejected Build 38B camera changes.

## Batch discipline
Author a maximum of four independent high-resolution poses per batch. Extract and verify separately, then commit PNG binaries. Record rejected and provisional frames explicitly; never hide missing art behind the old skeletal rig.
