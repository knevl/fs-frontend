import React, { useState } from 'react';
import { FaPaste } from 'react-icons/fa';
import Modal from '../components/ui/elements/Modal';
import AboutGameContent from '../components/modals/AboutGameContent';
import RulesContent from '../components/modals/RulesContent';
import FAQContent from '../components/modals/FAQContent';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

function StartPage() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [gameCode, setGameCode] = useState(''); // код игры
  const navigate = useNavigate();

  // Обработка ввода кода
  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setGameCode(value);
      setCodeError(''); //сброс ошибки при изменении кода
    }
  };

  // заготовка для проверки кода ДОБАВИТЬ ЕСЛИ ИГРА УЖЕ ИДЕТ.
  const validateCode = (code) => {
    // запрос к серверу
    if (code.length == 0) {
      return 'Введите код игры на английском языке';
    }
    if (code.length !== 6) {
      return 'Код должен состоять из 6 символов';
    }
    // заглушка
    if (code !== 'AAAAAA') {
      return 'Неверный код';
    }
    return ''; // ошибок нет
  };

  const handleCreateGame = () => {
    navigate('/creator-lobby');
  };

  const handleConnectGame = () => {
    const error = validateCode(gameCode);
    if (error) {
      toast.error(error); // теперь показываем ошибку через тост
    } else {
      navigate('/player-lobby');
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const formattedText = text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6);
      if (!text.trim()) {
        toast.error('Буфер обмена пуст. Нечего вставлять.');
        return;
      }
      if (!formattedText) {
        toast.error('В буфере нет допустимых символов (A-Z, 0-9).');
        return;
      }
      setGameCode(formattedText);
      toast.success('Код успешно вставлен!');
    } catch (err) {
      toast.error('Ошибка доступа к буферу обмена.');
      console.error('Ошибка вставки из буфера:', err);
    }
  };

  return (
    <div className='container relative min-h-screen app-background flex flex-col'>
      <Toaster position='top-right' reverseOrder={false} />
      {/* Кнопки вверху */}
      <div className='absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4'>
        <button className='button-blue' onClick={() => setIsAboutOpen(true)}>
          Об игре
        </button>
        <button className='button-blue' onClick={() => setIsRulesOpen(true)}>
          Правила игры
        </button>
        <button className='button-blue' onClick={() => setIsFAQOpen(true)}>
          Часто задаваемые вопросы
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
            <FaPaste
              className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500'
              onClick={handlePasteCode}
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
        title='О чем игра?'
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
