const express = require('express');
const router = express.Router();
const Link = require('../models/linkModel');

// GET запрос для получения всех ссылок
router.get('/links', async (req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST запрос для добавления новой ссылки
router.post('/links', async (req, res) => {
  const link = new Link({
    url: req.body.url
  });

  try {
    const newLink = await link.save();
    res.status(201).json(newLink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
