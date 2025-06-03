import React, { useState, useEffect } from 'react';
import Game from './Game';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import StartPage from './pages/StartPage';
import CreatorLobby from './pages/CreatorLobby';
import PlayerLobby from './pages/PlayerLobby';
import GameOver from './pages/GameOver';
import Modal from './components/ui/elements/Modal';
import HelpContent from './components/modals/HelpContent';
import ControlsContent from './components/modals/ControlsContent';
import ExitGameContent from './components/modals/ExitGameContent';
import './index.css';
import { useGameSocket } from './hooks/useGameSocket';
import { ApiService } from './services/api';

function GameWrapper() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [gameTime, setGameTime] = useState('--:--');
  const [currentYear, setCurrentYear] = useState(0); 
  const [gameDuration, setGameDuration] = useState(20);
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useGameSocket({
    onTimeUpdate: setGameTime,
    onGameOver: () => {
      navigate(`/game-over/${sessionId}`);
    },
  });

  useEffect(() => {
    const fetchGameDuration = async () => {
      try {
        const session = await ApiService.get(`/session/info/${sessionId}`);
        setGameDuration(session[0].gameTime);
      } catch (error) {
        console.error('Ошибка получения данных сессии:', error);
      }
    };
    
    fetchGameDuration();
  }, [sessionId]);

  useEffect(() => {
    if (gameTime === '--:--') {
      setCurrentYear(0);
      return;
    }

    try {
      const [minutes, seconds] = gameTime.split(':').map(Number);
      const remainingMinutes = minutes + seconds / 60;
      const elapsedMinutes = gameDuration - remainingMinutes;
      const calculatedYear = Math.floor(elapsedMinutes / 4);

      setCurrentYear(Math.max(0, calculatedYear));
    } catch (error) {
      console.error('Ошибка вычисления текущего года:', error);
    }
  }, [gameTime, gameDuration]);


  return (
    <div className='container app-background'>
      <div>
        <h1 className='custom-title '>В МИРЕ ФИНАНСОВ</h1>
      </div>

      <div className='container-game'>
        <div className='container-game__left'>
          <p className='timer'>
            До конца игры: <span>{gameTime}</span>
          </p>
        </div>

        <Game />

        <div className='container-game__right'>
          <p className='timer--out timer'>
            Текущий год: <span>{currentYear}</span>
          </p>
          <button className='button' onClick={() => setIsHelpOpen(true)}>
            Помощь
          </button>
          <button className='button' onClick={() => setIsControlsOpen(true)}>
            Управление
          </button>
          <button className='button' onClick={() => setIsExitOpen(true)}>
            Выйти из игры
          </button>
        </div>
      </div>

      <Modal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} title='Помощь'>
        <HelpContent />
      </Modal>
      <Modal isOpen={isControlsOpen} onClose={() => setIsControlsOpen(false)} title='Управление'>
        <ControlsContent />
      </Modal>
      <Modal isOpen={isExitOpen} onClose={() => setIsExitOpen(false)} title='Выход из игры'>
        <ExitGameContent onClose={() => setIsExitOpen(false)} />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
         {/* Стартовая страница */}
         <Route path='/' element={<StartPage />} />
         {/* Страница создания новой игры */}
         <Route path='/creator-lobby/:sessionId' element={<CreatorLobby />} />
         {/* Страница для игрока */}
         <Route path='/player-lobby/:sessionId' element={<PlayerLobby />} />
         {/* Страница окончания игры */}
         <Route path='/game-over/:sessionId' element={<GameOver />} />
         {/* Основная игровая сцена */}
        <Route path='/game/:sessionId' element={<GameWrapper />} />
      </Routes>
    </Router>
  );
}
export default App;
