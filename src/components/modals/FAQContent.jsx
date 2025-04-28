import React, { useState } from 'react';
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
const FAQContent = () => {
  const [openSection, setOpenSection] = useState(null);
  const sections = [
    {
      title: 'Сколько длится игра?',
      content: (
        <p>
          Игра может длиться 20 минуты (10 игровых лет) или ..., в зависимости
          от выбранного режима.
        </p>
      ),
    },
    {
      title: 'Как определяется победитель?',
      content: (
        <p>
          Победителем становится игрок с наибольшим балансом по окончании
          игровой сессии.
        </p>
      ),
    },
    {
      title: 'Что делать, если недостаточно игроков?',
      content: (
        <p>
          Если в сессии не хватает реальных игроков,вы можете добавить ботов,
          которые имитируют поведение игроков.
        </p>
      ),
    },
    {
      title: 'Как я могу следить за своими финансами?',
      content: (
        <p>
          На экране всегда отображается баланс, а в банке игроки могут узнать
          информацию о проведенных транзакциях.
        </p>
      ),
    },
    {
      title: 'Можно ли начать новую игру?',
      content: (
        <p>
          Да, после завершения сессии вы всегда можете запустить новую игру и
          попробовать улучшить свои результаты.
        </p>
      ),
    },
    {
      title: 'Как завершить игру раньше?',
      content: (
        <p>
          Если игрок решит выйти из игры раньше, он может нажать на кнопку
          "Выйти из игры" слева от игровой карты. После подтверждения этого
          действия, игрок больше не сможет вернуться в игру, но его балас будет
          учитываться в окончательном рейтинге.
        </p>
      ),
    },
  ];
  const handleToggle = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
  return (
    <div>
      <p className='mb-4'>Ответы на часто задаваемые вопросы:</p>
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

export default FAQContent;
