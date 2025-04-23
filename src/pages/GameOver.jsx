import React from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import coin from '/images/coin.png';

const GameOver = () => {
  const navigate = useNavigate();

  const players = [
    { name: 'Игрок 1', isCurrent: true, coins: 1000 },
    { name: 'Бот 1', isCurrent: false, coins: 800 },
    { name: 'Игрок 2', isCurrent: false, coins: 1200 },
    { name: 'Игрок 3', isCurrent: false, coins: 1500 },
    { name: 'Бот 2', isCurrent: false, coins: 700 },
    { name: 'Игрок 4', isCurrent: false, coins: 1300 },
    { name: 'Игрок 5', isCurrent: false, coins: 1100 },
    { name: 'Бот 3', isCurrent: false, coins: 900 },
    { name: 'Игрок 6', isCurrent: false, coins: 1400 },
    { name: 'Игрок 7', isCurrent: false, coins: 1600 },
  ];

  const sortedPlayers = [...players].sort((a, b) => b.coins - a.coins);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <div className='container app-background container--gap'>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={50}
      />

      <h1 className='custom-title mt-8 mb-8'>КОНЕЦ ИГРЫ!</h1>

      <div className='w-full max-w-2xl'>
        <h2 className='text-xl font-semibold mb-4'>Рейтинг игроков и ботов</h2>
        <div className='max-h-[400px] overflow-y-auto space-y-2'>
          {sortedPlayers.map((player, index) => (
            <div
              key={index}
              className='player-tile flex justify-between items-center p-4 bg-white rounded shadow'
            >
              <span>
                {getMedal(index)} {index + 1}. {player.name}
              </span>
              <span>{player.isCurrent ? 'Это ты! Молодец😉' : ''}</span>
              <span className='flex items-center'>
                {player.coins}
                <img src={coin} alt='монета' className='w-6 h-6 ml-2' />
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate('/')} className='button-green mb-3'>
        Вернуться на главный экран
      </button>
    </div>
  );
};

export default GameOver;
