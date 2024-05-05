import { Express } from 'express';
import mongoose from 'mongoose';

const connect = async (app: Express, url: string, port?: string | number) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(url);
  await app.listen(port);
  // eslint-disable-next-line
  // console.log(`Сервер запущен и слушает на порту ${port}...`);
};

export default connect;
