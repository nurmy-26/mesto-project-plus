import { Request, Response } from 'express';
import { CustomRequest } from '../app';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

export const createCard = (req: CustomRequest, res: Response) => {
  const {
    name,
    link,
  } = req.body;

  return Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', error: err.message }));
};

export const removeCard = (req: Request, res: Response) => Card.findByIdAndRemove(req.params.id)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
