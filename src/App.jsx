import React from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import AlertModal from './components/ui/elements/AlertModal';

function App() {
  const score = useGameStore((state) => state.score);
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col items-center p-4'>
      <Game />
      <div className='mt-6'>
        <AlertModal />
      </div>
    </div>
  );
}

export default App;
