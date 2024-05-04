import 'dotenv/config';
import express from 'express';
import { celebrate, errors } from 'celebrate';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import handleNotFound from './errors/not-found-handle';
import bodyParser from './middlewares/body-parser';
import auth from './middlewares/auth';
import errorHandler from './middlewares/error-handler';
import connect from './database/connect';
import { fullUserSchema, loginSchema } from './models/joi-validations';
import { createUser, login } from './controllers/users';

const { PORT, MONGO_URL = '' } = process.env;
const app = express();
bodyParser(app);

app.post('/signup', celebrate({ body: fullUserSchema }), createUser);
app.post('/signin', celebrate({ body: loginSchema }), login);

app.use(auth); // все роуты ниже защищены авторизацией (требуют заголовка Authorization с токеном)

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', handleNotFound);

app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок

connect(app, MONGO_URL, PORT);
