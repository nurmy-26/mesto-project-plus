import { Request } from 'express';
import { constants } from 'http2';

// не забыть удалить везде CustomRequest и хардкод после реализации авторизации
export interface CustomRequest extends Request {
  user?: { _id: string };
}

export class CustomError extends Error {
  statusCode: number;

  errors?: any;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
