export function setupInteractions(scene, map, player) {
  const interactionsLayer = map.getObjectLayer('Взаимодействие');
  if (interactionsLayer) {
    const interactionZones = [];
    interactionsLayer.objects.forEach((object) => {
      const action = object.properties?.find((p) => p.name === 'action')?.value;
      if (action) {
        const { x, y, width, height } = object;
        const zone = scene.add.zone(
          x + width / 2,
          y + height / 2,
          width,
          height
        );
        scene.physics.world.enable(zone);
        zone.body.setAllowGravity(false);
        zone.action = action;
        zone.isOverlapping = false;
        interactionZones.push(zone);
      }
    });

    scene.physics.add.overlap(
      player,
      interactionZones,
      (player, zone) => {
        interactionZones.forEach((z) => (z.isOverlapping = false));
        zone.isOverlapping = true;
      },
      null,
      scene
    );

    scene.physics.world.on('worldstep', () => {
      if (!scene.physics.overlap(player, interactionZones)) {
        interactionZones.forEach((zone) => (zone.isOverlapping = false));
      }
    });

    scene.modalGroup = scene.add.group();

    // Обновленная функция showModal
    scene.showModal = function ({ content, width = 400, height = 300 }) {
      this.modalGroup.clear(true, true);
      const centerX = this.cameras.main.centerX;
      const centerY = this.cameras.main.centerY;
      const graphics = this.add.graphics();
      const borderRadius = 8;
      const borderWidth = 2;
      const shadowOffset = 4;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      // Отрисовка фона
      graphics.fillStyle(0x666880, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight + shadowOffset,
        width,
        height,
        borderRadius
      );
      graphics.fillStyle(0xdadce7, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        width,
        height,
        borderRadius
      );
      graphics.lineStyle(borderWidth, 0x989aaf, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        width,
        height,
        borderRadius
      );
      graphics.lineStyle(borderWidth, 0xffffff, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth + borderWidth,
        centerY - halfHeight + borderWidth,
        width - 2 * borderWidth,
        height - 2 * borderWidth,
        borderRadius - borderWidth
      );
      graphics.setDepth(0); // Фон на нижнем слое

      // Прозрачный фон для интерактивности
      const modalBg = this.add.rectangle(centerX, centerY, width, height);
      modalBg.setOrigin(0.5);
      modalBg.setInteractive();
      modalBg.setDepth(1); // Над графикой фона
      this.modalGroup.addMultiple([graphics, modalBg]);

      // Добавляем контент
      if (content) {
        content.setPosition(centerX, centerY); // Центрируем контейнер
        content.setDepth(2); // Контент поверх фона
        this.modalGroup.add(content);
      }

      // Кнопка закрытия
      const closeButton = this.add.image(
        centerX + halfWidth - 20,
        centerY - halfHeight + 20,
        'closeIcon'
      );
      closeButton.setOrigin(0.5);
      closeButton.setScale(0.5);
      closeButton.setInteractive();
      closeButton.setDepth(3); // Кнопка поверх всего
      closeButton.on('pointerdown', () => {
        this.modalGroup.clear(true, true);
      });
      this.modalGroup.add(closeButton);
    };

    // Функции для создания контента
    function createTaxContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Налоговая: информация о налогах', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    function createBankContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Банк: история транзакций и вклады', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    function createStockContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Биржа: графики', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    function createCompanyContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Предприятие: доход', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    function createNewsContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Новости: последние события', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    function createShopContent(scene) {
      const container = scene.add.container(0, 0);
      const text = scene.add.text(0, 0, 'Магазин: товары на продажу', {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 350 },
      });
      text.setOrigin(0.5);
      container.add(text);
      return container;
    }

    // Обработчик нажатия клавиши SPACE
    scene.input.keyboard.on('keydown-SPACE', () => {
      const overlappingZone = interactionZones.find(
        (zone) => zone.isOverlapping
      );
      if (overlappingZone && scene.modalGroup.getChildren().length === 0) {
        let content;
        let width = 400;
        let height = 300;

        switch (overlappingZone.action) {
          case 'tax':
            content = createTaxContent(scene);
            break;
          case 'bank':
            content = createBankContent(scene);
            width = 500;
            height = 400;
            break;
          case 'stock':
            content = createStockContent(scene);
            width = 600;
            height = 350;
            break;
          case 'company':
            content = createCompanyContent(scene);
            break;
          case 'news':
            content = createNewsContent(scene);
            height = 450;
            break;
          case 'shop':
            content = createShopContent(scene);
            width = 450;
            break;
          default:
            content = scene.add.text(
              0,
              0,
              `Вы взаимодействуете с: ${overlappingZone.action}`,
              {
                fontSize: '16px',
                color: '#333',
                align: 'center',
                fontFamily: 'Arial',
                wordWrap: { width: 350 },
              }
            );
            content.setOrigin(0.5);
        }
        scene.showModal({ content, width, height });
      } else {
        scene.modalGroup.clear(true, true);
      }
    });
  }
}
