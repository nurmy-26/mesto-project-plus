import { Request } from 'express';
import { constants } from 'http2';

export interface CustomRequest extends Request {
  user?: { _id: string };
}

export class CustomError extends Error {
  statusCode: number;
  code?: number;
  errors?: any;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
