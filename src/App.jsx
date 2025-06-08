import React, { useState, useEffect, useRef } from 'react';
import Game from './Game';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import StartPage from './pages/StartPage';
import CreatorLobby from './pages/CreatorLobby';
import PlayerLobby from './pages/PlayerLobby';
import GameOver from './pages/GameOver';
import Modal from './components/ui/elements/Modal';
import HelpContent from './components/modals/HelpContent';
import ExitGameContent from './components/modals/ExitGameContent';
import SettingContent from './components/modals/SettingContent';
import BagContent from './components/modals/BagContent';
import './index.css';
import { useGameSocket } from './hooks/useGameSocket';
import { ApiService } from './services/api';
import { toast, Toaster } from 'react-hot-toast';

function GameWrapper() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [gameTime, setGameTime] = useState('--:--');
  const [currentYear, setCurrentYear] = useState(0);
  const [gameDuration, setGameDuration] = useState(20);
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const audioRef = useRef(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useGameSocket({
    onTimeUpdate: setGameTime,
    onGameOver: () => {
      navigate(`/game-over/${sessionId}`);
    },
    onGameOver: () => {
      navigate(`/game-over/${sessionId}`);
    },

    onPlayerAction: ({ message }) => {
      toast.success(message, { id: `action-${message}` });
    },
    onPlayerNotification: ({ message }) => {
      toast.success(message, { id: `action-${message}` });
    },

    onNewsNotification: ({ message }) => {
      toast(message, {
        id: `news-${message}`,
        icon: '📰',
        style: {
          border: '2px solid rgba(153, 255, 243, 0.97)',
          padding: '12px',
          color: '#92400e',
          background: '#fef3c7',
        },
      });
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      //audioRef.current.play().catch(() => {});
    }
  }, [volume]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <div className='container app-background'>
    <Toaster position='top-right' reverseOrder={false} toastOptions={{ duration: 20000 }} />
      <div>
        <h1 className='custom-title '>В МИРЕ ФИНАНСОВ</h1>
      </div>

      <div className='container-game'>
        <div className='container-game__left'>
          <p className='timer'>
            До конца игры: <span>{gameTime}</span>
          </p>
          <button className='icon-button' onClick={() => setIsBagOpen(true)}>
            <img src='/icons/bag.png' alt='Инвентарь' />
          </button>
        </div>

        <Game />
        <audio
          ref={audioRef}
          src='/music/Pixel Serenity.mp3'
          loop
          preload='auto'
        />
        <div className='container-game__right'>
          <p className='timer--out timer'>
            Текущий год: <span>{currentYear}</span>
          </p>
          <button className='button' onClick={() => setIsHelpOpen(true)}>
            Помощь
          </button>
          <button className='button' onClick={() => setIsSettingOpen(true)}>
            Настройки
          </button>
          <button className='button' onClick={() => setIsExitOpen(true)}>
            Выйти из игры
          </button>
        </div>
      </div>
      <Modal
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        title='Портфель'
      >
        <BagContent />
      </Modal>
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title='Помощь'
      >
        <HelpContent />
      </Modal>
      <Modal
        isOpen={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
        title='Настройки'
      >
        <SettingContent
          isMusicPlaying={isMusicPlaying}
          volume={volume}
          onToggleMusic={toggleMusic}
          onVolumeChange={handleVolumeChange}
        />
      </Modal>
      <Modal
        isOpen={isExitOpen}
        onClose={() => setIsExitOpen(false)}
        title='Выход из игры'
      >
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
