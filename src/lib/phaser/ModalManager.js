export class ModalManager {
  constructor(scene) {
    this.scene = scene;
    this.modalGroup = scene.add.group();
  }

  showModal(message) {
    this.modalGroup.clear(true, true);

    const modalBg = this.scene.add.rectangle(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      300,
      200,
      0xffffff,
      0.8
    );
    modalBg.setOrigin(0.5);
    modalBg.setInteractive();

    const modalText = this.scene.add.text(
      Math.round(this.scene.cameras.main.centerX),
      Math.round(this.scene.cameras.main.centerY),
      message,
      {
        fontSize: '24px',
        color: '#000000',
        align: 'center',
        fontFamily: 'Arial',
        wordWrap: { width: 280 },
      }
    );
    modalText.setOrigin(0.5);

    const closeButton = this.scene.add.text(400, 300, 'Закрыть', {
      fontSize: '24px',
      color: '#ff0000',
      fontFamily: 'Arial',
    });
    closeButton.setOrigin(0.5);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
      this.modalGroup.clear(true, true);
    });

    this.modalGroup.addMultiple([modalBg, modalText, closeButton]);
  }

  hideModal() {
    this.modalGroup.clear(true, true);
  }
}
