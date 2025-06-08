import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './lib/phaser/config';
import { preload } from './lib/phaser/preload';
import { create } from './lib/phaser/create';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameSocket } from './hooks/useGameSocket';


const Game = () => {
  const { sessionId } = useParams();
  const gameRef = useRef(null);

  useGameSocket({
    onBalanceUpdate: (newBalance) => {
      if (window.currentGameScene && window.currentGameScene.updateCoins) {
        window.currentGameScene.updateCoins(newBalance);
      }
    }
  });

  useEffect(() => {
    const gameInstance = new Phaser.Game({
      ...config,
      scene: {
        preload: preload,
        create: function () {
          this.sessionId = parseInt(sessionId); 
          window.currentGameScene = this; 
          create.call(this);
        },
      },
    });
    
    gameRef.current = gameInstance;

    return () => {
      gameInstance.destroy(true);
      window.currentGameScene = null; 
    };
  }, []);

  return <div id='phaser-game'></div>;
};

export default Game;
