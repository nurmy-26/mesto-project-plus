import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import handleNotFound from './errors/not-found-handle';
import bodyParser from './middlewares/body-parser';
import setUser from './middlewares/set-user';
import errorHandler from './middlewares/error-handler';
import connect from './database/connect';

const { PORT, MONGO_URL = '' } = process.env;
const app = express();
bodyParser(app);

app.use(setUser);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', handleNotFound);

app.use(errorHandler);

connect(app, MONGO_URL, PORT);
