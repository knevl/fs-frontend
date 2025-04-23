export function setupCollisions(scene, map, player, entities) {
  const collisionsLayer = map.getObjectLayer('Коллизии');
  if (collisionsLayer) {
    const collisionGroup = scene.physics.add.staticGroup();
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
    scene.physics.add.collider(player, collisionGroup);
    scene.physics.add.collider(player, entities);
  }
}
