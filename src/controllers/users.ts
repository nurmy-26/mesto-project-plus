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

const {
  SALT_ROUNDS = ENV_EXAMPLE.SALT_ROUNDS,
  SECRET_KEY = ENV_EXAMPLE.SECRET_KEY,
  TOKEN_LIFETIME_SECONDS = ENV_EXAMPLE.TOKEN_LIFETIME_SECONDS,
} = process.env;

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
  const tokenLifetimeSecs = parseInt(TOKEN_LIFETIME_SECONDS, 10); // приводим к number

  return User.findUserByCredentials(email, password)
    // возвращаем пользователю токен и записываем его в httpOnly куку
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: tokenLifetimeSecs }, // до какого времени токен останется действительным
      );

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: tokenLifetimeSecs * 1000, // сколько браузеру хранить куку токена
      });

      res.status(constants.HTTP_STATUS_OK).send({ message: 'Вход выполнен успешно' });
    })
    .catch(next);
};
