import React from 'react';
import Game from './Game';
import { useGameStore } from './store/store';
import AlertModal from './components/ui/elements/AlertModal';

function App() {
  const score = useGameStore((state) => state.score);
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col items-center p-4'>
      <header className='mb-4 text-center'>
        <h1 className='text-3xl font-bold'>
          Phaser, Tailwind, shadcn & Zustand Demo
        </h1>
        <p className='text-lg'>Счёт: {score}</p>
      </header>
      <Game />
      <div className='mt-6'>
        <AlertModal />
      </div>
      <footer className='mt-4 text-sm'>
        <p>Адаптивный пример с использованием shadcn‑ui</p>
      </footer>
    </div>
  );
}

export default App;
