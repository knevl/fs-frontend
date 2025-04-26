import React from 'react';

const CalculationContent = ({ player }) => {
  return (
    <div>
      <p>Расчет для {player.name}</p>
      <p>Монеты: {player.coins}</p>
    </div>
  );
};

export default CalculationContent;
