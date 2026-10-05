# MINI BOOST PORT AUDIT V1

Strongest implementation currently present in the weave branch:
- activation: first A press with directional input
- dashSpeed: 410
- dashDuration: 0.16 s
- dashEnergy: 6
- doubleTapWindow: 0.28 s
- second A within window promotes to full slide
- presentation: boostState + dash FX (currently ZIP!)

Decision for Sprite Actor Production Pack 01: DO NOT enable in Classic yet.
Reason: Kinetic Brake is being promoted independently so the next playtest can isolate momentum-control feel. Porting boost simultaneously would confound the test.

Safe future port:
1. preserve Classic single-press slide compatibility decision explicitly;
2. decide exact gesture for mini-boost vs committed slide;
3. reuse dash state/values as initial baseline;
4. add Sprite Actor boost entry/release cels and local FX;
5. regression-test cover capture and battery economy.
