import { NextFunction, Response } from 'express';
import { Query } from 'mongoose';
import NotFoundError from '../errors/not-found-err';

// вернет объект, оставив в нем только нужные поля
const filterItem = (item: any, fields: string[]) => {
  const filteredItem: { [key: string]: any } = {};
  fields.forEach((field) => {
    filteredItem[field] = item[field];
  });
  return filteredItem;
};

// универсальные ф-и для обработки запросов контроллеров
export const sendResponse = (res: Response, fields: string[]) => (data: any) => {
  if (!data) {
    throw new NotFoundError('Запрашиваемый ресурс не найден');
  }
  // для хранения отфильтрованных данных
  let responseData: any;

  // если data это массив - регулируем, какие поля будет содержать каждый объект массива
  if (Array.isArray(data)) {
    responseData = data.map((item) => filterItem(item, fields));
  } else {
    responseData = filterItem(data, fields);
  }

  res.send(responseData);
};

export const catchError = (
  action: Promise<any> | Query<any, any>,
  res: Response,
  next: NextFunction,
  fields: string[],
) => {
  const answer = sendResponse(res, fields);
  const promise = action instanceof Query ? action.exec() : action;

  return promise.then(answer).catch((error) => {
    next(error); // передаем ошибку обработчику ошибок через next
  });
};
