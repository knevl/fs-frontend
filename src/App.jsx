import React from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import AlertModal from './components/ui/elements/AlertModal';
import './index.css';

function App() {
  const score = useGameStore((state) => state.score);
  return (
    <div className='container app-background'>
      <div>
        <h1 className='custom-title'>ДЕТСКИЙ ФИНАНСОВЫЙ СИМУЛЯТОР</h1>
      </div>
      <Game />
    </div>
  );
}

export default App;
