import React from 'react';
import keyboardUp from '/images/keyboard_up.png';
import keyboardLeft from '/images/keyboard_left.png';
import keyboardRight from '/images/keyboard_right.png';
import keyboardDown from '/images/keyboard_down.png';
import keyboardSpace from '/images/keyboard_space.png';

const ControlsContent = () => (
  <div>
    <p className='mb-4'>Управление в игре:</p>
    <ul className='space-y-4'>
      <li className='flex items-center'>
        <img src={keyboardUp} alt='Up Arrow' className='w-8 h-8 mr-2' />
        <img src={keyboardLeft} alt='Left Arrow' className='w-8 h-8 mr-2' />
        <img src={keyboardRight} alt='Right Arrow' className='w-8 h-8 mr-2' />
        <img src={keyboardDown} alt='Down Arrow' className='w-8 h-8 mr-2' />
        <span>— передвижение персонажа</span>
      </li>
      <li className='flex items-center'>
        <span>Для взаимодейтсвия подойти к зданию и нажать </span>
        <img src={keyboardSpace} alt='Space' className='w-16 h-8 mr-2' />
      </li>
    </ul>
  </div>
);

export default ControlsContent;
