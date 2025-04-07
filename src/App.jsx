import React, { useState } from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import Modal from './components/ui/elements/Modal'; // Подключаем модальное окно
import HelpContent from './components/modals/HelpContent'; // Контент для "Помощь"
import ControlsContent from './components/modals/ControlsContent'; // Контент для "Управление"
import './index.css';

function App() {
  const score = useGameStore((state) => state.score);
  const [isHelpOpen, setIsHelpOpen] = useState(false); // Состояние для "Помощь"
  const [isControlsOpen, setIsControlsOpen] = useState(false); // Состояние для "Управление"

  return (
    <div className='container app-background'>
      {/* Заголовок игры */}
      <div>
        <h1 className='custom-title'>ДЕТСКИЙ ФИНАНСОВЫЙ СИМУЛЯТОР</h1>
      </div>

      {/* Контейнер для игры и боковых панелей */}
      <div className='container-game'>
        {/* Левая панель: таймер реального времени */}
        <div className='container-game__left'>
          <p className='timer'>
            До конца игры: <span>20:00</span>
          </p>
        </div>

        {/* Центральная часть: игровое поле */}
        <Game />

        {/* Правая панель: внутриигровое время и кнопки */}
        <div className='container-game__right'>
          <p className='timer--out timer'>
            Текущий год: <span>0</span>
          </p>
          <button className='button' onClick={() => setIsHelpOpen(true)}>
            Помощь
          </button>
          <button className='button' onClick={() => setIsControlsOpen(true)}>
            Управление
          </button>
          <button className='button'>Выйти из игры</button>
        </div>
      </div>

      {/* Модальные окна */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title='Помощь'
      >
        <HelpContent />
      </Modal>
      <Modal
        isOpen={isControlsOpen}
        onClose={() => setIsControlsOpen(false)}
        title='Управление'
      >
        <ControlsContent />
      </Modal>
    </div>
  );
}

export default App;
