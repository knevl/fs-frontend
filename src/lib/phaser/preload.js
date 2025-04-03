export function preload() {
  this.load.tilemapTiledJSON('cityMap', 'maps/city1.tmj');
  this.load.image('tilemap_packed', 'maps/tilemap_packed.png');
  this.load.image('tilemap_packed1', 'maps/tilemap_packed1.png');
  // Загрузка изображений персонажа
  this.load.image('player_left_stay', 'images/characters/player_left_stay.png');
  this.load.image('player_left_1', 'images/characters/player_left_1.png');
  this.load.image('player_left_2', 'images/characters/player_left_2.png');
  this.load.image(
    'player_front_stay',
    'images/characters/player_front_stay.png'
  );
  this.load.image('player_front_1', 'images/characters/player_front_1.png');
  this.load.image('player_front_2', 'images/characters/player_front_2.png');
  this.load.image('player_back_stay', 'images/characters/player_back_stay.png');
  this.load.image('player_back_1', 'images/characters/player_back_1.png');
  this.load.image('player_back_2', 'images/characters/player_back_2.png');
  this.load.image(
    'player_right_stay',
    'images/characters/player_right_stay.png'
  );
  this.load.image('player_right_1', 'images/characters/player_right_1.png');
  this.load.image('player_right_2', 'images/characters/player_right_2.png');
  this.load.image('coin', 'images/coin.png');
}
