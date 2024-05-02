import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import User from '../models/user';
import { CustomRequest } from '../utils/types';
import { catchError } from '../utils/helpers';
import { AVATAR_FIELDS, USER_FIELDS } from '../utils/constants';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.find({}), res, next, USER_FIELDS);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.findById({ _id: req.params.id }), res, next, USER_FIELDS);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  catchError(
    User.create(
      { name, about, avatar },
    ),
    res,
    next,
    USER_FIELDS,
    constants.HTTP_STATUS_CREATED,
  );
};

export const patchUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  catchError(
    User.findByIdAndUpdate(
      req.user?._id,
      { name, about, avatar },
      { new: true, runValidators: true, upsert: true },
    ),
    res,
    next,
    USER_FIELDS,
  );
};

export const patchAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  catchError(
    User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    ),
    res,
    next,
    AVATAR_FIELDS,
  );
};
