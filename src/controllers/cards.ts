import { NextFunction, Request, Response } from 'express';
import { CustomRequest } from '../utils/types';
import Card from '../models/card';
import { catchError } from '../utils/helpers';

const fields = ['name', 'link', 'owner', 'likes', 'createdAt', '_id'];

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  catchError(Card.find({}), res, next, fields);
};

export const createCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  catchError(
    Card.create({
      name,
      link,
      owner: req.user?._id,
    }),
    res,
    next,
    fields,
  );
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  catchError(Card.findByIdAndRemove({ _id: req.params.id }), res, next, fields);
};

export const likeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  catchError(
    Card.findByIdAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    ),
    res,
    next,
    fields,
  );
};

export const dislikeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  catchError(
    Card.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: req.user?._id } },
      { new: true },
    ),
    res,
    next,
    fields,
  );
};
