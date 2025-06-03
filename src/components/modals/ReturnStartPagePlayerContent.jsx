import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ApiService } from '@/services/api.js';

const ReturnStartPagePlayerContent = () => {
  const navigate = useNavigate();

  const handleBack = async () => {
    try {
      await ApiService.delete('/player/exit-hard');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      toast.error('Ошибка при выходе из лобби');
      console.error(error);
    }
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
