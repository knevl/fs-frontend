import { ApiService } from '../../../services/api';

export async function createCompanyContent(scene) {
  const companyIconMap = {
    'Лавка одежды': 'clothing-store',
    'Пекарня': 'bakery',
    'Автомастерская': 'auto-repair',
    'Фабрика электроники': 'electronics-factory',
    'Ресторан': 'restaurant',
    'Магазин игрушек': 'toy-store',
    'Ферма': 'farm',
    'Салон красоты': 'beauty-salon',
    'IT-компания(стартап)': 'it-startup',
    'Завод по производству машин': 'car-factory',
    'Банк': 'bank',
    'Строительная компания': 'construction-company',
    'Доставка еды': 'food-delivery',
  };

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
  let offsetX = (-companies.length * 130) / 2;

  companies.forEach((company, index) => {
    const card = scene.add.container(offsetX + index * 140, 0);

    const bg = scene.add
      .rectangle(0, 0, 130, 200, 0xffffff)
      .setStrokeStyle(2, 0x989aaf);
    card.add(bg);

    const iconKey = 'icon-' + (companyIconMap[company.companyType.typeName] || 'default');
    const iconImage = scene.add.image(0, -70, iconKey).setDisplaySize(40, 40);
    card.add(iconImage);


    const nameText = scene.add
      .text(0, -40, company.companyName, {
        fontSize: '14px',
        color: '#000',
        fontFamily: 'Arial',
        align: 'center',
        wordWrap: { width: 120 },
      })
      .setOrigin(0.5);
    card.add(nameText);

    const levelText = scene.add
      .text(0, -20, `Уровень: ${company.level}`, {
        fontSize: '12px',
        color: '#333',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
    card.add(levelText);

    const income = Math.floor(
      company.companyType.baseIncome * company.incomeCoEfficient * 100
    );
    const incomeText = scene.add
      .text(0, 0, `Доход: ${income}`, {
        fontSize: '12px',
        color: '#333',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
    card.add(incomeText);

    const repairBtn = scene.add
      .text(0, 30, company.isBroken ? 'Починить' : 'Поломок нет', {
        fontSize: '14px',
        color: company.isBroken ? '#007700' : '#888888',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

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

    const upgradeBtn = scene.add
      .text(0, 60, 'Улучшить', {
        fontSize: '14px',
        color: '#48E670',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    upgradeBtn.on('pointerdown', async () => {
      try {
        await ApiService.put(`/companies/upgrade/${company.id}`);
        const info = await ApiService.get(`/companies/${company.id}`);
        if (info.level <= 3) {
          company.level = info.level;
          company.incomeCoEfficient = info.incomeCoEfficient;
          levelText.setText(`Уровень: ${company.level}`);
          const income = Math.floor(
            company.companyType.baseIncome * company.incomeCoEfficient * 100
          );
          incomeText.setText(`Доход: ${income}`);
          if (company.level >= 3) {
            //upgradeBtn.setVisible(false);
            upgradeBtn.destroy();
          }
        }
      } catch {
        console.error('Ошибка при улучшении');
      }
    });
    if (company.level < 3) {
      card.add(upgradeBtn);
    }

    const sellBtn = scene.add
      .text(0, 80, 'Продать', {
        fontSize: '14px',
        color: '#EE2747',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

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

  const scrollSpeed = 40;
  const maxOffset = companies.length * 140 - 300;

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
    scrollContainer.x = Math.max(scrollContainer.x - scrollSpeed, -maxOffset);
  });

  container.add(leftArrow);
  container.add(rightArrow);

  return container;
}
