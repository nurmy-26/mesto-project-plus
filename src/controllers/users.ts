import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { constants } from 'http2';
import User from '../models/user';
import {
  AVATAR_FIELDS, CREATE_USER_FIELDS, ENV_EXAMPLE, USER_FIELDS,
} from '../utils/constants';
import { CustomRequest } from '../utils/types';
import { catchError } from '../utils/helpers';

const { SALT_ROUNDS = ENV_EXAMPLE.SALT_ROUNDS, SECRET_KEY = ENV_EXAMPLE.SECRET_KEY } = process.env;

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.find({}), res, next, USER_FIELDS);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  catchError(User.findById({ _id: req.params.id }), res, next, USER_FIELDS);
};

export const getAuthUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  catchError(User.findById({ _id: req.user?._id }), res, next, CREATE_USER_FIELDS);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = parseInt(SALT_ROUNDS, 10);

  catchError(
    bcrypt.hash(password, saltRounds)
      .then((hash: string) => User.create({
        name, about, avatar, email, password: hash,
      })),
    res,
    next,
    CREATE_USER_FIELDS,
    constants.HTTP_STATUS_CREATED,
  );
};

export const patchUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  catchError(
    User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    // возвращаем пользователю токен
    .then((user) => {
      // вариант для возврата в теле ответа:
      res.status(constants.HTTP_STATUS_OK).send({
        token: jwt.sign(
          { _id: user._id },
          SECRET_KEY,
          { expiresIn: '7d' }
        ),
      });

      // const token = jwt.sign(
      //   { _id: user._id },
      //   SECRET_KEY,
      //   { expiresIn: '7d' },
      // );

      // res.cookie('token', token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      // });

      // res.status(constants.HTTP_STATUS_OK).send({ message: 'Вход выполнен успешно' });
    })
    .catch(next);
};
