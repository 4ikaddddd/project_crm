const express = require('express');
const cors = require('cors');
const { authenticate } = require('./auth/auth');
const connectDB = require('./db_connect/db');
const userRoutes = require('./routes/userRoutes');
const parserRoutes = require('./parser/controller_chat_id/parserRoutes');
const { startParsingMessages } = require('./parser_sms/startParser');
const subsRoutes = require('./subs/routes/subsRoutes');
const filterSmsRoutes = require('./filter_sms/routes/filter_smsRoutes');

const app = express();
const port = 5101;

// Middleware для обработки JSON данных
app.use(express.json());

// Используем cors с настройками
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

async function Login() {
    try {
        const sessionString = await authenticate();
        console.log('Сессия сохранена:', sessionString);
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
    }
}

async function init() {
    await Login();
    await connectDB();
    app.use('/api_1', userRoutes);
    app.use('/api_1/parser', parserRoutes);
    app.use('/api_1/subs', subsRoutes);
    app.use('/api_1/filter_sms', filterSmsRoutes);

    // Запуск функции startParsingMessages и установка интервала на каждые 10 минут
    await startParsingMessages();
 

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

init();
