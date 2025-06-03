import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createTaxContent(scene) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Предприятия', 'Налоги'];
  let activeTab = 'Налоги';

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

    if (activeTab === 'Налоги') {
      try {
        const companies = await ApiService.get('/companies/player');
        const unpaidTaxes = companies.flatMap(c => c.companyRevenues)
          .flatMap(r => r.tax || [])
          .filter(t => !t.paid);

        const totalTax = unpaidTaxes.reduce((sum, t) => sum + t.amount, 0);

        if (totalTax === 0) {
          const text = scene.add.text(0, 0, 'У вас нет налогов', {
            fontSize: '14px', color: '#000', fontFamily: 'Arial'
          }).setOrigin(0.5);
          contentContainer.add(text);
          return;
        }

        const summary = scene.add.text(0, -60, `Сумма налогов: ${totalTax}`, {
          fontSize: '14px', color: '#000', fontFamily: 'Arial'
        }).setOrigin(0.5);
        contentContainer.add(summary);

        const input = scene.add.dom(0, 0).createFromHTML('<input type="number" placeholder="Сумма" min="1">');
        contentContainer.add(input);

        const payBtn = scene.add.text(0, 40, 'Погасить', {
          fontSize: '14px', color: '#0077aa', fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        contentContainer.add(payBtn);

        payBtn.on('pointerdown', async () => {
          const inputEl = input.node.querySelector('input'); 
          const value = parseInt(inputEl?.value || '');
          console.log(value);
          if (!value || value <= 0) return toast.error('Введите сумму');

          try {
            const companyId = companies[0].id;
            await ApiService.post(`/companies/pay-tax/${companyId}`, { amount: value });
            toast.success('Налог оплачен');
            renderTab();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Ошибка оплаты');
          }
        });
      } catch (err) {
        toast.error('Ошибка загрузки налогов');
      }
    } else {
      try {
        const types = await ApiService.get('/companies/types');
        let requirements = [];
        const comboBox = scene.add.dom(0, -100).createFromHTML(`
          <select id="company-type-select" style="width:150px;">
            ${types.map(t => `<option value="${t.id}">${t.typeName}</option>`).join('')}
          </select>
        `);
        contentContainer.add(comboBox);

        const infoText = scene.add.text(0, -40, '', {
          fontSize: '12px',
          color: '#000',
          wordWrap: { width: 300 },
          fontFamily: 'Arial',
          align: 'center'
        }).setOrigin(0.5);
        contentContainer.add(infoText);

        const nameInput = scene.add.dom(0, 30).createFromHTML(
          `<input type="text" placeholder="Название" style="width:150px;">`
        );
        contentContainer.add(nameInput);

        const createBtn = scene.add.text(0, 70, 'Открыть', {
          fontSize: '14px',
          color: '#0077aa',
          fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        contentContainer.add(createBtn);

        async function updateTypeInfo(typeId) {
          const selected = types.find(t => t.id == typeId);
          requirements = await ApiService.get(`/companies/requirements/${typeId}`);
          const resText = requirements.map(r => `Ресурс: ${r.resource.resourceName} — ${r.amount}`).join('\n');
          const expected = await ApiService.get(`/companies/expected-income/${typeId}`);
          const info = `Стоимость: ${selected.cost}\nДоход: ${expected.expectedIncome}\n${resText}`;
          infoText.setText(info);
        }

        await updateTypeInfo(types[0].id);

        comboBox.node.querySelector('select').addEventListener('change', async (e) => {
          const selectedId = parseInt(e.target.value);
          await updateTypeInfo(selectedId);
        });

        createBtn.on('pointerdown', async () => {
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
