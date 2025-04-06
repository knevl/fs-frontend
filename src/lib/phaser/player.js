export function createPlayer(scene) {
  const player = scene.physics.add.sprite(400, 300, 'player_front_stay');
  player.setCollideWorldBounds(true);
  player.setScale(1.2);

  scene.anims.create({
    key: 'left_walk',
    frames: [{ key: 'player_left_1' }, { key: 'player_left_2' }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: 'left_stay',
    frames: [{ key: 'player_left_stay' }],
    frameRate: 1,
  });
  scene.anims.create({
    key: 'right_walk',
    frames: [{ key: 'player_right_1' }, { key: 'player_right_2' }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: 'right_stay',
    frames: [{ key: 'player_right_stay' }],
    frameRate: 1,
  });
  scene.anims.create({
    key: 'front_walk',
    frames: [{ key: 'player_front_1' }, { key: 'player_front_2' }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: 'front_stay',
    frames: [{ key: 'player_front_stay' }],
    frameRate: 1,
  });
  scene.anims.create({
    key: 'back_walk',
    frames: [{ key: 'player_back_1' }, { key: 'player_back_2' }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: 'back_stay',
    frames: [{ key: 'player_back_stay' }],
    frameRate: 1,
  });

  return player;
}

export function setupPlayerControls(scene, player) {
  scene.input.keyboard.on('keydown-LEFT', () => {
    player.body.setVelocityX(-60);
    player.anims.play('left_walk', true);
  });
  scene.input.keyboard.on('keydown-RIGHT', () => {
    player.body.setVelocityX(60);
    player.anims.play('right_walk', true);
  });
  scene.input.keyboard.on('keydown-UP', () => {
    player.body.setVelocityY(-60);
    player.anims.play('back_walk', true);
  });
  scene.input.keyboard.on('keydown-DOWN', () => {
    player.body.setVelocityY(60);
    player.anims.play('front_walk', true);
  });
  scene.input.keyboard.on('keyup', () => {
    player.body.setVelocity(0);
    if (player.anims.currentAnim) {
      const direction = player.anims.currentAnim.key.split('_')[0];
      player.anims.play(`${direction}_stay`, true);
    }
  });
}
