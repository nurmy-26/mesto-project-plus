import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

// не забыть удалить везде CustomRequest и хардкод после реализации авторизации
export interface CustomRequest extends Request {
  user?: { _id: string };
}

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1/mestodb');

// временный мидлвар:
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66327c443a4a8a6ee8ac27c4',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Сервер запущен и слушает на порту ${PORT}...`);
});
