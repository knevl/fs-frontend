import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExitGameContent = () => {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/game-over');
  };

  return (
    <div className='text-center'>
      <p className='mb-4'>
        Вы уверены, что хотите выйти из игры? Вы больше не сможете вернуться в
        нее, а в рейтинге отобразится ваш текущий счет.
      </p>
      <div className='flex justify-center'>
        <button onClick={handleExit} className='button-green'>
          Выйти из игры
        </button>
      </div>
    </div>
  );
};

export default ExitGameContent;
