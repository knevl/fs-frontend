import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnStartPageContent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='text-center'>
      <p className='mb-4'>
        Вы уверены, что хотите выйти из лобби? Вы являетесь создателем игры, и в
        случае выхода, ЗДЕСЬ НАПИСАТЬ ЧТО БУДЕТ!!!!!!!!!
      </p>
      <div className='flex justify-center'>
        <button onClick={handleBack} className='button-red'>
          Выйти из игрового лобби
        </button>
      </div>
    </div>
  );
};
export default ReturnStartPageContent;
