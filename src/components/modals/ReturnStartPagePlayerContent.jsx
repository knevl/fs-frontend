import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReturnStartPagePlayerContent = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className='text-center'>
      <p className='mb-4'>Вы уверены, что хотите покинуть игру?</p>
      <div className='flex justify-center'>
        <button onClick={handleBack} className='button-red'>
          Выйти из игрового лобби
        </button>
      </div>
    </div>
  );
};
export default ReturnStartPagePlayerContent;
