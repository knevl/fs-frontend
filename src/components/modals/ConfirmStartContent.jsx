import React from 'react';

const ConfirmStartContent = ({ onCancel, onConfirm }) => (
  <div className='text-center'>
    <p className='mb-4'>
      Убедитесь, что все игроки зашли в лобби. Вы уверены, что хотите начать
      игру?
    </p>
    <div className='flex justify-center space-x-4'>
      <button onClick={onConfirm} className='button-green'>
        Начать игру
      </button>
    </div>
  </div>
);

export default ConfirmStartContent;
