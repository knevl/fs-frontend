import React, { useState } from 'react';
import { FaCopy, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/elements/Modal';
import ReturnStartPagePlayerContent from '../components/modals/ReturnStartPagePlayerContent';
import { toast, Toaster } from 'react-hot-toast';

function PlayerLobby() {
  const players = [
    { type: 'player', name: 'Игрок 1 - тест 1 тест 1' },
    { type: 'bot', name: 'Бот 1' },
  ];
  const gameCode = 'AAAAAA';

  const navigate = useNavigate();
  const [isReturnStartPagePlayer, setIsReturnStartPagePlayer] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast.success('Код скопирован!');
  };

  const handleGame = () => {
    navigate('/game');
  };

  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      <Toaster position='top-right' reverseOrder={false} />
      <button
        onClick={() => setIsReturnStartPagePlayer(true)}
        className='back-button absolute top-4 left-4 flex items-center space-x-2'
      >
        <FaArrowLeft size={24} />
        <span>Назад</span>
      </button>
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
      <Modal
        isOpen={isReturnStartPagePlayer}
        onClose={() => setIsReturnStartPagePlayer(false)}
        title='Выход из игры'
      >
        <ReturnStartPagePlayerContent
          onClose={() => setIsReturnStartPagePlayer(false)}
        />
      </Modal>
    </div>
  );
}

export default PlayerLobby;
