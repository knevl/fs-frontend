import React, { useState } from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import CreatorLobby from './pages/CreatorLobby';
import PlayerLobby from './pages/PlayerLobby';
import GameOver from './pages/GameOver';
import Modal from './components/ui/elements/Modal';
import HelpContent from './components/modals/HelpContent';
import ControlsContent from './components/modals/ControlsContent';
import ExitGameContent from './components/modals/ExitGameContent';
import './index.css';

function App() {
  const score = useGameStore((state) => state.score);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Стартовая страница */}
        <Route path='/' element={<StartPage />} />

        {/* Страница создания новой игры */}
        <Route path='/creator-lobby' element={<CreatorLobby />} />
        {/* Страница для игрока */}
        <Route path='/player-lobby' element={<PlayerLobby />} />
        {/* Страница окончания игры */}
        <Route path='/game-over' element={<GameOver />} />
        {/* Основная игровая сцена */}
        <Route
          path='/game'
          element={
            <div className='container app-background'>
              <div>
                <h1 className='custom-title '>ДЕТСКИЙ ФИНАНСОВЫЙ СИМУЛЯТОР</h1>
              </div>

              <div className='container-game'>
                <div className='container-game__left'>
                  <p className='timer'>
                    До конца игры: <span>20:00</span>
                  </p>
                </div>

                <Game />

                <div className='container-game__right'>
                  <p className='timer--out timer'>
                    Текущий год: <span>0</span>
                  </p>
                  <button
                    className='button'
                    onClick={() => setIsHelpOpen(true)}
                  >
                    Помощь
                  </button>
                  <button
                    className='button'
                    onClick={() => setIsControlsOpen(true)}
                  >
                    Управление
                  </button>
                  <button
                    className='button'
                    onClick={() => setIsExitOpen(true)}
                  >
                    Выйти из игры
                  </button>
                </div>
              </div>

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
              <Modal
                isOpen={isExitOpen}
                onClose={() => setIsExitOpen(false)}
                title='Выход из игры'
              >
                <ExitGameContent onClose={() => setIsExitOpen(false)} />
              </Modal>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
