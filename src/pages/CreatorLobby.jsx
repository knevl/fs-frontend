import React, { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import Modal from '../components/ui/elements/Modal';
import ConfirmStartContent from '../components/modals/ConfirmStartContent';
import { useNavigate } from 'react-router-dom';

function CreatorLobby() {
  const [startCapital, setStartCapital] = useState(2500);
  const [gameDuration, setGameDuration] = useState('short');
  const [players, setPlayers] = useState([
    { type: 'player', name: 'Игрок 1 - тест 1 тест 1' },
    { type: 'bot', name: 'Бот 1' },
  ]);
  const gameCode = 'АААААА';
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleRemove = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleAddBot = () => {
    const botNumber = players.filter((p) => p.type === 'bot').length + 1;
    setPlayers([...players, { type: 'bot', name: `Бот ${botNumber}` }]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    alert('Код скопирован');
  };

  const handleGame = () => {
    navigate('/game');
  };

  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      <h1 className='custom-title'>ИГРОВОЕ ЛОББИ</h1>

      {/* Основной контейнер: две вертикальные колонки */}
      <div className='flex space-x-10 '>
        {/* Левая часть: таблица игроков и кнопка "Добавить бота" */}
        <div className='flex-1 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>
            Подключенные игроки и боты
          </h2>
          <div className='flex-1 overflow-y-auto mb-4 max-h-110'>
            <ul className='space-y-2'>
              {players.map((player, index) => (
                <li
                  key={index}
                  className='player-tile flex justify-between items-center'
                >
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  <button
                    onClick={() => handleRemove(index)}
                    className='text-red-500 hover:text-red-700'
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleAddBot} className='button-blue'>
            Добавить бота
          </button>
        </div>

        {/* Правая часть */}
        <div className='flex-1 flex flex-col'>
          {/* Код игры с иконкой копирования */}
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

          {/* Настройки игры*/}
          <label className='block text-lg mb-2 font-semibold'>
            Настройки игры
          </label>
          <div className='lobby-container p-6 rounded-lg shadow-lg flex-1'>
            {/* Слайдер стартового капитала */}
            <div className='mb-4'>
              <label className='block text-lg mb-2'>
                Стартовый капитал: {startCapital}
              </label>
              <input
                type='range'
                min='1000'
                max='5000'
                step='500'
                value={startCapital}
                onChange={(e) => setStartCapital(Number(e.target.value))}
                className='w-full range-slider'
              />
            </div>

            {/* Выбор продолжительности игры */}
            <div className='mb-4'>
              <p className='text-lg mb-2'>Продолжительность игры:</p>
              <div className='flex space-x-4 '>
                <label>
                  <input
                    type='radio'
                    value='short'
                    checked={gameDuration === 'short'}
                    onChange={() => setGameDuration('short')}
                    className='mr-2'
                  />
                  Короткая игра - 20 минут
                </label>
                <label>
                  <input
                    type='radio'
                    value='long'
                    checked={gameDuration === 'long'}
                    onChange={() => setGameDuration('long')}
                    className='mr-2'
                  />
                  Долгая игра - 36 минут
                </label>
              </div>
            </div>
          </div>

          {/* Кнопка "Начать игру" */}
          <button
            onClick={() => setIsConfirmOpen(true)}
            className='button-green mt-4'
          >
            Начать игру
          </button>
        </div>
      </div>

      {/* Модальное окно для подтверждения */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title='Подтверждение'
      >
        <ConfirmStartContent
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={handleGame}
        />
      </Modal>
    </div>
  );
}

export default CreatorLobby;
