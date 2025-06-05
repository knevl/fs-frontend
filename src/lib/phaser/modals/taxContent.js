import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createTaxContent(scene) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Предприятия', 'Налоги'];
  let activeTab = 'Налоги';

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

  const contentContainer = scene.add.container(0, 0);
  container.add(contentContainer);

  async function renderTab() {
    contentContainer.removeAll(true);

    if (activeTab === 'Налоги') {
      try {
        const companies = await ApiService.get('/companies/player');
        const unpaidTaxes = companies
          .flatMap((c) => c.companyRevenues)
          .flatMap((r) => r.tax || [])
          .filter((t) => !t.paid);

        const totalTax = unpaidTaxes.reduce((sum, t) => sum + t.amount, 0);

        if (totalTax === 0) {
          const text = scene.add
            .text(0, 0, 'У вас нет налогов', {
              fontSize: '14px',
              color: '#000',
              fontFamily: 'Arial',
            })
            .setOrigin(0.5);
          contentContainer.add(text);
          return;
        }

        const summary = scene.add
          .text(0, -60, `Сумма налогов: ${totalTax}`, {
            fontSize: '14px',
            color: '#000',
            fontFamily: 'Arial',
          })
          .setOrigin(0.5);
        contentContainer.add(summary);

        const input = scene.add
          .dom(0, 0)
          .createFromHTML(
            '<input type="number" placeholder="Сумма" min="1" style="background-color: white; padding: 4px; width: 150px;">'
          );
        contentContainer.add(input);

        const payBtn = scene.add
          .rectangle(0, 40, 100, 30, 0xee2747)
          .setStrokeStyle(2, 0xaa1111)
          .setInteractive({ useHandCursor: true })
          .setOrigin(0.5);

        const payText = scene.add
          .text(0, 40, 'Погасить', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0.5);

        payBtn.on('pointerdown', async () => {
          const inputEl = input.node.querySelector('input');
          const value = parseInt(inputEl?.value || '');
          if (!value || value <= 0) return toast.error('Введите сумму');

          try {
            const companyId = companies[0].id;
            await ApiService.post(`/companies/pay-tax/${companyId}`, {
              amount: value,
            });
            toast.success('Налог оплачен');
            renderTab();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Ошибка оплаты');
          }
        });

        contentContainer.add(payBtn);
        contentContainer.add(payText);
      } catch (err) {
        toast.error('Ошибка загрузки налогов');
      }
    } else {
      try {
        const types = await ApiService.get('/companies/types');
        let requirements = [];

        const comboBox = scene.add.dom(0, -70).createFromHTML(`
          <select id="company-type-select" style="width:150px; background-color: white; padding: 4px;">
            ${types
              .map((t) => `<option value="${t.id}">${t.typeName}</option>`)
              .join('')}
          </select>
        `);
        contentContainer.add(comboBox);

        const infoText = scene.add
          .text(0, -10, '', {
            fontSize: '14px',
            color: '#000',
            wordWrap: { width: 300 },
            fontFamily: 'Arial',
            align: 'center',
          })
          .setOrigin(0.5);
        contentContainer.add(infoText);

        const nameInput = scene.add
          .dom(0, 60)
          .createFromHTML(
            `<input type="text" placeholder="Название" style="width:150px; background-color: white; padding: 4px;">`
          );
        contentContainer.add(nameInput);

        const createBtnRect = scene.add
          .rectangle(0, 110, 100, 30, 0xee2747)
          .setStrokeStyle(2, 0xaa1111)
          .setInteractive({ useHandCursor: true })
          .setOrigin(0.5);

        const createBtnText = scene.add
          .text(0, 110, 'Открыть', {
            fontSize: '14px',
            color: '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0.5);

        contentContainer.add(createBtnRect);
        contentContainer.add(createBtnText);

        async function updateTypeInfo(typeId) {
          const selected = types.find((t) => t.id == typeId);
          requirements = await ApiService.get(
            `/companies/requirements/${typeId}`
          );
          const resText = requirements
            .map((r) => `Ресурс: ${r.resource.resourceName} — ${r.amount}`)
            .join('\n');
          const expected = await ApiService.get(
            `/companies/expected-income/${typeId}`
          );
          const info = `Стоимость: ${selected.cost}\nДоход: ${expected.expectedIncome}\n${resText}`;
          infoText.setText(info);
        }

        await updateTypeInfo(types[0].id);

        comboBox.node
          .querySelector('select')
          .addEventListener('change', async (e) => {
            const selectedId = parseInt(e.target.value);
            await updateTypeInfo(selectedId);
          });

        createBtnRect.on('pointerdown', async () => {
          const typeId = parseInt(comboBox.node.querySelector('select').value);
          const name = nameInput.node.querySelector('input').value;
          if (!name || !typeId) {
            toast.error('Введите название и выберите тип');
            return;
          }

          try {
            await ApiService.post('/companies/create', {
              companyTypeId: typeId,
              companyName: name,
            });
            toast.success('Предприятие открыто');
            renderTab();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Ошибка при создании');
          }
        });
      } catch (err) {
        toast.error('Ошибка загрузки типов предприятий');
      }
    }
  }

  await renderTab();
  return container;
}
