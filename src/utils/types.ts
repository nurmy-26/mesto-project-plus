import { Request } from 'express';

// не забыть удалить везде CustomRequest и хардкод после реализации авторизации
export interface CustomRequest extends Request {
  user?: { _id: string };
}

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}
