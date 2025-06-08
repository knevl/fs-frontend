import React from 'react';

const CalculationContent = ({ player }) => {
  if (!player) return <p>Нет данных</p>;
  return (
    <div>
      <p>Расчет для {player.playerName}</p>
      <p>Итоговый баланс: {player.finalBalance}</p>
      <p>Доход с предприятий: {player.totalCompanyValue}</p>
      <p>Выплачено налогов: {player.totalTaxPaid}</p>
      <p>Погашено по кредиту: {player.totalLoanPaid}</p>
      <p>Возврат по вкладам: {player.totalDepositReturn}</p>
      <p>Выручка с ресурсов: {player.totalResourceGain}</p>
      <p>Доход с акций:{player.totalSharesGain}</p>
    </div>
  );
};

export default CalculationContent;
