/* Isolated diagnostic setup. No control reassignment, drawing edits, or tuning. */
(function (root) {
  'use strict';
  function seat(selection, mode) {
    if (selection === '0' || selection === '1') return Number(selection);
    if (selection !== 'controller') throw new Error('Unknown inspection seat');
    if (!['keyboard-pad', 'two-pads'].includes(mode)) throw new Error('Unknown input mode');
    return mode === 'keyboard-pad' ? 1 : 0;
  }
  function setup(world, slot, kind = 'corner') {
    if (![0, 1].includes(slot) || !['corner', 'clear-shot'].includes(kind)) {
      throw new Error('Invalid inspection fixture');
    }
    if (kind === 'corner' && !world.covers.some(c => c.id === 'station')) {
      throw new Error('The required station cover is missing');
    }
    world.begin();
    const actor = world.players[slot], other = world.players[1 - slot];
    if (kind === 'corner') {
      world.p = actor;
      world.currentSlot = slot;
      try {
        actor.x = 51;
        world.attach(world.covers.find(c => c.id === 'station'), 'south');
        actor.x = 51;
        world.place();
        Object.assign(actor, {aim: 0, lowerAim: 0, pose: 0, raise: 0, impact: 0, state: 'CORNER RIGHT'});
        Object.assign(other, {x: 340, y: 120, aim: Math.PI, lowerAim: Math.PI});
      } finally {
        world.p = world.players[0];
        world.currentSlot = null;
      }
    } else {
      Object.assign(actor, {x: -90, y: 245, aim: 0, lowerAim: 0});
      Object.assign(other, {x: 90, y: 245, aim: Math.PI, lowerAim: Math.PI});
    }
    return {slot, kind, aims: world.players.map(p => p.aim)};
  }
  const api = {seat, setup};
  root.JadeFixture = api;
  if (typeof module === 'object') module.exports = api;
})(globalThis);
