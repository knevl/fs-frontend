export function create() {
  const map = this.make.tilemap({ key: 'cityMap' });
  console.log('Map loaded:', map);

  const tileset1 = map.addTilesetImage('tilemap_packed', 'tilemap_packed');
  const tileset2 = map.addTilesetImage('tilemap_packed1', 'tilemap_packed1');

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
  map.createLayer('просто дом/просто дом здание', [tileset1, tileset2], 0, 0);
  map.createLayer('просто дом/просто дом декор', [tileset1, tileset2], 0, 0);
  map.createLayer('налоговая/налоговая здание', [tileset1, tileset2], 0, 0);
  map.createLayer('налоговая/налоговая детали', [tileset1, tileset2], 0, 0);
  map.createLayer('банк/банк здание', [tileset1, tileset2], 0, 0);
  map.createLayer('банк/банк детали', [tileset1, tileset2], 0, 0);
  map.createLayer('биржа/биржа здание', [tileset1, tileset2], 0, 0);
  map.createLayer('биржа/биржа детали', [tileset1, tileset2], 0, 0);
  map.createLayer('предприятие/предприятие здание', [tileset1, tileset2], 0, 0);
  map.createLayer('предприятие/предприятие детали', [tileset1, tileset2], 0, 0);

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
    repeat: -1,
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
      const action = object.properties?.find((p) => p.name === 'action')?.value;
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
        interactionZones.forEach((z) => (z.isOverlapping = false));
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

    // Создаем группу для элементов модального окна
    this.modalGroup = this.add.group();

    // Функция для показа модального окна
    this.showModal = function (message) {
      // Очищаем предыдущее модальное окно, если оно есть
      this.modalGroup.clear(true, true);

      // Получаем центр экрана
      const centerX = this.cameras.main.centerX;
      const centerY = this.cameras.main.centerY;

      // Создаем графический объект для фона модального окна
      const graphics = this.add.graphics();

      // Параметры стиля, взятые из CSS кнопки
      const modalWidth = 300;
      const modalHeight = 200;
      const borderRadius = 8; // Закругленные углы
      const borderWidth = 2; // Толщина обводки
      const shadowOffset = 4; // Смещение тени вниз
      const halfWidth = modalWidth / 2;
      const halfHeight = modalHeight / 2;

      // Рисуем тень снизу (как в CSS: 0 4px 0 0 #666880)
      graphics.fillStyle(0x666880, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight + shadowOffset,
        modalWidth,
        modalHeight,
        borderRadius
      );

      // Рисуем основной фон (как background-color: #dadce7)
      graphics.fillStyle(0xdadce7, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        modalWidth,
        modalHeight,
        borderRadius
      );

      // Рисуем внешнюю обводку (как border: 2px solid #989aaf)
      graphics.lineStyle(borderWidth, 0x989aaf, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        modalWidth,
        modalHeight,
        borderRadius
      );

      // Рисуем внутреннюю белую обводку (как box-shadow: inset 0 0 0 2px #ffffff)
      graphics.lineStyle(borderWidth, 0xffffff, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth + borderWidth,
        centerY - halfHeight + borderWidth,
        modalWidth - 2 * borderWidth,
        modalHeight - 2 * borderWidth,
        borderRadius - borderWidth
      );

      // Делаем фон интерактивным, чтобы блокировать клики по игре
      const modalBg = this.add.rectangle(
        centerX,
        centerY,
        modalWidth,
        modalHeight
      );
      modalBg.setOrigin(0.5);
      modalBg.setInteractive();

      // Добавляем графику и фон в группу
      this.modalGroup.addMultiple([graphics, modalBg]);

      // Текст модального окна (цвет текста как в CSS: #333)
      const modalText = this.add.text(centerX, centerY, message, {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 280 },
      });
      modalText.setOrigin(0.5);
      this.modalGroup.add(modalText);

      // Кнопка закрытия как изображение в правом верхнем углу
      const closeButton = this.add.image(
        centerX + halfWidth - 20, // Справа с отступом 20px от края
        centerY - halfHeight + 20, // Сверху с отступом 20px от края
        'closeIcon' // Ключ изображения из preload
      );
      closeButton.setOrigin(0.5);
      closeButton.setScale(0.5); // Уменьшаем размер, если нужно
      closeButton.setInteractive();
      closeButton.on('pointerdown', () => {
        this.modalGroup.clear(true, true); // Закрываем модальное окно
      });
      this.modalGroup.add(closeButton);
    };

    // Обработка нажатия пробела
    this.input.keyboard.on('keydown-SPACE', () => {
      const overlappingZone = interactionZones.find(
        (zone) => zone.isOverlapping
      );
      if (overlappingZone && this.modalGroup.getChildren().length === 0) {
        this.showModal(`Вы взаимодействуете с: ${overlappingZone.action}`);
      } else {
        this.modalGroup.clear(true, true); // Закрываем, если окно уже открыто
      }
    });
  }
  // Инициализация монет
  this.coins = 0;

  // Изображение монетки
  const coinIcon = this.add.image(20, 20, 'coin');
  coinIcon.setOrigin(0);
  coinIcon.setScale(0.5);

  // Текст счетчика
  this.coinsText = this.add.text(55, 18, `${this.coins}`, {
    fontSize: '32px',
    color: '#ffffff',
    fontFamily: 'Tiny5-Regular',
  });
  this.coinsText.setOrigin(0);
  this.coinsText.setShadow(1, 1, '#000000', 2);
  // Функция обновления монет
  this.updateCoins = function (newAmount) {
    this.coins = newAmount;
    this.coinsText.setText(`${this.coins}`);
  };

  // Тест: прибавляем монету при нажатии клавиши "C"
  this.input.keyboard.on('keydown-C', () => {
    this.updateCoins(this.coins + 1);
  });
  // Настройка камеры
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
}
