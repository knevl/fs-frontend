export function setupCoinsCounter(scene) {
  scene.coins = 0;
  const coinIcon = scene.add.image(20, 20, 'coin');
  coinIcon.setOrigin(0);
  coinIcon.setScale(0.5);

  scene.coinsText = scene.add.text(55, 18, `${scene.coins}`, {
    fontSize: '32px',
    color: '#ffffff',
    fontFamily: 'Tiny5-Regular',
  });
  scene.coinsText.setOrigin(0);
  scene.coinsText.setShadow(1, 1, '#000000', 2);

  scene.updateCoins = function (newAmount) {
    this.coins = newAmount;
    this.coinsText.setText(`${this.coins}`);
  };

  scene.input.keyboard.on('keydown-C', () => {
    scene.updateCoins(scene.coins + 1);
  });
}
