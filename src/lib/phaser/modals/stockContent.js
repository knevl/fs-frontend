import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createStockContent(scene, sessionId) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Биржа акций', 'Мои акции'];
  let activeTab = 'Биржа акций';

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
      rect.setStrokeStyle(2, activeTab === title ? 0xffffff : 0x167da8);
    });
  }

  container.add(tabs);

  const contentContainer = scene.add.container(0, 0);
  container.add(contentContainer);

  async function renderTab() {
    contentContainer.removeAll(true);

    const isMarket = activeTab === 'Биржа акций';
    let shares;

    try {
      shares = isMarket
        ? await ApiService.get(`/shares/available?gameSessionId=${sessionId}`)
        : await ApiService.get('/shares/player');
    } catch (err) {
      toast.error('Ошибка загрузки акций');
      return;
    }

    if (!shares || shares.length === 0) {
      const emptyText = scene.add
        .text(0, 0, 'Нет доступных акций', {
          fontSize: '14px',
          color: '#000',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);
      contentContainer.add(emptyText);
      return;
    }

    const centerX = 0;

    const comboBox = scene.add.dom(centerX, -70).createFromHTML(`
      <select id="stock-select" style="background-color: white;">
        ${shares
          .map((s) => {
            const id = isMarket ? s.id : s.shares?.id;
            const name = isMarket
              ? s.company?.companyName
              : s.shares?.company?.companyName;
            return `<option value="${id}">${name}</option>`;
          })
          .join('')}
      </select>
    `);
    contentContainer.add(comboBox);

    const infoText = scene.add
      .text(centerX, -20, '', {
        fontSize: '12px',
        color: '#000',
        fontFamily: 'Arial',
        align: 'center',
        wordWrap: { width: 280, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    contentContainer.add(infoText);

    const quantityInput = scene.add
      .dom(centerX, 30)
      .createFromHTML(
        '<input type="number" id="quantity-input" placeholder="Количество" value="1" min="1" style="width:100px; background-color: white;">'
      );
    contentContainer.add(quantityInput);

    const buttonBg = scene.add
      .rectangle(centerX, 80, 100, 30, 0xee2747)
      .setStrokeStyle(2, 0x871023)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const actionText = scene.add
      .text(centerX, 80, isMarket ? 'Купить' : 'Продать', {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    buttonBg.on('pointerdown', async () => {
      const selectedValue = comboBox.node.querySelector('select')?.value;
      const selectedId = selectedValue ? parseInt(selectedValue) : NaN;
      const quantity = parseInt(
        quantityInput.node.querySelector('#quantity-input')?.value || '0'
      );

      if (!selectedId || isNaN(quantity) || quantity <= 0) {
        toast.error('Укажите корректное количество акций');
        return;
      }

      try {
        await ApiService.post(`/shares/${isMarket ? 'buy' : 'sell'}`, {
          sharesId: selectedId,
          quantity,
        });
        toast.success(isMarket ? 'Акции куплены' : 'Акции проданы');
        renderTab();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Ошибка транзакции');
      }
    });

    contentContainer.add(buttonBg);
    contentContainer.add(actionText);

    function updateInfo(selectedId) {
      const selected = isMarket
        ? shares.find((s) => s.id == selectedId)
        : shares.find((s) => s.shares?.id == selectedId);

      if (!selected) {
        infoText.setText('Выберите акцию');
        return;
      }

      const company = selected.company || selected.shares?.company;
      const price = selected.costShares || selected.shares?.costShares;
      const div = company?.divident_rate || 0;
      const quantity = selected.quantity ?? '-';

      let info = `Компания: ${
        company?.companyName || 'N/A'
      }\nЦена: ${price}\nДивиденды: ${div}`;
      if (!isMarket) info += `\nКоличество: ${quantity}`;

      infoText.setText(info);
    }

    comboBox.node.addEventListener('change', (e) => {
      updateInfo(e.target.value);
    });

    updateInfo(isMarket ? shares[0].id : shares[0].shares?.id);
  }

  await renderTab();
  return container;
}
