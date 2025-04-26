import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import coin from '/images/coin.png';
import Modal from '../components/ui/elements/Modal';
import CalculationContent from '../components/modals/CalculationContent';

const GameOver = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);
  const [showPlayers, setShowPlayers] = useState(true);
  const [showBots, setShowBots] = useState(true);

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

  const filteredPlayers = sortedPlayers.filter((player) => {
    if (player.name.startsWith('Бот')) {
      return showBots;
    } else {
      return showPlayers;
    }
  });

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
        <div className='flex items-center mb-4'>
          <h2 className='text-xl font-semibold mr-4'>Рейтинг</h2>
          <label className='text-xl font-semibold mr-4'>
            <input
              type='checkbox'
              checked={showPlayers}
              onChange={() => setShowPlayers(!showPlayers)}
            />
            Игроки
          </label>
          <label className='text-xl font-semibold mr-4'>
            <input
              type='checkbox'
              checked={showBots}
              onChange={() => setShowBots(!showBots)}
            />
            Боты
          </label>
        </div>
        <div className='max-h-[400px] overflow-y-auto space-y-2'>
          {filteredPlayers.map((player, index) => (
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
                <button
                  onClick={() => {
                    setIsCalculationOpen(true);
                    setSelectedPlayer(player);
                  }}
                  className='ml-2 text-gray-700'
                >
                  Подробнее➡️
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <Modal
          isOpen={isCalculationOpen}
          onClose={() => setSelectedPlayer(null)}
          title='Как расчитывался итоговый баланс?'
        >
          <CalculationContent player={selectedPlayer} />
        </Modal>
      )}

      <button onClick={() => navigate('/')} className='button-green mb-3'>
        Вернуться на главный экран
      </button>
    </div>
  );
};

export default GameOver;
