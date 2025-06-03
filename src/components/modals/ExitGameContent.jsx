import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '@/services/api.js';

const ExitGameContent = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const handleExit = async () => {
    await ApiService.patch('/player/exit');
    navigate(`/game-over/${sessionId}`);
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
