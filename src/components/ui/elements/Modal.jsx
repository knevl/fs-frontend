import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Затемнение фона */}
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>

      {/* Контент модального окна */}
      <div
        className='relative rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3'
        style={{
          backgroundColor: '#1C9FD7', // Фон модального окна
          border: '2px solid #167DA8', // Внешняя обводка
          boxShadow: 'inset 0 0 0 2px #36BDF7', // Внутренняя обводка
        }}
      >
        <h2 className='text-2xl font-bold mb-4 text-white'>{title}</h2>
        <div className='mb-6 text-white'>{children}</div>
        <div className='flex justify-center'>
          <button
            className='px-4 py-2 rounded'
            style={{
              backgroundColor: '#36BDF7', // Фон кнопки
              color: 'white', // Цвет текста кнопки
              border: '2px solid #167DA8', // Обводка кнопки
            }}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
