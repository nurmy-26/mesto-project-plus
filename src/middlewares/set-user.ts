// todo - удалить временный мидлвар
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../utils/types';

const setUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66327c443a4a8a6ee8ac27c4',
  };

  next();
};

export default setUser;
