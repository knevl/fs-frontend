import React,  { useEffect, useState } from 'react';
import { ApiService } from '@/services/api.js';

const BagContext = () => {
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await ApiService.get('/player/inventory');
        setInventory(data);
      } catch (err) {
        console.error('Ошибка загрузки инвентаря:', err);
      }
    };

    fetchInventory();
  }, []);

  if (!inventory) {
    return <p className='text-white'>Загрузка...</p>;
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <p className='text-white'>Краткая информация по инвентарю игрока {inventory.playerName}</p>
        <p className='text-white'>Кредит: {inventory.hasLoan ? 'Есть' : 'Нет'} </p>
        <p className='text-white'>Количсетво активных вкладов: {inventory.deposits} </p>
        <p className='text-white'>Количество предприятий: {inventory.companies} </p>
        <p className='text-white'>Неоплаченные налоги: {inventory.unpaidTaxes} </p>
        <p className='text-white'>Количество ресурсов: {inventory.resources} </p>
        <p className='text-white'>Количество акций: {inventory.shares} </p>
      </div>
    </div>
  );
};

export default BagContext;
