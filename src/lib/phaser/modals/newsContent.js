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
    const errText = scene.add.text(0, 0, 'Ошибка загрузки новостей', {
      fontSize: '14px',
      color: '#aa0000',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    container.add(errText);
    return container;
  }

  if (newsList.length === 0) {
    const noNewsText = scene.add.text(0, 0, 'Новостей нет', {
      fontSize: '14px',
      color: '#333',
      fontFamily: 'Arial',
    }).setOrigin(0.5);
    container.add(noNewsText);
    return container;
  }

  // Контейнер для скролла
  const scrollContainer = scene.add.container(0, 0);
  const maskShape = scene.make.graphics({});
  maskShape.fillStyle(0xffffff);
  maskShape.fillRect(-180, -100, 360, 200);
  const mask = maskShape.createGeometryMask();
  //scrollContainer.setMask(mask);
  container.add(maskShape);

  let offsetY = -90;
  newsList.forEach((newsItem) => {
    const date = new Date(newsItem.dateCreated);
    const timeAgo = formatDistanceToNow(date, {
      addSuffix: true,
      locale: ru,
    });
    const newsText = scene.add.text(-160, offsetY, `• ${newsItem.news.description}`, {
      fontSize: '14px',
      color: '#000',
      wordWrap: { width: 250 },
      fontFamily: 'Arial',
    });

    const timeText = scene.add.text(130, offsetY, timeAgo, {
      fontSize: '12px',
      color: '#666',
      align: 'right',
      fontFamily: 'Arial',
    }).setOrigin(1, 0);

    console.log('Новости с сервера:', timeText);
    scrollContainer.add(newsText);
    scrollContainer.add(timeText);

    offsetY += newsText.height + 20;
  });

  container.add(scrollContainer);

  const scrollSpeed = 20;

  const upArrow = scene.add.text(160, -110, '▲', {
    fontSize: '20px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

  const downArrow = scene.add.text(160, 100, '▼', {
    fontSize: '20px',
    color: '#000',
  }).setInteractive({ useHandCursor: true });

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
