import { NextFunction, Response } from 'express';
import { Query } from 'mongoose';
import NotFoundError from '../errors/not-found-err';

// универсальные ф-и для обработки запросов контроллеров
export const sendResponse = (res: Response) => (data: any) => {
  if (!data) {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  }
  res.send(data);
};

export const catchError = (
  action: Promise<any> | Query<any, any>,
  res: Response,
  next: NextFunction,
) => {
  const answer = sendResponse(res);
  const promise = action instanceof Query ? action.exec() : action;

  return promise.then(answer).catch((error) => {
    next(error); // передаем ошибку обработчику ошибок через next
  });
};
