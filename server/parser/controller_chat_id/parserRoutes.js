const express = require('express');
const router = express.Router();
const { parseChannel } = require('../channelParser');
const { parseChat } = require('../chatParser');
const mongoose = require('mongoose');
const { Channel } = require('./channelController');
const { Chat } = require('./chatController'); // Подключаем модель Chat

router.post('/channel', async (req, res) => {
  try {
    const { urlOrUsername, isPrivate = false } = req.body;
    const channel = await parseChannel(urlOrUsername, isPrivate);
    res.json(channel);
  } catch (error) {
    console.error('Ошибка при парсинге канала:', error.message);
    res.status(500).json({ message: 'Ошибка при парсинге канала', error: error.message });
  }
});

router.get('/chats', async (req, res) => { // Новый маршрут для получения списка чатов
    try {
      console.log('Starting request to fetch chats from database...');
      console.log('Fetching chats from database...');
  
      const isConnected = mongoose.connection.readyState;
      console.log(`Database connection status: ${isConnected}`);
  
      const chats = await Chat.find();
      console.log('Chats fetched successfully:', chats);
  
      if (!chats || chats.length === 0) {
        console.log('No chats found in the database.');
      } else {
        console.log(`Number of chats found: ${chats.length}`);
      }
  
      res.json(chats);
    } catch (error) {
      console.error('Error occurred while fetching chats:', error.message);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ message: 'Ошибка при получении списка чатов', error: error.message });
    }
  });

  router.delete('/chat/:id', async (req, res) => { // Новый маршрут для удаления чата
    try {
      const { id } = req.params;
      await Chat.findByIdAndDelete(id);
      res.json({ message: 'Чат успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении чата:', error.message);
      res.status(500).json({ message: 'Ошибка при удалении чата', error: error.message });
    }
  });

  router.post('/chat', async (req, res) => {
    try {
      const { urlOrUsername } = req.body;
      console.log(`Received request to parse chat: ${urlOrUsername}`);
      const chat = await parseChat(urlOrUsername);
      res.json(chat);
    } catch (error) {
      console.error('Ошибка при парсинге чата:', error.message);
      if (error.message.includes('USERNAME_INVALID')) {
        res.status(400).json({ message: 'Некорректный URL или имя пользователя', error: error.message });
      } else {
        res.status(500).json({ message: 'Ошибка при парсинге чата', error: error.message });
      }
    }
  });

router.get('/channels', async (req, res) => { // Изменил '/channel' на '/channels'
    try {
      console.log('Starting request to fetch channels from database...');
      console.log('Fetching channels from database...');
  
      // Проверка подключения к базе данных
      const isConnected = mongoose.connection.readyState;
      console.log(`Database connection status: ${isConnected}`);
  
      // Получение списка каналов
      const channels = await Channel.find();
      
      console.log('Channels fetched successfully:', channels);
  
      // Проверка содержимого channels
      if (!channels || channels.length === 0) {
        console.log('No channels found in the database.');
      } else {
        console.log(`Number of channels found: ${channels.length}`);
      }
  
      res.json(channels);
    } catch (error) {
      console.error('Error occurred while fetching channels:', error.message);
  
      // Дополнительный лог ошибки
      console.error('Stack trace:', error.stack);
  
      res.status(500).json({ message: 'Ошибка при получении списка каналов', error: error.message });
    }
  });

  // Маршрут для удаления канала
router.delete('/channel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Channel.findByIdAndDelete(id);
      res.json({ message: 'Канал успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении канала:', error.message);
      res.status(500).json({ message: 'Ошибка при удалении канала', error: error.message });
    }
  });

module.exports = router;
