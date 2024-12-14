const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://k3655692:1WCBuJz8hPlXZCKf@api-2.bqt8pl1.mongodb.net/?retryWrites=true&w=majority&appName=api-2', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
    process.exit(1);
  }
};
//6omntEoYkGThH1nn db_3
//1AgAOMTQ5LjE1NC4xNjcuNTEBu7cHyeHUIdPjfxt8VGcromF+9VG8jnB+WnVqtl4ZT0USfZvXo3vi3IjZslfZo1AzF8KgN1qR8UVxPX6SDMrckJpLJOeS6iEsn+xFsvb+LjdqVYLPIpG47yUZIz2jOhNAkNOhlD63Ct5jMWlE3NqLuLaQUu8u+ClBiwwjdDwL0iSmGOS6ck05wGOnhpVlH88ekTQYYySWQRJL/4Q7Rmkft5RUoGO3at9uhhsfgKPODgjZz/pBE8ScUsEM2PFFJY5RdGy1iTUx2CotOag+dMMTQN+liuHfoGhfClv1aVJtCKGDNx80KBwTgFHggPHnJk/OSAb3ih+BOgtK2JP2+SmaYCs=
module.exports = connectDB;
