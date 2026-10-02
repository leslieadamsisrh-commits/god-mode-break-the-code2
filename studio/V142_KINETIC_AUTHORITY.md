# GOD MODE — V142 / Certified Kinetic Combat Authority

Status: RECOVERY AUTHORITY

The current Studio must converge on the later certified Combat Lab behavior, not older V57-only behavior.

## Certified target
- Combat Lab V32.2 / Site v38
- historical checkpoint ID: c304cc09e615c31533be4632800e4c79b59ab7f1
- historical branch name: recovery/kinetic-certified-v38
- note: the checkpoint/branch are no longer resolvable in the GitHub repository, so they are behavioral authority references rather than directly recoverable source.

## Required mechanics
1. Fixed 60 Hz simulation
2. Independent movement and aiming
3. 145-degree body-pivot boundary
4. Baseball slide (.70 s authority)
5. Kinetic Weave
6. Kinetic Hitch entry
7. Kinetic Hitch steering
8. Kinetic Hitch release / throw
9. Matter Drive -> Kinetic Kick
10. Grip Pivot
11. Gripping while sliding
12. Slide-assisted matter throws preserving momentum
13. Matter construction
14. Slide-to-cover capture
15. Attached cover shimmy
16. Cover aim / peek-fire
17. Cover kick-out -> slide
18. Melee -> evasive slide
19. Shield impact -> recovery
20. Damage while active movement continues correctly
21. Final Impact lethal resolution

## Kinetic behavior references
- Kinetic Weave: circular / figure-eight Grip manipulation while moving or sliding.
- Grip Pivot: route a gripped cover safely around Jade rather than clipping through her.
- Kinetic Hitch: Jade attaches laterally to a moving gripped cover; the cover leads while Jade remains grounded beside it.
- Hitch controls from certified-era notes:
  - RB generate/carry cover
  - LB Grip/release
  - left stick movement/body facing
  - right stick object direction/reach
  - A slide / attach / exit / Hitch
- Hitch sequence:
  RB generate -> LB Grip -> steer cover with right stick -> approach its side with left stick -> A slide -> A at contact.
- Matter Drive -> Kinetic Kick: momentum from matter/cover manipulation transitions into a forceful movement/impact release.

## Structure Lab visual authority
Use the V142 Structure Lab test environment:
- neutral gray editable combat floor
- only two structure families active:
  - COVER PIECE 01 (generated + fixed cover family)
  - SNIPER TOWER BASE (vertical combat test)
- lower tower block remains usable as cover after upper section breaks
- generated cover and damage reset on restart
- gameplay must remain testable without production map/HUD art

## Protected production rule
Do not describe a build as V142-equivalent until the complete mechanics checklist above has been tested.
V57 modules may be used only as recoverable implementation pieces where they match certified behavior.
