const express = require('express');
const { createUser, getAllUsers, authenticateUser } = require('../db_connect/controllers_db/userController');

const router = express.Router();

// Маршрут для создания нового пользователя
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await createUser(username, password);
  res.json(user);
});

// Маршрут для получения всех пользователей
router.get('/users', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

// Маршрут для авторизации пользователя
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticateUser(username, password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: 'Неправильное имя пользователя или пароль' });
  }
});

module.exports = router;
