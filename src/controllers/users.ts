import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../utils/types';
import User from '../models/user';
import { catchError } from '../utils/helpers';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.find({}), res, next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.findById({ _id: req.params.id }), res, next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  catchError(User.create({ name, about, avatar }), res, next);
};

export const patchUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  catchError(
    User.findByIdAndUpdate(
      req.user?._id,
      { name, about, avatar },
      { new: true, upsert: true },
    ),
    res,
    next,
  );
};

export const patchAvatar = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  catchError(User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true }), res, next);
};
