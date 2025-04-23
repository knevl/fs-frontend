import React, { useState } from 'react';
import Modal from '../components/ui/elements/Modal';
import AboutGameContent from '../components/modals/AboutGameContent';
import RulesContent from '../components/modals/RulesContent';
import FAQContent from '../components/modals/FAQContent';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [gameCode, setGameCode] = useState(''); // Для хранения кода игры
  const navigate = useNavigate();

  // Обработка ввода кода
  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setGameCode(value);
    }
  };
  const handleCreateGame = () => {
    navigate('/creator-lobby');
  };
  const handleConnectGame = () => {
    navigate('/player-lobby');
  };
  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      {/* Кнопки вверху */}
      <div className='absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4'>
        <button className='button-blue' onClick={() => setIsAboutOpen(true)}>
          Об игре
        </button>
        <button className='button-blue' onClick={() => setIsRulesOpen(true)}>
          Правила игры
        </button>
        <button className='button-blue' onClick={() => setIsFAQOpen(true)}>
          FAQ
        </button>
      </div>

      <div className='flex-grow flex items-center justify-center'>
        <h1 className='custom-title custom-title--margin'>
          ДЕТСКИЙ ФИНАНСОВЫЙ СИМУЛЯТОР
        </h1>
      </div>

      <div className='pb-8 flex flex-col items-center space-y-4'>
        <button className='button-green' onClick={handleCreateGame}>
          Создать новую игру
        </button>
        <p className='text-black'>или</p>
        <div className='flex flex-col items-center space-y-2'>
          <label className='text-black'>Введите код для игры</label>
          <div className='relative'>
            <input
              type='text'
              value={gameCode}
              onChange={handleCodeChange}
              maxLength={6}
              className='input-code text-center'
            />
          </div>
        </div>
        <button className='button-green' onClick={handleConnectGame}>
          Продолжить
        </button>
      </div>

      {/* Модальные окна */}
      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title='О чем эта игра'
      >
        <AboutGameContent />
      </Modal>
      <Modal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        title='Правила игры'
      >
        <RulesContent />
      </Modal>
      <Modal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        title='Часто задаваемые вопросы'
      >
        <FAQContent />
      </Modal>
    </div>
  );
}

export default StartPage;
