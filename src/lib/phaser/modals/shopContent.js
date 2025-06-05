import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createShopContent(scene, sessionId) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Магазин', 'Мои ресурсы'];
  let activeTab = 'Магазин';

  const tabs = scene.add.container(0, -130);
  const tabRects = [];

  tabTitles.forEach((title, i) => {
    const tabContainer = scene.add.container(-100 + i * 200, 0);

    const tabRect = scene.add
      .rectangle(0, 10, 100, 30, 0x1c9fd7)
      .setStrokeStyle(2, 0x167da8)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    const tabText = scene.add
      .text(0, 10, title, {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    tabRect.on('pointerdown', () => {
      activeTab = title;
      updateTabStyles();
      renderTab();
    });

    tabContainer.add([tabRect, tabText]);
    tabs.add(tabContainer);
    tabRects.push({ title, rect: tabRect });
  });

  function updateTabStyles() {
    tabRects.forEach(({ title, rect }) => {
      if (activeTab === title) {
        rect.setStrokeStyle(2, 0xffffff);
      } else {
        rect.setStrokeStyle(2, 0x167da8);
      }
    });
  }

  updateTabStyles();

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

    if (data.length === 0) {
      const emptyText = scene.add
        .text(
          0,
          0,
          isMarket
            ? 'Магазин пуст. Пожалуйста, подождите.'
            : 'У вас нет ресурсов. Можете купить необходимые ресурсы в магазине.',
          {
            fontSize: '16px',
            color: '#555555',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 300 },
          }
        )
        .setOrigin(0.5);

      scrollContainer.add(emptyText);
      return;
    }

    let offsetX = (-data.length * 95) / 2;

    data.forEach((res, i) => {
      const card = scene.add.container(offsetX + i * 140, 0);

      const bg = scene.add
        .rectangle(0, 0, 130, 160, 0xffffff)
        .setStrokeStyle(2, 0x999999);
      card.add(bg);

      const icon = scene.add.circle(0, -50, 20, 0xcccccc);
      card.add(icon);

      const name = isMarket
        ? res.resource?.resourceName || 'Неизвестно'
        : res.resourceName;
      const quantity = isMarket ? res.quantity : res.amount;
      const cost = isMarket ? res.resource?.resourCecost : res.cost;

      const nameText = scene.add
        .text(0, -20, name, {
          fontSize: '14px',
          color: '#000000',
          fontFamily: 'Arial',
          align: 'center',
          wordWrap: { width: 120 },
        })
        .setOrigin(0.5);
      card.add(nameText);

      const qtyText = scene.add
        .text(0, 0, `Кол-во: ${quantity}\nСтоимость: ${cost}`, {
          fontSize: '12px',
          color: '#333333',
          fontFamily: 'Arial',
          align: 'center',
        })
        .setOrigin(0.5);
      card.add(qtyText);

      const btnLabel = isMarket ? 'Купить' : 'Продать';
      const btnBg = scene.add
        .rectangle(0, 50, 80, 30, 0xee2747)
        .setStrokeStyle(2, 0x871023)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      const btnText = scene.add
        .text(0, 50, btnLabel, {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);

      const btn = scene.add.container(0, 0, [btnBg, btnText]);
      btnBg.on('pointerdown', async () => {
        try {
          const endpoint = isMarket ? 'buy' : 'sell';
          const response = await ApiService.post(`/resources/${endpoint}`, {
            resourceId: res.resourceId,
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

  const leftArrow = scene.add
    .image(-200, 10, 'arrow-left')
    .setDisplaySize(32, 32)
    .setInteractive({ useHandCursor: true });

  const rightArrow = scene.add
    .image(200, 10, 'arrow-right')
    .setDisplaySize(32, 32)
    .setInteractive({ useHandCursor: true });

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
