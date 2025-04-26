import { showModal } from './modalgame.js';
import { createTaxContent } from './modals/taxContent.js';
import { createBankContent } from './modals/bankContent.js';
import { createStockContent } from './modals/stockContent.js';
import { createCompanyContent } from './modals/companyContent.js';
import { createNewsContent } from './modals/newsContent.js';
import { createShopContent } from './modals/shopContent.js';

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

    scene.input.keyboard.on('keydown-SPACE', () => {
      const overlappingZone = interactionZones.find(
        (zone) => zone.isOverlapping
      );
      if (overlappingZone && scene.modalGroup.getChildren().length === 0) {
        let content;
        let width = 400;
        let height = 300;

        switch (overlappingZone.action) {
          case 'tax':
            content = createTaxContent(scene);
            break;
          case 'bank':
            content = createBankContent(scene);
            width = 500;
            height = 400;
            break;
          case 'stock':
            content = createStockContent(scene);
            width = 600;
            height = 350;
            break;
          case 'company':
            content = createCompanyContent(scene);
            break;
          case 'news':
            content = createNewsContent(scene);
            height = 450;
            break;
          case 'shop':
            content = createShopContent(scene);
            width = 450;
            break;
          default:
            content = scene.add.text(
              0,
              0,
              `Вы взаимодействуете с: ${overlappingZone.action}`,
              {
                fontSize: '16px',
                color: '#333',
                align: 'center',
                fontFamily: 'Arial',
                wordWrap: { width: 350 },
              }
            );
            content.setOrigin(0.5);
        }
        showModal(scene, { content, width, height });
      } else {
        scene.modalGroup.clear(true, true);
      }
    });
  }
}
