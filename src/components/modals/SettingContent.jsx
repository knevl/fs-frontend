import React, { useRef, useState } from 'react';

const SettingContent = ({
  isMusicPlaying,
  volume,
  onToggleMusic,
  onVolumeChange,
}) => {
  return (
    <div className='text-white space-y-4 '>
      <p className='font-bold'>Музыка в игре</p>

      <div className='flex items-center space-x-4'>
        <button onClick={onToggleMusic} className='button-green'>
          {isMusicPlaying ? 'Выключить' : 'Включить'}
        </button>

        <div className='flex items-center space-x-2'>
          <label htmlFor='volume-slider'>Громкость:</label>
          <input
            id='volume-slider'
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className='volume-slider'
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SettingContent;
