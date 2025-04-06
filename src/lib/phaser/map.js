export function createMap(scene) {
  const map = scene.make.tilemap({ key: 'cityMap' });
  console.log('Map loaded:', map);

  const tileset1 = map.addTilesetImage('tilemap_packed', 'tilemap_packed');
  const tileset2 = map.addTilesetImage('tilemap_packed1', 'tilemap_packed1');

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

  return map;
}

export function createLabels(scene, map) {
  const labelsLayer = map.getObjectLayer('Подписи зданий');
  if (labelsLayer) {
    labelsLayer.objects.forEach((object) => {
      const { x, y } = object;
      const text = object.text?.text || 'Здание';
      scene.add.text(x, y, text, {
        fontSize: '10px',
        color: '#55557f',
        fontFamily: 'QuinqueFive',
      });
    });
  }
}
