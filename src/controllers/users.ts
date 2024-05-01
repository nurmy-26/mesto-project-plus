import { Request, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from 'app';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const getUser = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const patchUser = (req: CustomRequest, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      about,
      avatar,
    },
    {
      new: true,
      upsert: true,
    })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export const patchAvatar = (req: CustomRequest, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
