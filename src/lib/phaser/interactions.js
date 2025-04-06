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

    scene.showModal = function (message) {
      this.modalGroup.clear(true, true);
      const centerX = this.cameras.main.centerX;
      const centerY = this.cameras.main.centerY;
      const graphics = this.add.graphics();
      const modalWidth = 300;
      const modalHeight = 200;
      const borderRadius = 8;
      const borderWidth = 2;
      const shadowOffset = 4;
      const halfWidth = modalWidth / 2;
      const halfHeight = modalHeight / 2;

      graphics.fillStyle(0x666880, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight + shadowOffset,
        modalWidth,
        modalHeight,
        borderRadius
      );
      graphics.fillStyle(0xdadce7, 1);
      graphics.fillRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        modalWidth,
        modalHeight,
        borderRadius
      );
      graphics.lineStyle(borderWidth, 0x989aaf, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth,
        centerY - halfHeight,
        modalWidth,
        modalHeight,
        borderRadius
      );
      graphics.lineStyle(borderWidth, 0xffffff, 1);
      graphics.strokeRoundedRect(
        centerX - halfWidth + borderWidth,
        centerY - halfHeight + borderWidth,
        modalWidth - 2 * borderWidth,
        modalHeight - 2 * borderWidth,
        borderRadius - borderWidth
      );

      const modalBg = this.add.rectangle(
        centerX,
        centerY,
        modalWidth,
        modalHeight
      );
      modalBg.setOrigin(0.5);
      modalBg.setInteractive();
      this.modalGroup.addMultiple([graphics, modalBg]);

      const modalText = this.add.text(centerX, centerY, message, {
        fontSize: '16px',
        color: '#333',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 280 },
      });
      modalText.setOrigin(0.5);
      this.modalGroup.add(modalText);

      const closeButton = this.add.image(
        centerX + halfWidth - 20,
        centerY - halfHeight + 20,
        'closeIcon'
      );
      closeButton.setOrigin(0.5);
      closeButton.setScale(0.5);
      closeButton.setInteractive();
      closeButton.on('pointerdown', () => {
        this.modalGroup.clear(true, true);
      });
      this.modalGroup.add(closeButton);
    };

    scene.input.keyboard.on('keydown-SPACE', () => {
      const overlappingZone = interactionZones.find(
        (zone) => zone.isOverlapping
      );
      if (overlappingZone && scene.modalGroup.getChildren().length === 0) {
        scene.showModal(`Вы взаимодействуете с: ${overlappingZone.action}`);
      } else {
        scene.modalGroup.clear(true, true);
      }
    });
  }
}
