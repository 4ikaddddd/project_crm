const express = require('express');
const router = express.Router();
const Keyword = require('../models/keywordModel'); // Подключаем модель Keyword
const Message = require('../../parser_sms/models/Message'); // Путь до вашей модели сообщений

// Маршрут для получения всех ключевых слов
router.get('/keywords', async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении ключевых слов', error: error.message });
  }
});

// Маршрут для получения сообщений с фильтрацией по ключевым словам
router.get('/messages', async (req, res) => {
  try {
    const { chatId, startDate, endDate } = req.query;

    // Получаем все ключевые слова
    const keywords = await Keyword.find();
    const keywordRegex = keywords.map(kw => kw.keyword).join('|'); // Создаем регулярное выражение из ключевых слов

    const filter = {};
    if (chatId) filter.chatId = chatId;
    if (startDate) filter.timestamp = { ...filter.timestamp, $gte: new Date(startDate) };
    if (endDate) filter.timestamp = { ...filter.timestamp, $lte: new Date(endDate) };
    if (keywordRegex) filter.text = { $regex: keywordRegex, $options: 'i' }; // Фильтр по ключевым словам

    const messages = await Message.find(filter)
                                  .sort({ timestamp: -1 })
                                  .allowDiskUse(true); // Разрешаем использование диска для сортировки

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/keywords', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ message: 'Ключевое слово не должно быть пустым' });
    }
    const newKeyword = new Keyword({ keyword });
    await newKeyword.save();
    res.json(newKeyword);
  } catch (error) {
    console.error('Ошибка при добавлении ключевого слова:', error);
    res.status(500).json({ message: 'Ошибка при добавлении ключевого слова', error: error.message });
  }
});

// Маршрут для удаления ключевого слова
router.delete('/keywords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Keyword.findByIdAndDelete(id);
    res.json({ message: 'Ключевое слово успешно удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении ключевого слова', error: error.message });
  }
});

module.exports = router;
