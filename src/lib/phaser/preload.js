export function preload() {
  this.load.tilemapTiledJSON('cityMap', '/maps/city1.tmj');
  this.load.image('tilemap_packed', '/maps/tilemap_packed.png');
  this.load.image('tilemap_packed1', '/maps/tilemap_packed1.png');
  // player
  this.load.image(
    'player_left_stay',
    '/images/characters/player_left_stay.png'
  );
  this.load.image('player_left_1', '/images/characters/player_left_1.png');
  this.load.image('player_left_2', '/images/characters/player_left_2.png');
  this.load.image(
    'player_front_stay',
    '/images/characters/player_front_stay.png'
  );
  this.load.image('player_front_1', '/images/characters/player_front_1.png');
  this.load.image('player_front_2', '/images/characters/player_front_2.png');
  this.load.image(
    'player_back_stay',
    '/images/characters/player_back_stay.png'
  );
  this.load.image('player_back_1', '/images/characters/player_back_1.png');
  this.load.image('player_back_2', '/images/characters/player_back_2.png');
  this.load.image(
    'player_right_stay',
    '/images/characters/player_right_stay.png'
  );
  this.load.image('player_right_1', '/images/characters/player_right_1.png');
  this.load.image('player_right_2', '/images/characters/player_right_2.png');

  this.load.image('coin', '/images/coin.png');
  this.load.image('closeIcon', '/images/check_square_grey_cross.png');
  //npc
  this.load.image('npc_left_1', '/images/characters/npc_left_1.png');
  this.load.image('npc_left_stay', '/images/characters/npc_left_stay.png');
  this.load.image('npc_left_2', '/images/characters/npc_left_2.png');
  this.load.image('npc_front_stay', '/images/characters/npc_front_stay.png');
  this.load.image('npc_front_1', '/images/characters/npc_front_1.png');
  this.load.image('npc_front_2', '/images/characters/npc_front_2.png');
  this.load.image('npc_back_stay', '/images/characters/npc_back_stay.png');
  this.load.image('npc_back_1', '/images/characters/npc_back_1.png');
  this.load.image('npc_back_2', '/images/characters/npc_back_2.png');
  this.load.image('npc_right_stay', '/images/characters/npc_right_stay.png');
  this.load.image('npc_right_1', '/images/characters/npc_right_1.png');
  this.load.image('npc_right_2', '/images/characters/npc_right_2.png');
  //npc1
  this.load.image('npc1_front_stay', '/images/characters/npc1_fron_stay.png');
  this.load.image('npc1_front_1', '/images/characters/npc1_front_1.png');
  this.load.image('npc1_front_2', '/images/characters/npc1_front_2.png');
  this.load.image('npc1_left_stay', '/images/characters/npc1_left_stay.png');
  this.load.image('npc1_left_1', '/images/characters/npc1_left_1.png');
  this.load.image('npc1_left_2', '/images/characters/npc1_left_2.png');
  this.load.image('npc1_right_stay', '/images/characters/npc1_right_stay.png');
  this.load.image('npc1_right_1', '/images/characters/npc1_right_1.png');
  this.load.image('npc1_right_2', '/images/characters/npc1_right_2.png');
  this.load.image('npc1_back_stay', '/images/characters/npc1_back_stay.png');
  this.load.image('npc1_back_1', '/images/characters/npc1_back_1.png');
  this.load.image('npc1_back_2', '/images/characters/npc1_back_2.png');
  //сar
  this.load.image('car_left', '/images/cars/car_left.png');
  this.load.image('car_right', '/images/cars/car_right.png');
  this.load.image('car_front', '/images/cars/car_front.png');
  this.load.image('car_back', '/images/cars/car_back.png');
  //car1
  this.load.image('car1_left', '/images/cars/car1_left.png');
  this.load.image('car1_right', '/images/cars/car1_right.png');
  this.load.image('car1_front', '/images/cars/car1_front.png');
  this.load.image('car1_back', '/images/cars/car1_back.png');
  // стрелки
  this.load.image('arrow-left', '/icons/arrow_basic_w.png');
  this.load.image('arrow-right', '/icons/arrow_basic_e.png');
  this.load.image('arrow-up', '/icons/arrow_basic_n.png');
  this.load.image('arrow-down', '/icons/arrow_basic_s.png');

  // иконки
  this.load.image('icon-metal', '/icons/metal.png');
  this.load.image('icon-fabric', '/icons/fabric.png');
  this.load.image('icon-mechanism', '/icons/mechanism.png');
  this.load.image('icon-food', '/icons/food.png');
  this.load.image('icon-plastic', '/icons/plastic.png');
  this.load.image('icon-chips', '/icons/chips.png');

  this.load.image('icon-clothing-store', '/icons/clothing-store.png');
  this.load.image('icon-bakery', '/icons/bakery.png');
  this.load.image('icon-auto-repair', '/icons/auto-repair.png');
  this.load.image('icon-electronics-factory', '/icons/electronics-factory.png');
  this.load.image('icon-restaurant', '/icons/restaurant.png');
  this.load.image('icon-toy-store', '/icons/toy-store.png');
  this.load.image('icon-farm', '/icons/farm.png');
  this.load.image('icon-beauty-salon', '/icons/beauty-salon.png');
  this.load.image('icon-it-startup', '/icons/it-startup.png');
  this.load.image('icon-car-factory', '/icons/car-factory.png');
  this.load.image('icon-bank', '/icons/bank.png');
  this.load.image('icon-construction-company', '/icons/construction-company.png');
  this.load.image('icon-food-delivery', '/icons/food-delivery.png');
}
