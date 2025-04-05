import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './lib/phaser/config';
import { preload } from './lib/phaser/preload';
import { create } from './lib/phaser/create';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const gameInstance = new Phaser.Game({
      ...config,
      scene: {
        preload: preload,
        create: create,
      },
    });
    gameRef.current = gameInstance;

    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  return <div id='phaser-game'></div>;
};

export default Game;
