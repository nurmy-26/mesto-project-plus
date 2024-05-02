import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import NotFoundError from './errors/not-found-err';
import IncorrectDataError from './errors/incorrect-data-err';
import { CustomRequest, CustomError } from './utils/types';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// временный мидлвар:
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66327c443a4a8a6ee8ac27c4',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
  let errorResponse = err;

  if (err.name === 'CastError') {
    errorResponse = new NotFoundError('Запрашиваемый ресурс не найден');
  } else if (err.name === 'ValidationError') {
    errorResponse = new IncorrectDataError('Переданы некорректные данные');
  }

  const statusCode = errorResponse.statusCode || 500;
  const isServerError = statusCode === 500;
  // проверяем статус и выставляем сообщение в зависимости от него
  res
    .status(statusCode)
    .send({
      message: isServerError
        ? 'На сервере произошла ошибка'
        : `${errorResponse.message}: ${req.method} ${req.originalUrl}`,
    });
  next();
});

const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1/mestodb');
  await app.listen(PORT);
  // console.log(`Сервер запущен и слушает на порту ${PORT}...`);
};

connect();
