import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 800,
      height: 480,
      scene: {
        preload: preload,
        create: create,
      },
    };

    function preload() {
      // Загружаем тайловую карту из public/maps/city.tmj
      this.load.tilemapTiledJSON('cityMap', 'maps/city1.tmj');
      // Phaser автоматически загрузит изображения тайлсетов из city.tmj,
      // если пути в файле указаны правильно (например, "tilemap_packed.png")
      this.load.image('tilemap_packed', 'maps/tilemap_packed.png'); // Загружаем изображение для первого tileset
      this.load.image('tilemap_packed1', 'maps/tilemap_packed1.png');
    }

    function create() {
      // Создаём карту с использованием загруженного ключа
      const map = this.make.tilemap({ key: 'cityMap' });
      console.log('Map loaded:', map); // Для отладки: проверяем, загрузилась ли карта

      // Добавляем тайлсеты, имена должны совпадать с теми, что в city.tmj
      const tileset1 = map.addTilesetImage('tilemap_packed', 'tilemap_packed');
      const tileset2 = map.addTilesetImage(
        'tilemap_packed1',
        'tilemap_packed1'
      );

      // Создаём слой "фон" (проверьте имя слоя в city.tmj)
      const layer = map.createLayer('фон', [tileset1, tileset2], 0, 0);
      const road = map.createLayer('дорога', [tileset1, tileset2], 0, 0);
      const pavement = map.createLayer('асфальт', [tileset1, tileset2], 0, 0);
      //подписи зданий
      const grass = map.createLayer(
        'задний план газон/газон',
        [tileset1, tileset2],
        0,
        0
      );
      const trees = map.createLayer(
        'задний план газон/деревья',
        [tileset1, tileset2],
        0,
        0
      );
      const decor = map.createLayer('декор улицы', [tileset1, tileset2], 0, 0);
      const shop_fence = map.createLayer(
        'магазин/забор',
        [tileset1, tileset2],
        0,
        0
      );
      const shop_building = map.createLayer(
        'магазин/магазин здание',
        [tileset1, tileset2],
        0,
        0
      );
      const shop_detiles = map.createLayer(
        'магазин/магазин детали',
        [tileset1, tileset2],
        0,
        0
      );
      const shop_showcase = map.createLayer(
        'магазин/магазин витрины',
        [tileset1, tileset2],
        0,
        0
      );
      const park = map.createLayer('парк/парк', [tileset1, tileset2], 0, 0);
      const park_trees = map.createLayer(
        'парк/деревья скамейки',
        [tileset1, tileset2],
        0,
        0
      );
      const news_news = map.createLayer(
        'новости/новости',
        [tileset1, tileset2],
        0,
        0
      );
      const news_bench = map.createLayer(
        'новости/скамейка',
        [tileset1, tileset2],
        0,
        0
      );
      const home_building = map.createLayer(
        'просто дом/просто дом здание',
        [tileset1, tileset2],
        0,
        0
      );
      const home_decor = map.createLayer(
        'просто дом/просто дом декор',
        [tileset1, tileset2],
        0,
        0
      );
      const tax_building = map.createLayer(
        'налоговая/налоговая здание',
        [tileset1, tileset2],
        0,
        0
      );
      const tax_details = map.createLayer(
        'налоговая/налоговая детали',
        [tileset1, tileset2],
        0,
        0
      );
      const bank_building = map.createLayer(
        'банк/банк здание',
        [tileset1, tileset2],
        0,
        0
      );
      const bank_details = map.createLayer(
        'банк/банк детали',
        [tileset1, tileset2],
        0,
        0
      );
      const stock_building = map.createLayer(
        'биржа/биржа здание',
        [tileset1, tileset2],
        0,
        0
      );
      const stock_details = map.createLayer(
        'биржа/биржа детали',
        [tileset1, tileset2],
        0,
        0
      );
      const company_building = map.createLayer(
        'предприятие/предприятие здание',
        [tileset1, tileset2],
        0,
        0
      );
      const company_details = map.createLayer(
        'предприятие/предприятие детали',
        [tileset1, tileset2],
        0,
        0
      );
      //коллизии
      //взаимодействие

      // Устанавливаем границы камеры в соответствии с размерами карты (50x30 тайлов по 16x16 = 800x480 пикселей)
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

      // Опционально: центрируем камеру (если нужно)
      this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
    }

    const gameInstance = new Phaser.Game(config);
    gameRef.current = gameInstance;

    // Очистка при размонтировании компонента
    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  return (
    <div id='phaser-game' className='w-full md:w-3/4 mx-auto my-10 '></div>
  );
};

export default Game;
