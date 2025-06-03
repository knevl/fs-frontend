import React, { useState, useEffect } from 'react';
import { FaCopy, FaArrowLeft } from 'react-icons/fa';
import Modal from '../components/ui/elements/Modal';
import ConfirmStartContent from '../components/modals/ConfirmStartContent';
import ReturnStartPageContent from '../components/modals/ReturnStartPageContent';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { ApiService } from '../services/api';
import { useGameSocket } from '../hooks/useGameSocket';

function CreatorLobby() {
  const [startCapital, setStartCapital] = useState(2500);
  const [gameDuration, setGameDuration] = useState('short');
  const [players, setPlayers] = useState([]);
  const [gameCode, setGameCode] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isReturnStartPage, setIsReturnStartPage] = useState(false);
  const navigate = useNavigate();
  const { sessionId } = useParams();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const session = await ApiService.get(`/session/info/${sessionId}`);
        setGameCode(session[0].code);

        const playerList = await ApiService.get(`/session/players/${sessionId}`);
        setPlayers(playerList.map(p => ({ id: p.id, type: p.isBot ? 'bot' : 'player', name: p.playerName })));
      } catch (err) {
        toast.error('Ошибка загрузки сессии или игроков');
      }
    };

    fetchSessionData();
  }, [sessionId]);

  useGameSocket({
    onSessionClosed: () => {
      localStorage.removeItem('token');
      navigate('/');
    },
    onLobbyUpdate: (updatedPlayers) => {
      setPlayers(updatedPlayers.map(p => ({ id: p.id, type: p.isBot ? 'bot' : 'player', name: p.playerName })));
    },
  });

  // const handleRemove = (index) => {
  //   setPlayers(players.filter((_, i) => i !== index));
  // };

  const handleAddBot = async () => {
    try {
      await ApiService.post(`/session/add-bot/${sessionId}`);
      const playerList = await ApiService.get(`/session/players/${sessionId}`);
      setPlayers(playerList.map(p => ({ id: p.id, type: p.isBot ? 'bot' : 'player', name: p.playerName })));
    } catch (err) {
      toast.error('Не удалось добавить бота');
    }
    // const botNumber = players.filter((p) => p.type === 'bot').length + 1;
    // setPlayers([...players, { type: 'bot', name: `Бот ${botNumber}` }]);
  };

  const handleRemoveBot = async (playerId) => {
    try {
      await ApiService.delete(`/session/delete-bot/${playerId}`);
      const playerList = await ApiService.get(`/session/players/${sessionId}`);
      setPlayers(playerList.map(p => ({ 
        id: p.id,
        type: p.isBot ? 'bot' : 'player', 
        name: p.playerName 
      })));
      toast.success('Бот удален');
    } catch (err) {
      toast.error('Не удалось удалить бота');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast.success('Код скопирован!');
  };

  const handleGame = async() => {
    try {
      await ApiService.put(`/session/start/${sessionId}`, {
        seedCapital: startCapital,
        gameTime: gameDuration === 'short' ? 20 : 36,
      });
      navigate(`/game/${sessionId}`);
    } catch (err) {
      toast.error('Не удалось начать игру');
    }
    // navigate('/game');
  };

  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      <Toaster position='top-right' reverseOrder={false} />
      <button
        onClick={() => setIsReturnStartPage(true)}
        className='back-button absolute top-4 left-4 flex items-center space-x-2'
      >
        <FaArrowLeft size={24} />
        <span>Назад</span>
      </button>
      <h1 className='custom-title'>ИГРОВОЕ ЛОББИ</h1>

      <div className='flex space-x-10 '>
        {/* Левая часть:*/}
        <div className='flex-1 flex flex-col'>
          <h2 className='text-xl font-semibold mb-4'>
            Подключенные игроки и боты
          </h2>
          <div className='flex-1 overflow-y-auto mb-8 max-h-103'>
            <ul className='space-y-2'>
              {players.map((player, index) => (
                <li
                  key={player.id}
                  className='player-tile flex justify-between items-center'
                >
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  {player.type === 'bot' && (
                  <button
                    onClick={() => handleRemoveBot(player.id)}
                    className='text-red-500 hover:text-red-700'
                  >
                    ✕
                  </button>
                  )}
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

          <label className='block text-lg mb-2 font-semibold'>
            Настройки игры
          </label>
          <div className='lobby-container p-6 rounded-lg shadow-lg flex-1'>
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

          <button
            onClick={() => setIsConfirmOpen(true)}
            className='button-green mt-4'
          >
            Начать игру
          </button>
        </div>
      </div>

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
      <Modal
        isOpen={isReturnStartPage}
        onClose={() => setIsReturnStartPage(false)}
        title='Выход из игры'
      >
        <ReturnStartPageContent onClose={() => setIsReturnStartPage(false)} />
      </Modal>
    </div>
  );
}

export default CreatorLobby;
