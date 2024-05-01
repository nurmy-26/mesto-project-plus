import express from 'express';

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  // console.log(`Сервер запущен и слушает на порту ${PORT}...`);
});
