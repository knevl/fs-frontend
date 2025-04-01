import React from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import AlertModal from './components/ui/elements/AlertModal';

function App() {
  const score = useGameStore((state) => state.score);
  return (
    <div className='container'>
      <div>
        <h1>Детский финансовый симулятор</h1>
      </div>
      <Game />
    </div>
  );
}

export default App;
