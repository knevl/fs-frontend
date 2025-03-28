import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useGameStore } from './store/store';
import { COLORS } from './utils/constants';

const Game = () => {
  const gameRef = useRef(null);
  const increaseScore = useGameStore((state) => state.increaseScore);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 800,
      height: 600,
      backgroundColor: COLORS.neutral,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    let rectangle;

    function preload() {
      // Можно загрузить ассеты, если потребуется
    }

    function create() {
      // Создаём движущийся прямоугольник
      rectangle = this.add.rectangle(
        400,
        300,
        100,
        50,
        Phaser.Display.Color.HexStringToColor(COLORS.primary).color
      );
      // При клике по сцене увеличиваем счёт
      this.input.on('pointerdown', () => {
        increaseScore();
      });
    }

    function update() {
      if (rectangle) {
        // Движение прямоугольника (сброс позиции при достижении правой границы)
        rectangle.x += 1;
        if (rectangle.x > 800) {
          rectangle.x = 0;
        }
      }
    }

    const gameInstance = new Phaser.Game(config);
    gameRef.current = gameInstance;

    return () => {
      gameInstance.destroy(true);
    };
  }, [increaseScore]);

  return (
    <div
      id='phaser-game'
      className='w-full md:w-3/4 mx-auto my-4 border border-gray-300'
    ></div>
  );
};

export default Game;
