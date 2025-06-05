import { ApiService } from '../../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export async function createNewsContent(scene) {
  const container = scene.add.container(0, 0);

  const title = scene.add.text(0, -200, 'Новости: последние события', {
    fontSize: '16px',
    color: '#333',
    align: 'center',
    fontFamily: 'Arial',
    wordWrap: { width: 350 },
  });
  title.setOrigin(0.5);
  container.add(title);

  const sessionId = scene.sessionId;

  let newsList = [];
  try {
    newsList = await ApiService.get(`/news/visible/${sessionId}`);
  } catch (e) {
    const errText = scene.add
      .text(0, 0, 'Ошибка загрузки новостей', {
        fontSize: '14px',
        color: '#aa0000',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
    container.add(errText);
    return container;
  }

  if (newsList.length === 0) {
    const noNewsText = scene.add
      .text(0, 0, 'Новостей нет', {
        fontSize: '14px',
        color: '#333',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
    container.add(noNewsText);
    return container;
  }

  const scrollContainer = scene.add.container(0, -100);

  let offsetY = 0;
  newsList.forEach((newsItem) => {
    const date = new Date(newsItem.dateCreated);
    const timeAgo = formatDistanceToNow(date, {
      addSuffix: true,
      locale: ru,
    });

    // блок под новость
    const blockContainer = scene.add.container(0, offsetY);

    // Фон новости
    const background = scene.add
      .rectangle(0, 0, 320, 100, 0xffffff)
      .setOrigin(0.5, 0)
      .setStrokeStyle(1, 0x989aaf); // рамка

    // Текст новости
    const newsText = scene.add
      .text(0, 5, newsItem.news.description, {
        fontSize: '14px',
        color: '#000',
        wordWrap: { width: 280 },
        fontFamily: 'Arial',
        align: 'center',
      })
      .setOrigin(0.5, 0);

    // Текст времени
    const timeText = scene.add
      .text(0, newsText.height + 10, timeAgo, {
        fontSize: '12px',
        color: '#666',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5, 0);

    const blockHeight = newsText.height + timeText.height + 70;
    background.height = blockHeight;

    blockContainer.add([background, newsText, timeText]);
    scrollContainer.add(blockContainer);

    offsetY += blockHeight + 10;
  });

  container.add(scrollContainer);

  const scrollSpeed = 20;

  const upArrow = scene.add
    .image(180, -150, 'arrow-up')
    .setInteractive({ useHandCursor: true })
    .setScale(1)
    .setOrigin(1);

  const downArrow = scene.add
    .image(180, 200, 'arrow-down')
    .setInteractive({ useHandCursor: true })
    .setScale(1)
    .setOrigin(1);

  upArrow.on('pointerdown', () => {
    scrollContainer.y = Math.min(scrollContainer.y + scrollSpeed, 0);
  });

  downArrow.on('pointerdown', () => {
    scrollContainer.y -= scrollSpeed;
  });

  container.add(upArrow);
  container.add(downArrow);

  return container;
}
