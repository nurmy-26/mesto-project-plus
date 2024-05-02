import { NextFunction, Response } from 'express';
import { Query } from 'mongoose';
import { constants } from 'http2';
import NotFoundError from '../errors/not-found-err';
import { ERR_MESSAGE } from './constants';

// вернет объект, оставив в нем только нужные поля
const filterItem = (item: any, fields: string[]) => {
  const filteredItem: { [key: string]: any } = {};
  fields.forEach((field) => {
    filteredItem[field] = item[field];
  });
  return filteredItem;
};

// универсальные ф-и для обработки запросов контроллеров
export const sendResponse = (
  res: Response,
  fields: string[],
  status: number = constants.HTTP_STATUS_OK,
) => (data: any) => {
  if (!data) {
    throw new NotFoundError(ERR_MESSAGE.RESOURCE_NOT_FOUND);
  }
  // для хранения отфильтрованных данных
  let responseData: any;

  // если data это массив - регулируем, какие поля будет содержать каждый объект массива
  if (Array.isArray(data)) {
    responseData = data.map((item) => filterItem(item, fields));
  } else {
    responseData = filterItem(data, fields);
  }

  res.status(status).send(responseData);
};

export const catchError = (
  action: Promise<any> | Query<any, any>,
  res: Response,
  next: NextFunction,
  fields: string[],
  status?: number,
) => {
  const answer = sendResponse(res, fields, status);
  const promise = action instanceof Query ? action.exec() : action;

  return promise.then(answer).catch((error) => {
    next(error); // передаем ошибку обработчику ошибок через next
  });
};

// ф-я для получения всех ошибок валидации
export const extractErrorMessages = (error: any) => {
  if (!error || !error.errors) {
    return '';
  }

  const errorMessages = Object.keys(error.errors).map((fieldName) => {
    const { message } = error.errors[fieldName];
    return `<${fieldName}>: ${message}`;
  });
  // возвращаем строку, соединив все сообщения об ошибках через разделитель
  return errorMessages.join('; ');
};
