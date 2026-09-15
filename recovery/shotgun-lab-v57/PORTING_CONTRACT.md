# Porting contract

Preserve these behaviors when integrating the lab into the main game:

1. Movement and aim remain independent.
2. Simulation advances at a fixed 60 Hz.
3. A fresh slide edge starts a 650-speed, 0.70-second slide in the current movement direction.
4. Sliding into physical cover attaches the actor to the contacted face.
5. Attached movement follows the cover tangent with grounded acceleration and braking.
6. Sliding while attached kicks the actor away from cover; directional input adds a tangent component.
7. Destroyed cover cleanly releases attached actors.
8. Constructed cover is physical, damageable, grippable, movable, and limited to one active barrier per owner.
9. Projectiles originate from the registered muzzle, collide with cover in three dimensions, and cannot teleport through nearby cover.
10. Practice and network play use the same sanitized input and `LabDuel` rules.

The authoritative mechanics live in `lab-cover-contact.js`, `lab-psychic-cover.js`, `lab-combat-rules.js`, and `combat-lab-space.js`. Presentation and sprite selection remain separate.
