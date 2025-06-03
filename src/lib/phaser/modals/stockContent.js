import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createStockContent(scene, sessionId) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Биржа акций', 'Мои акции'];
  let activeTab = 'Биржа акций';

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
      const emptyText = scene.add.text(0, 0, 'Нет доступных акций', {
        fontSize: '14px', color: '#000', fontFamily: 'Arial'
      }).setOrigin(0.5);
      contentContainer.add(emptyText);
      return;
    }

    const chart = scene.add.graphics();
    chart.lineStyle(2, 0x0077aa);
    chart.strokeRect(-180, -90, 160, 180);
    chart.moveTo(-170, 80);
    chart.lineTo(-120, 20);
    chart.lineTo(-70, 50);
    chart.lineTo(-30, -10);
    chart.strokePath();
    contentContainer.add(chart);

    const comboBox = scene.add.dom(100, -70).createFromHTML(`
      <select id="stock-select">
        ${shares.map(s => {
          const id = isMarket ? s.id : s.shares?.id;
          const name = isMarket ? s.company?.companyName : s.shares?.company?.companyName;
          return `<option value="${id}">${name}</option>`;
        }).join('')}
      </select>
    `);

    contentContainer.add(comboBox);

    const infoText = scene.add.text(20, -20, '', {
      fontSize: '12px',
      color: '#000',
      fontFamily: 'Arial',
    });
    contentContainer.add(infoText);

    const quantityInput = scene.add.dom(100, 40).createFromHTML('<input type="number" id="quantity-input" placeholder="Количество" value="1" min="1" style="width:100px;">');
    contentContainer.add(quantityInput);

    const actionBtn = scene.add.text(100, 80, isMarket ? 'Купить' : 'Продать', {
      fontSize: '14px',
      color: '#0077aa',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    contentContainer.add(actionBtn);

    actionBtn.setDepth(10).setInteractive({ useHandCursor: true });

    function updateInfo(selectedId) {
      let selected;

      if (isMarket) {
        selected = shares.find(s => s.id == selectedId);
      } else {
        selected = shares.find(s => s.shares?.id == selectedId);
      }

      if (!selected) {
        infoText.setText('Выберите акцию');
        return;
      }

      const company = selected.company || selected.shares?.company;
      const price = selected.costShares || selected.shares?.costShares;
      const div = company?.divident_rate || 0;
      const quantity = selected.quantity ?? '-';

      let info = `Компания: ${company?.companyName || 'N/A'}\nЦена: ${price}\nДивиденды: ${div}`;
      if (!isMarket) info += `\nКоличество: ${quantity}`;
      infoText.setText(info);
    }

    comboBox.node.addEventListener('change', e => {
      updateInfo(e.target.value);
    });

    updateInfo(
      isMarket ? shares[0].id : shares[0].shares?.id
    );

    actionBtn.on('pointerdown', async () => {
      const selectedValue = comboBox.node.querySelector('select')?.value;
      const selectedId = selectedValue ? parseInt(selectedValue) : NaN;
      const quantity = parseInt(quantityInput.node.querySelector('#quantity-input')?.value || '0');

      console.log('selectedId:', selectedId, 'quantity:', quantity);

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

  }

  await renderTab();
  return container;
}
