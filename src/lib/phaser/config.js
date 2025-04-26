export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: 800,
  height: 480,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: null, // задано в Game.jsx
    create: null, // задано в Game.jsx
  },
  pixelArt: false,
};
