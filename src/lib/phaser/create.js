import { createMap, createLabels } from './map.js';
import { createPlayer, setupPlayerControls } from './player.js';
import { setupCollisions } from './collisions.js';
import { setupInteractions } from './interactions.js';
import { setupCoinsCounter } from './coins.js';

export function create() {
  const map = createMap(this);
  createLabels(this, map);
  const player = createPlayer(this);
  setupPlayerControls(this, player);
  setupCollisions(this, map, player);
  setupInteractions(this, map, player);
  setupCoinsCounter(this);

  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
}
