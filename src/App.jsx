import React from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import AlertModal from './components/ui/elements/AlertModal';
import './index.css';

function App() {
  const score = useGameStore((state) => state.score);

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
            {/* Здесь будет отображаться оставшееся время в формате MM:SS */}
            {/* Будущая логика: обновление через серверные данные */}
          </p>
        </div>

        {/* Центральная часть: игровое поле */}
        <Game />

        {/* Правая панель: внутриигровое время и кнопка */}
        <div className='container-game__right'>
          <p className='timer--out timer'>
            Текущий год: <span>0</span>
            {/* Здесь будет отображаться текущий игровой год */}
            {/* Будущая логика: обновление на основе серверного времени */}
          </p>
          <button className='button'>Выйти из игры</button>
        </div>
      </div>
    </div>
  );
}

export default App;
