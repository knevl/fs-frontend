import React, { useState } from 'react';
import ControlsContent from './ControlsContent';

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className='border-b border-white'>
      {' '}
      <button
        className='w-full text-left py-2 px-4 focus:outline-none font-bold'
        onClick={onToggle}
      >
        <span className='text-white'>{title}</span>
        <span className='float-right text-white'>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className='p-4 text-white'>{children}</div>}
    </div>
  );
};

const HelpContent = () => {
  const [openSection, setOpenSection] = useState(null); // Храним индекс открытой секции

  const sections = [
    {
      title: 'Управление персонажем',
      content: <ControlsContent />,
    },
    {
      title: 'Что такое предприятие и как его улучшить?',
      content: (
        <p>
          Предприятие — это ваш бизнес, который приносит прибыль. Улучшение
          предприятия увеличивает его доход и стоимость акций, но требует
          дополнительного вложения монет.
        </p>
      ),
    },
    {
      title: 'Как рассчитываются налоги?',
      content: (
        <p>
          Налог – это небольшая часть денег, которую нужно отдать государству,
          когда предприятие получает прибыль. В нашей игре, когда предприятие
          зарабатывает деньги, система автоматически рассчитывает налог по
          простому правилу: 10% от прибыли. Для оплаты налога нужно подойти в
          Налоговую.
        </p>
      ),
    },
    {
      title: 'Кредит и вклад: в чём разница?',
      content: (
        <p>
          Кредит — это деньги, которые вы берёте у банка и должны вернуть с
          процентами. Вклад — это ваши деньги, которые банк хранит и начисляет
          на них проценты.
        </p>
      ),
    },
    {
      title: 'Зачем нужны ресурсы и как их использовать?',
      content: (
        <p>
          Ресурсы — материалы для ведения бизнеса (например, ткань, металл). Их
          нужно покупать в магазине для открытия и улучшения предприятия.
          Количество ресурсов в магазине обновляются несколько раз за игру.
        </p>
      ),
    },
    {
      title: 'На что влияют новости?',
      content: (
        <p>
          В первую очередь новости влияют на прибыль определенных типов
          предприятий. Новости могут как и увеличивать прибыль, так и уменьшать
          ее. Вследствие изменения прибыли, изменяется стоимость акций этого
          предприятия.
        </p>
      ),
    },
    {
      title: 'Когда стоит покупать акции, а когда продавать?',
      content: (
        <p>
          Акции – это кусочки предприятий, которые можно купить или продать.
          Если предприятие хорошо работает и его прибыль растёт, цена акций
          поднимается, и можно продать их дороже, чем купили. Если же
          предприятие не справляется, цена акций падает, и может быть выгодно
          купить их по низкой цене, чтобы потом продать, когда всё наладится.
        </p>
      ),
    },
  ];

  const handleToggle = (index) => {
    // Если секция уже открыта, закрываем её; иначе открываем новую
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div>
      <p className='mb-4'>Объяснения игровых механик:</p>
      <div className='space-y-2'>
        {sections.map((section, index) => (
          <AccordionItem
            key={index}
            title={section.title}
            isOpen={openSection === index}
            onToggle={() => handleToggle(index)}
          >
            {section.content}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
};

export default HelpContent;
