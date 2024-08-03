const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input'); // библиотека для получения ввода из консоли
const { apiId, apiHash, sessionString: initialSessionString } = require('./login');

let sessionString = initialSessionString;
const stringSession = new StringSession(sessionString);

const authenticate = async () => {
  console.log('Загрузка...');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  if (!sessionString) {
    // Если нет сохраненной сессии, начнем процесс аутентификации
    await client.start({
      phoneNumber: async () => await input.text('Введите ваш номер телефона: '),
      password: async () => await input.text('Введите ваш пароль (если установлен): '),
      phoneCode: async () => await input.text('Введите код из Telegram: '),
      onError: (err) => console.log(err),
    });

    console.log('Успешная авторизация!');
    sessionString = client.session.save();
    console.log('Сессионный ключ:', sessionString);
  } else {
    // Если сессионный ключ уже существует, используем его для входа
    await client.connect();
    console.log('Успешно вошли в систему с использованием сохраненного сессионного ключа.');
  }

  // Пример отправки сообщения самому себе
  await client.sendMessage('me', { message: 'Привет от нового клиента Telegram!' });

  return sessionString;
};

module.exports = {
  client: new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 }),
  authenticate,
};
