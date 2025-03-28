import React, { useState } from 'react';
import { Button } from '../common/Button';

const AlertModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className='bg-primary text-primary-foreground hover:bg-primary/80'
        onClick={() => setOpen(true)}
      >
        Открыть модалку
      </Button>
      {open && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-background text-foreground rounded-lg p-6 shadow-lg max-w-sm w-full'>
            <h2 className='text-xl font-bold mb-2'>Модальное окно</h2>
            <p className='mb-4'>
              Это пример модального окна, использующего компонент Button из
              shadcn‑ui.
            </p>
            <Button
              className='bg-secondary text-secondary-foreground hover:bg-secondary/80'
              onClick={() => setOpen(false)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertModal;
