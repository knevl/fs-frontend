import React from 'react';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function PlayerLobby() {
  const players = [
    { type: 'player', name: 'Игрок 1 - тест 1 тест 1' },
    { type: 'bot', name: 'Бот 1' },
  ];
  const gameCode = 'АААААА';

  const navigate = useNavigate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    alert('Код скопирован');
  };

  const handleGame = () => {
    navigate('/game');
  };

  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      <h1 className='custom-title '>ИГРОВОЕ ЛОББИ</h1>

      <div className='flex space-x-10'>
        {/* таблица игроков */}
        <div className=' flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>Участники игры</h2>
          <div className=' overflow-y-auto  max-h-83'>
            <ul className='space-y-2'>
              {players.map((player, index) => (
                <li
                  key={index}
                  className='player-tile flex justify-between items-center'
                >
                  <span>
                    {index + 1}. {player.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* код*/}
        <div className='flex-1 flex flex-col'>
          <div className='mb-30'>
            <label className='block text-lg mb-2 font-semibold'>Код игры</label>
            <div className='relative inline-block'>
              <input
                type='text'
                value={gameCode}
                readOnly
                className='input-code text-center pr-8'
              />
              <FaCopy
                className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
                onClick={handleCopyCode}
              />
            </div>
          </div>
        </div>
      </div>
      <p className='text-xl font-semibold text-gray-800'>
        Ожидайте начала игры...
      </p>
    </div>
  );
}

export default PlayerLobby;
