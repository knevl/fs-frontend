export function showModal(scene, { content, width = 400, height = 300 }) {
  scene.modalGroup.clear(true, true);
  const centerX = scene.cameras.main.centerX;
  const centerY = scene.cameras.main.centerY;
  const graphics = scene.add.graphics();
  const borderRadius = 8;
  const borderWidth = 2;
  const shadowOffset = 4;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

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
  graphics.setDepth(0);

  const modalBg = scene.add.rectangle(centerX, centerY, width, height);
  modalBg.setOrigin(0.5);
  modalBg.setInteractive();
  modalBg.setDepth(1);
  scene.modalGroup.addMultiple([graphics, modalBg]);

  if (content) {
    const maskShape = scene.make.graphics({});
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
      centerX - halfWidth,
      centerY - halfHeight,
      width,
      height
    );

    const mask = maskShape.createGeometryMask();
    content.setMask(mask);
    content.setPosition(centerX, centerY);
    content.setDepth(2);
    scene.modalGroup.add(content);
  }

  const closeButton = scene.add.image(
    centerX + halfWidth - 20,
    centerY - halfHeight + 20,
    'closeIcon'
  );
  closeButton.setOrigin(0.5);
  closeButton.setScale(0.5);
  closeButton.setInteractive();
  closeButton.setDepth(3);
  closeButton.on('pointerdown', () => {
    scene.modalGroup.clear(true, true);
  });
  scene.modalGroup.add(closeButton);
}
