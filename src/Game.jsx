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
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
      },
      pixelArt: true,
    };

    function preload() {
      this.load.tilemapTiledJSON('cityMap', 'maps/city1.tmj');
      this.load.image('tilemap_packed', 'maps/tilemap_packed.png');
      this.load.image('tilemap_packed1', 'maps/tilemap_packed1.png');
      // Загрузка изображений персонажа
      this.load.image(
        'player_left_stay',
        'images/characters/player_left_stay.png'
      );
      this.load.image('player_left_1', 'images/characters/player_left_1.png');
      this.load.image('player_left_2', 'images/characters/player_left_2.png');
      this.load.image(
        'player_front_stay',
        'images/characters/player_front_stay.png'
      );
      this.load.image('player_front_1', 'images/characters/player_front_1.png');
      this.load.image('player_front_2', 'images/characters/player_front_2.png');
      this.load.image(
        'player_back_stay',
        'images/characters/player_back_stay.png'
      );
      this.load.image('player_back_1', 'images/characters/player_back_1.png');
      this.load.image('player_back_2', 'images/characters/player_back_2.png');
      this.load.image(
        'player_right_stay',
        'images/characters/player_right_stay.png'
      );
      this.load.image('player_right_1', 'images/characters/player_right_1.png');
      this.load.image('player_right_2', 'images/characters/player_right_2.png');
    }

    function create() {
      const map = this.make.tilemap({ key: 'cityMap' });
      console.log('Map loaded:', map);

      const tileset1 = map.addTilesetImage('tilemap_packed', 'tilemap_packed');
      const tileset2 = map.addTilesetImage(
        'tilemap_packed1',
        'tilemap_packed1'
      );

      // Создание слоёв
      map.createLayer('фон', [tileset1, tileset2], 0, 0);
      map.createLayer('дорога', [tileset1, tileset2], 0, 0);
      map.createLayer('асфальт', [tileset1, tileset2], 0, 0);
      map.createLayer('задний план газон/газон', [tileset1, tileset2], 0, 0);
      map.createLayer('задний план газон/деревья', [tileset1, tileset2], 0, 0);
      map.createLayer('декор улицы', [tileset1, tileset2], 0, 0);
      map.createLayer('магазин/забор', [tileset1, tileset2], 0, 0);
      map.createLayer('магазин/магазин здание', [tileset1, tileset2], 0, 0);
      map.createLayer('магазин/магазин детали', [tileset1, tileset2], 0, 0);
      map.createLayer('магазин/магазин витрины', [tileset1, tileset2], 0, 0);
      map.createLayer('парк/парк', [tileset1, tileset2], 0, 0);
      map.createLayer('парк/деревья скамейки', [tileset1, tileset2], 0, 0);
      map.createLayer('новости/новости', [tileset1, tileset2], 0, 0);
      map.createLayer('новости/скамейка', [tileset1, tileset2], 0, 0);
      map.createLayer(
        'просто дом/просто дом здание',
        [tileset1, tileset2],
        0,
        0
      );
      map.createLayer(
        'просто дом/просто дом декор',
        [tileset1, tileset2],
        0,
        0
      );
      map.createLayer('налоговая/налоговая здание', [tileset1, tileset2], 0, 0);
      map.createLayer('налоговая/налоговая детали', [tileset1, tileset2], 0, 0);
      map.createLayer('банк/банк здание', [tileset1, tileset2], 0, 0);
      map.createLayer('банк/банк детали', [tileset1, tileset2], 0, 0);
      map.createLayer('биржа/биржа здание', [tileset1, tileset2], 0, 0);
      map.createLayer('биржа/биржа детали', [tileset1, tileset2], 0, 0);
      map.createLayer(
        'предприятие/предприятие здание',
        [tileset1, tileset2],
        0,
        0
      );
      map.createLayer(
        'предприятие/предприятие детали',
        [tileset1, tileset2],
        0,
        0
      );

      // Подписи зданий
      const labelsLayer = map.getObjectLayer('Подписи зданий');
      if (labelsLayer) {
        labelsLayer.objects.forEach((object) => {
          const { x, y } = object;
          const text = object.text?.text || 'Здание';
          this.add.text(x, y, text, {
            fontSize: '10px',
            color: '#55557f',
            fontFamily: 'QuinqueFive',
          });
        });
      }

      // Создание игрока как спрайта
      const player = this.physics.add.sprite(400, 300, 'player_front_stay');
      player.setCollideWorldBounds(true);
      player.setScale(1.2);

      // Настройка анимаций
      this.anims.create({
        key: 'left_walk',
        frames: [{ key: 'player_left_1' }, { key: 'player_left_2' }],
        frameRate: 5,
        repeat: -1, // Зацикливание
      });
      this.anims.create({
        key: 'left_stay',
        frames: [{ key: 'player_left_stay' }],
        frameRate: 1,
      });

      this.anims.create({
        key: 'right_walk',
        frames: [{ key: 'player_right_1' }, { key: 'player_right_2' }],
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: 'right_stay',
        frames: [{ key: 'player_right_stay' }],
        frameRate: 1,
      });

      this.anims.create({
        key: 'front_walk',
        frames: [{ key: 'player_front_1' }, { key: 'player_front_2' }],
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: 'front_stay',
        frames: [{ key: 'player_front_stay' }],
        frameRate: 1,
      });

      this.anims.create({
        key: 'back_walk',
        frames: [{ key: 'player_back_1' }, { key: 'player_back_2' }],
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: 'back_stay',
        frames: [{ key: 'player_back_stay' }],
        frameRate: 1,
      });

      // Управление игроком с анимациями
      this.input.keyboard.on('keydown-LEFT', () => {
        player.body.setVelocityX(-60);
        player.anims.play('left_walk', true);
      });
      this.input.keyboard.on('keydown-RIGHT', () => {
        player.body.setVelocityX(60);
        player.anims.play('right_walk', true);
      });
      this.input.keyboard.on('keydown-UP', () => {
        player.body.setVelocityY(-60);
        player.anims.play('back_walk', true);
      });
      this.input.keyboard.on('keydown-DOWN', () => {
        player.body.setVelocityY(60);
        player.anims.play('front_walk', true);
      });
      this.input.keyboard.on('keyup', () => {
        player.body.setVelocity(0);
        if (player.anims.currentAnim) {
          const direction = player.anims.currentAnim.key.split('_')[0];
          player.anims.play(`${direction}_stay`, true);
        }
      });

      // Слой коллизий
      const collisionsLayer = map.getObjectLayer('Коллизии');
      if (collisionsLayer) {
        const collisionGroup = this.physics.add.staticGroup();
        collisionsLayer.objects.forEach((object) => {
          const shouldCollide = object.properties?.find(
            (p) => p.name === 'collides'
          )?.value;
          if (shouldCollide) {
            const { x, y, width, height } = object;
            const wall = collisionGroup.create(
              x + width / 2,
              y + height / 2,
              null,
              null,
              false
            );
            wall.setSize(width, height);
            wall.setVisible(false);
          }
        });
        this.physics.add.collider(player, collisionGroup);
      }

      // Слой взаимодействия
      const interactionsLayer = map.getObjectLayer('Взаимодействие');
      if (interactionsLayer) {
        const interactionZones = [];
        interactionsLayer.objects.forEach((object) => {
          const action = object.properties?.find(
            (p) => p.name === 'action'
          )?.value;
          if (action) {
            const { x, y, width, height } = object;
            const zone = this.add.zone(
              x + width / 2,
              y + height / 2,
              width,
              height
            );
            this.physics.world.enable(zone);
            zone.body.setAllowGravity(false);
            zone.action = action;
            zone.isOverlapping = false;
            interactionZones.push(zone);
          }
        });

        // Обработка перекрытия
        this.physics.add.overlap(
          player,
          interactionZones,
          (player, zone) => {
            // Сбрасываем все зоны
            interactionZones.forEach((z) => (z.isOverlapping = false));
            // Устанавливаем true только для текущей зоны
            zone.isOverlapping = true;
          },
          null,
          this
        );

        // Сбрасываем состояние, когда игрок не в зоне
        this.physics.world.on('worldstep', () => {
          if (!this.physics.overlap(player, interactionZones)) {
            interactionZones.forEach((zone) => (zone.isOverlapping = false));
          }
        });

        // Обработка нажатия пробела
        this.input.keyboard.on('keydown-SPACE', () => {
          const overlappingZone = interactionZones.find(
            (zone) => zone.isOverlapping
          );
          if (overlappingZone) {
            console.log('Interaction:', overlappingZone.action);
          }
        });
      }

      // Настройка камеры
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
    }

    const gameInstance = new Phaser.Game(config);
    gameRef.current = gameInstance;

    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  return <div id='phaser-game' className='w-full md:w-3/4 mx-auto my-10'></div>;
};

export default Game;
