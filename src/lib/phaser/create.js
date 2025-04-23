import { createMap, createLabels } from './map.js';
import { createPlayer, setupPlayerControls } from './player.js';
import { setupCollisions } from './collisions.js';
import { setupInteractions } from './interactions.js';
import { setupCoinsCounter } from './coins.js';
import { createNPC, createCar } from './npc.js';

export function create() {
  const map = createMap(this);
  createLabels(this, map);
  const player = createPlayer(this);
  setupPlayerControls(this, player);

  // Создаем NPC с разными скинами
  const npcs = [
    {
      skin: 'npc',
      path: [
        { x: 580, y: 260 },
        { x: 580, y: 380 },
        { x: 480, y: 380 },
        { x: 480, y: 420 },
        { x: 180, y: 420 },
        { x: 180, y: 360 },
        { x: 150, y: 360 },
        { x: 150, y: 260 },
      ],
      x: 1,
      y: 260,
    },
    {
      skin: 'npc1',
      path: [
        { x: 460, y: 240 },
        { x: 460, y: 360 },
        { x: 180, y: 360 },
        { x: 180, y: 430 },
        { x: 480, y: 430 },
        { x: 480, y: 380 },
        { x: 580, y: 380 },
        { x: 580, y: 260 },
        { x: 100, y: 260 },
        { x: 300, y: 260 },
        { x: 300, y: 360 },
        { x: 460, y: 360 },
      ],
      x: 800,
      y: 240,
    },
  ].map(({ skin, path, x, y }) => createNPC(this, x, y, skin, path));

  const cars = [
    {
      skin: 'car',
      path: [
        { x: 30, y: 310 },
        { x: 350, y: 310 },
        { x: 350, y: 335 },
        { x: 30, y: 335 },
        { x: 30, y: 310 },
        { x: 780, y: 310 },
        { x: 780, y: 335 },
        { x: 30, y: 335 },
      ],
      x: 10,
      y: 310,
    },
    {
      skin: 'car1',
      path: [
        { x: 780, y: 335 },
        { x: 30, y: 335 },
        { x: 30, y: 310 },
        { x: 780, y: 310 },
        { x: 780, y: 335 },
        { x: 530, y: 335 },
        { x: 530, y: 440 },
        { x: 510, y: 440 },
        { x: 510, y: 310 },
        { x: 780, y: 310 },
      ],
      x: 800,
      y: 335,
    },
  ].map(({ skin, path, x, y }) => createCar(this, x, y, skin, path));

  // Объединяем NPC и машины для коллизий
  const allEntities = [...npcs, ...cars];
  setupCollisions(this, map, player, allEntities);
  setupInteractions(this, map, player);
  setupCoinsCounter(this);

  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
}
