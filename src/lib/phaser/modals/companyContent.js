import { ApiService } from '../../../services/api';

export async function createCompanyContent(scene) {
  const container = scene.add.container(0, 0);
  const title = scene.add.text(0, -130, 'Мои предприятия:', {
    fontSize: '16px',
    color: '#333',
    fontFamily: 'Arial',
    wordWrap: { width: 350 },
  });
  title.setOrigin(0.5);
  container.add(title);

  let companies = [];
  try {
    const response = await ApiService.get('/companies/player');
    companies = response;
  } catch (err) {
    const errorText = scene.add.text(0, 0, 'Ошибка загрузки предприятий', {
      fontSize: '16px',
      color: '#aa0000',
      fontFamily: 'Arial',
    });
    errorText.setOrigin(0.5);
    container.add(errorText);
    return container;
  }
  
  if (companies.length == 0) {
    const errorText = scene.add.text(0, 0, 'У вас нет предприятий', {
      fontSize: '16px',
      color: '#333',
      fontFamily: 'Arial',
    });
    errorText.setOrigin(0.5);
    container.add(errorText);
    return container;
  }
  
  const scrollContainer = scene.add.container(0, 0);
  let offsetX = -companies.length * 130 / 2;

  companies.forEach((company, index) => {
    const card = scene.add.container(offsetX + index * 140, 0);

    const bg = scene.add.rectangle(0, 0, 130, 200, 0xf0f0f0)
      .setStrokeStyle(2, 0x999999);
    card.add(bg);

    const icon = scene.add.circle(0, -70, 20, 0xcccccc);
    card.add(icon);

    const nameText = scene.add.text(0, -45, company.companyName, {
      fontSize: '14px',
      color: '#000',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 120 },
    }).setOrigin(0.5);
    card.add(nameText);

    const levelText = scene.add.text(0, -20, `Уровень: ${company.level}`, {
      fontSize: '12px',
      color: '#333',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    card.add(levelText);

    const income = Math.floor(company.companyType.baseIncome * company.incomeCoEfficient * 100);
    const incomeText = scene.add.text(0, 0, `Доход: ${income}`, {
      fontSize: '12px',
      color: '#333',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    card.add(incomeText);

    const repairBtn = scene.add.text(0, 30, 'Починить', {
      fontSize: '12px',
      color: company.isBroken ? '#007700' : '#888888',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    if (!company.isBroken) {
      repairBtn.disableInteractive();
    } else {
      repairBtn.on('pointerdown', async () => {
        try {
          await ApiService.put(`/companies/repair/${company.id}`);
          repairBtn.setColor('#888888');
          repairBtn.disableInteractive();
        } catch {
          console.error('Ошибка при починке');
        }
      });
    }
    card.add(repairBtn);

    const upgradeBtn = scene.add.text(0, 50, 'Улучшить', {
      fontSize: '12px',
      color: '#0077aa',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    upgradeBtn.on('pointerdown', async () => {
      try {
        await ApiService.put(`/companies/upgrade/${company.id}`);
        const info = await ApiService.get(`/companies/${company.id}`);
        if (info.level <= 3) {
          company.level = info.level;
          company.incomeCoEfficient = info.incomeCoEfficient;
          levelText.setText(`Уровень: ${company.level}`);
          const income = Math.floor(company.companyType.baseIncome * company.incomeCoEfficient * 100);
          incomeText.setText(`Доход: ${income}`);
          if (company.level >= 3) {
            upgradeBtn.setVisible(false);
          }
        }
      } catch {
        console.error('Ошибка при улучшении');
      }
    });
    if (company.level < 3) {
      card.add(upgradeBtn);
    }

    const sellBtn = scene.add.text(0, 70, 'Продать', {
      fontSize: '12px',
      color: '#aa5500',
      fontFamily: 'Arial',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    sellBtn.on('pointerdown', async () => {
      try {
        await ApiService.post(`/companies/sell/${company.id}`);
        card.setVisible(false);
      } catch {
        console.error('Ошибка при продаже');
      }
    });
    card.add(sellBtn);

    scrollContainer.add(card);
  });

  scrollContainer.setY(20);
  container.add(scrollContainer);

  // Стрелки прокрутки
  const scrollSpeed = 40;
  const maxOffset = companies.length * 140 - 300;

  const leftArrow = scene.add.text(-200, 10, '<', {
    fontSize: '32px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

  const rightArrow = scene.add.text(180, 10, '>', {
    fontSize: '32px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

  leftArrow.on('pointerdown', () => {
    scrollContainer.x = Math.min(scrollContainer.x + scrollSpeed, 0);
  });

  rightArrow.on('pointerdown', () => {
    scrollContainer.x = Math.max(scrollContainer.x - scrollSpeed, -maxOffset);
  });

  container.add(leftArrow);
  container.add(rightArrow);

  return container;
}
