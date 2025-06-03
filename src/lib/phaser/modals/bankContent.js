import { ApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export async function createBankContent(scene, sessionDuration = 20) {
  const container = scene.add.container(0, 0);
  const tabTitles = ['Вклады', 'Кредит'];
  let activeTab = 'Вклады';
  const tabs = scene.add.container(0, -170);

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

  const percentage = sessionDuration === 36 ? 15 : 20;

  async function renderTab() {
    contentContainer.removeAll(true);

    if (activeTab === 'Вклады') {
      try {
        const deposits = await ApiService.get('/deposit/player');
        console.log('Получены вклады:', deposits);

        const scrollContainer = scene.add.container(0, 0);
        scrollContainer.setPosition(0, 0);

        // Маска
        const maskShape = scene.make.graphics({});
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(-150, -100, 300, 200); 

        const mask = maskShape.createGeometryMask();
        //scrollContainer.setMask(mask);

        maskShape.setScrollFactor(0);
        contentContainer.add(maskShape);
        contentContainer.add(scrollContainer);


        let offsetY = -90;
        deposits.forEach((deposit) => {
          const card = scene.add.container(0, offsetY);
          const bg = scene.add.rectangle(0, 0, 300, 70, 0xf0f0f0).setStrokeStyle(2, 0x999999);
          const text = scene.add.text(-130, -20, `Сумма: ${deposit.amount}\nСрок: ${deposit.period} месяцев\n%: ${deposit.percentage}`, {
            fontSize: '12px', color: '#000', fontFamily: 'Arial'
          });
          const action = deposit.datePayout ? 'Закрыт' : 'Закрыть';
          const actionText = scene.add.text(100, 0, action, {
            fontSize: '12px', color: deposit.datePayout ? '#888' : '#0077aa', fontFamily: 'Arial'
          }).setOrigin(0.5);

          if (!deposit.datePayout) {
            actionText.setInteractive({ useHandCursor: true });
            actionText.on('pointerdown', async () => {
              try {
                await ApiService.post(`/deposit/close/${deposit.id}`);
                toast.success('Вклад закрыт');
                renderTab();
              } catch (err) {
                  const message = err?.response?.data?.message || err?.message || 'Не удалось закрыть вклад';
                  toast.error(message);
                }
            });
          }

          card.add([bg, text, actionText]);
          scrollContainer.add(card);
          offsetY += 90;
        });

        const upArrow = scene.add.text(140, -110, '▲', { fontSize: '20px', color: '#000' }).setInteractive();
        const downArrow = scene.add.text(140, 110, '▼', { fontSize: '20px', color: '#000' }).setInteractive();

        upArrow.on('pointerdown', () => {
          scrollContainer.y = Math.min(scrollContainer.y + 20, 0);
        });
        downArrow.on('pointerdown', () => {
          scrollContainer.y -= 20;
        });

        contentContainer.add(scrollContainer);
        contentContainer.add(upArrow);
        contentContainer.add(downArrow);

        const openBtn = scene.add.text(0, 140, 'Открыть вклад', {
          fontSize: '14px', color: '#0077aa', fontFamily: 'Arial'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        openBtn.on('pointerdown', () => renderDepositForm());
        contentContainer.add(openBtn);
      } catch (err) {
        toast.error('Ошибка при загрузке вкладов');
      }
    } else {
      try {
        const loan = await ApiService.get('/loan/player');

        if (loan) {
          const card = scene.add.container(0, 0);
          const bg = scene.add.rectangle(0, 0, 300, 70, 0xf0f0f0).setStrokeStyle(2, 0x999999);
          const text = scene.add.text(-120, -20, `Сумма: ${loan.amount}\nСрок: ${loan.period} мес.\n%: ${loan.interestRate}\nШтраф: ${loan.fine}`, {
            fontSize: '12px', color: '#000', fontFamily: 'Arial'
          });
          const repayBtn = scene.add.text(100, 0, 'Погасить', {
            fontSize: '12px', color: '#0077aa', fontFamily: 'Arial'
          }).setOrigin(0.5).setInteractive({ useHandCursor: true });

          repayBtn.on('pointerdown', async () => {
            try {
              await ApiService.post('/loan/repay');
              toast.success('Кредит погашен');
              renderTab();
            } catch (err) {
              toast.error(err.response?.data?.message || 'Ошибка погашения');
            }
          });

          card.add([bg, text, repayBtn]);
          contentContainer.add(card);
        } else {
          const noLoan = scene.add.text(0, -40, 'У вас нет кредитов', {
            fontSize: '14px', color: '#000', fontFamily: 'Arial'
          }).setOrigin(0.5);

          const takeLoanBtn = scene.add.text(0, 40, 'Взять кредит', {
            fontSize: '14px', color: '#0077aa', fontFamily: 'Arial'
          }).setOrigin(0.5).setInteractive({ useHandCursor: true });

          takeLoanBtn.on('pointerdown', () => renderLoanForm());

          contentContainer.add(noLoan);
          contentContainer.add(takeLoanBtn);
        }
      } catch (err) {
        toast.error('Ошибка при загрузке кредита');
      }
    }
  }

  function renderDepositForm() {
    contentContainer.removeAll(true);

    const formEl = document.createElement('form');
    formEl.innerHTML = `
      <input type="number" name="amount" placeholder="Сумма" style="margin-bottom:10px"><br>
      <input type="number" name="period" placeholder="Срок (мес)" style="margin-bottom:10px"><br>
      <button type="submit">Подтвердить</button>
    `;

    const form = scene.add.dom(0, 0, formEl);
    form.addListener('submit');
    form.on('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(formEl);
      const amount = parseInt(formData.get('amount'));
      const period = parseInt(formData.get('period'));
      if (!amount || !period) return toast.error('Введите сумму и срок');

      try {
        await ApiService.post('/deposit/create', { amount, period, percentage });
        toast.success('Вклад открыт');
        renderTab();
      } catch (err) {
          const message = err?.response?.data?.message || err?.message || 'Ошибка при создании';
          toast.error(message);
      }
    });

    contentContainer.add(form);
  }

  function renderLoanForm() {
    contentContainer.removeAll(true);

    const formEl = document.createElement('form');
    formEl.innerHTML = `
      <input type="number" name="amount" placeholder="Сумма" style="margin-bottom:10px"><br>
      <input type="number" name="period" placeholder="Срок (мес)" style="margin-bottom:10px"><br>
      <button type="submit">Подтвердить</button>
    `;

    const form = scene.add.dom(0, 0, formEl);
    form.addListener('submit');
    form.on('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(formEl);
      const amount = parseInt(formData.get('amount'));
      const period = parseInt(formData.get('period'));
      if (!amount || !period) return toast.error('Введите сумму и срок');

      try {
        await ApiService.post('/loan/take', { amount, period, interestRate: percentage });
        toast.success('Кредит выдан');
        renderTab();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Ошибка при оформлении кредита');
      }
    });

    contentContainer.add(form);
  }

  await renderTab();
  return container;
}
