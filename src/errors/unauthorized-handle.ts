import { Request, Response, NextFunction } from 'express';
import UnauthorizedError from './unauthorized-err';
import { ERR_MESSAGE } from '../utils/constants';

const handleUnauthorized = (req: Request, res: Response, next: NextFunction) => {
  const error = new UnauthorizedError(ERR_MESSAGE.UNAUTHORIZED);
  next(error);
};

export default handleUnauthorized;