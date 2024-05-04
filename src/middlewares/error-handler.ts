import { Response, NextFunction } from 'express';
import { constants } from 'http2';
import IncorrectDataError from '../errors/incorrect-data-err';
import { ERR_MESSAGE } from '../utils/constants';
import { extractErrorMessages } from '../utils/helpers';
import { CustomError, CustomRequest } from '../utils/types';
import ConflictError from '../errors/conflict-err';

const errorHandler = (err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
  let errorResponse = err;

  if (err.name === 'CastError') {
    errorResponse = new IncorrectDataError(ERR_MESSAGE.INVALID_DATA);
  } else if (err.name === 'ValidationError') {
    errorResponse = new IncorrectDataError(`${ERR_MESSAGE.INVALID_DATA}: ${extractErrorMessages(err)}`);
  } else if (err.code === 11000) {
    errorResponse = new ConflictError(ERR_MESSAGE.NAME_CONFLICT);
  }

  const statusCode = errorResponse.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const isServerError = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  // проверяем статус и выставляем сообщение в зависимости от него
  res
    .status(statusCode)
    .send({
      message: isServerError
        ? ERR_MESSAGE.SERVER_ERROR
        : errorResponse.message,
    });
  next();
};

export default errorHandler;
