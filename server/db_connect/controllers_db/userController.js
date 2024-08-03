const User = require('../models_db/User');
const bcrypt = require('bcrypt');

// Функция для создания нового пользователя
const createUser = async (username, password) => {
  try {
    // Хэширование пароля перед сохранением
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    console.log('Пользователь создан:', user);
    return user;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
};

// Функция для извлечения всех пользователей
const getAllUsers = async () => {
  try {
    const users = await User.find();
    console.log('Пользователи:', users);
    return users;
  } catch (error) {
    console.error('Ошибка при извлечении пользователей:', error);
  }
};

// Функция для авторизации пользователя
const authenticateUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Пользователь не найден');
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('Авторизация успешна');
      return user;
    } else {
      console.log('Неправильный пароль');
      return null;
    }
  } catch (error) {
    console.error('Ошибка при авторизации пользователя:', error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  authenticateUser,
};
