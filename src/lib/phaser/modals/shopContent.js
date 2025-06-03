import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createShopContent(scene, sessionId) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Магазин', 'Мои ресурсы'];
  let activeTab = 'Магазин';

  const tabs = scene.add.container(0, -130);
  tabTitles.forEach((title, i) => {
    const tab = scene.add.text(-100 + i * 200, 0, title, {
      fontSize: '16px',
      color: '#000',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    tab.on('pointerdown', () => {
      activeTab = title;
      renderTab();
    });

    tabs.add(tab);
  });
  container.add(tabs);

  const scrollContainer = scene.add.container(0, 0);
  let resourcesData = { market: [], player: [] };

  const loadResources = async () => {
    try {
      const [market, player] = await Promise.all([
        ApiService.get(`/resources/market/${sessionId}`),
        ApiService.get('/resources'),
      ]);
      resourcesData.market = market;
      resourcesData.player = player;
    } catch (e) {
      toast.error('Ошибка загрузки ресурсов');
    }
  };

  const renderTab = () => {
    scrollContainer.removeAll(true);

    const isMarket = activeTab === 'Магазин';
    const data = isMarket ? resourcesData.market : resourcesData.player;
    let offsetX = -data.length * 95 / 2;

    data.forEach((res, i) => {
      const card = scene.add.container(offsetX + i * 140, 0);
      const bg = scene.add.rectangle(0, 0, 130, 160, 0xf0f0f0).setStrokeStyle(2, 0x999999);
      card.add(bg);

      const icon = scene.add.circle(0, -50, 20, 0xcccccc);
      card.add(icon);

      const name = isMarket ? res.resource?.resourceName || 'Неизвестно' : res.resourceName;
      const quantity = isMarket ? res.quantity : res.amount;
      const cost = isMarket ? res.resource?.resourCecost : res.cost;
      const resourceId = res.resourceId;

      const nameText = scene.add.text(0, -20, name, {
        fontSize: '14px',
        color: '#000',
        fontFamily: 'Arial',
        align: 'center',
        wordWrap: { width: 120 },
      }).setOrigin(0.5);
      card.add(nameText);

      const qtyText = scene.add.text(0, 0, `Кол-во: ${quantity}\nСтоимость ${cost}`, {
        fontSize: '12px',
        color: '#333',
        fontFamily: 'Arial',
      }).setOrigin(0.5);
      card.add(qtyText);

      const btnLabel = isMarket ? 'Купить' : 'Продать';
      const btn = scene.add.text(0, 30, btnLabel, {
        fontSize: '12px',
        color: '#0077aa',
        fontFamily: 'Arial',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerdown', async () => {
        try {
          const endpoint = isMarket ? 'buy' : 'sell';
          const response = await ApiService.post(`/resources/${endpoint}`, {
            resourceId,
            gameSessionId: sessionId,
          });

          if (response?.message) {
            toast.success(response.message);
          } else {
            toast.success(`${btnLabel} успешно`);
          }

          await loadResources();
          renderTab();
        } catch (e) {
          const errMsg = e?.response?.data?.message || 'Ошибка транзакции';
          toast.error(errMsg);
        }
      });

      card.add(btn);
      scrollContainer.add(card);
    });
  };

  const scrollSpeed = 40;
  const leftArrow = scene.add.text(-220, 10, '<', {
    fontSize: '32px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

  const rightArrow = scene.add.text(200, 10, '>', {
    fontSize: '32px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

  leftArrow.on('pointerdown', () => {
    scrollContainer.x = Math.min(scrollContainer.x + scrollSpeed, 0);
  });

  rightArrow.on('pointerdown', () => {
    scrollContainer.x -= scrollSpeed;
  });

  container.add(scrollContainer);
  container.add(leftArrow);
  container.add(rightArrow);

  await loadResources();
  renderTab();

  return container;
}
