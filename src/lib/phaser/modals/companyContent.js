export function createCompanyContent(scene) {
  const container = scene.add.container(0, 0);
  const text = scene.add.text(0, 0, 'Предприятие: доход', {
    fontSize: '16px',
    color: '#333',
    align: 'center',
    fontFamily: 'Arial',
    wordWrap: { width: 350 },
  });
  text.setOrigin(0.5);
  container.add(text);
  return container;
}
