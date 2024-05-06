import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { celebrate, errors } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import bodyParser from './middlewares/body-parser';
import auth from './middlewares/auth';
import errorHandler from './middlewares/error-handler';
import handleNotFound from './errors/not-found-handle';
import { ENV_EXAMPLE } from './utils/constants';
import { signupSchema, loginSchema } from './utils/joi-validations';
import connect from './database/connect';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';

const { PORT = ENV_EXAMPLE.PORT, MONGO_URL = ENV_EXAMPLE.MONGO_URL } = process.env;
const app = express();
bodyParser(app);
// app.use(cookieParser());

app.use(requestLogger); // логер запросов

app.post('/signup', celebrate({ body: signupSchema }), createUser);
app.post('/signin', celebrate({ body: loginSchema }), login);

app.use(auth); // все роуты ниже защищены авторизацией (требуют заголовка Authorization с токеном)

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', handleNotFound);

app.use(errorLogger); // логер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизованный обработчик ошибок

connect(app, MONGO_URL, PORT);
