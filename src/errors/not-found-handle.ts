import { Request, Response, NextFunction } from 'express';
import NotFoundError from './not-found-err';
import { ERR_MESSAGE } from '../utils/constants';

const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(ERR_MESSAGE.RESOURCE_NOT_FOUND);
  next(error);
};

export default handleNotFound;
