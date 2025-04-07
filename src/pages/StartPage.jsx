import React, { useState } from 'react';
import Modal from '../components/ui/elements/Modal';
import AboutGameContent from '../components/modals/AboutGameContent';
import RulesContent from '../components/modals/RulesContent';
import FAQContent from '../components/modals/FAQContent';

function StartPage() {
  // Состояния для управления модальными окнами
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  return (
    <div className='container app-background flex flex-col items-center justify-center min-h-screen'>
      {/* Кнопки */}
      <div className='flex space-x-4 mb-8'>
        <button className='button' onClick={() => setIsAboutOpen(true)}>
          Об игре
        </button>
        <button className='button' onClick={() => setIsRulesOpen(true)}>
          Правила игры
        </button>
        <button className='button' onClick={() => setIsFAQOpen(true)}>
          FAQ
        </button>
      </div>

      {/* Заголовок */}
      <h1 className='custom-title mb-8'>Детский финансовый симулятор</h1>

      {/* Кнопка "Начать играть" */}
      <button className='button'>Начать играть</button>

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
