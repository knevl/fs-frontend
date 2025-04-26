export function createNPC(scene, x, y, skin, path) {
  const npc = scene.physics.add.sprite(x, y, `${skin}_front_1`);
  npc.setScale(1.2);
  npc.setCollideWorldBounds(true);

  // маршрут и параметры
  npc.path = path;
  npc.currentPointIndex = 0;
  npc.speed = 30;
  npc.skin = skin;

  // анимации
  scene.anims.create({
    key: `${skin}_left_walk`,
    frames: [{ key: `${skin}_left_1` }, { key: `${skin}_left_2` }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: `${skin}_right_walk`,
    frames: [{ key: `${skin}_right_1` }, { key: `${skin}_right_2` }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: `${skin}_front_walk`,
    frames: [{ key: `${skin}_front_1` }, { key: `${skin}_front_2` }],
    frameRate: 5,
    repeat: -1,
  });
  scene.anims.create({
    key: `${skin}_back_walk`,
    frames: [{ key: `${skin}_back_1` }, { key: `${skin}_back_2` }],
    frameRate: 5,
    repeat: -1,
  });

  // логика движений
  npc.update = function () {
    const targetPoint = path[npc.currentPointIndex];
    const dx = targetPoint.x - npc.x;
    const dy = targetPoint.y - npc.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      npc.currentPointIndex = (npc.currentPointIndex + 1) % path.length;
      return;
    }

    const angle = Math.atan2(dy, dx);
    npc.body.setVelocity(
      Math.cos(angle) * npc.speed,
      Math.sin(angle) * npc.speed
    );

    // воспроизведение аним
    if (Math.abs(dx) > Math.abs(dy)) {
      npc.anims.play(dx > 0 ? `${skin}_right_walk` : `${skin}_left_walk`, true);
    } else {
      npc.anims.play(dy > 0 ? `${skin}_front_walk` : `${skin}_back_walk`, true);
    }
  };
  scene.events.on('update', () => {
    npc.update();
  });

  return npc;
}
export function createCar(scene, x, y, skin, path) {
  const car = scene.physics.add.sprite(x, y, `${skin}_front`);
  car.setScale(1);
  car.setCollideWorldBounds(true);

  car.path = path;
  car.currentPointIndex = 0;
  car.speed = 75;

  car.update = function () {
    const targetPoint = path[car.currentPointIndex];
    const dx = targetPoint.x - car.x;
    const dy = targetPoint.y - car.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      car.currentPointIndex = (car.currentPointIndex + 1) % path.length;
      return;
    }

    const angle = Math.atan2(dy, dx);
    car.body.setVelocity(
      Math.cos(angle) * car.speed,
      Math.sin(angle) * car.speed
    );

    //текстура
    if (Math.abs(dx) > Math.abs(dy)) {
      car.setTexture(dx > 0 ? `${skin}_right` : `${skin}_left`);
    } else {
      car.setTexture(dy > 0 ? `${skin}_front` : `${skin}_back`);
    }
  };

  scene.events.on('update', () => {
    car.update();
  });

  return car;
}
