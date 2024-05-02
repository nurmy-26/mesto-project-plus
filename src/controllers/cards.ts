import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import { CustomRequest } from '../utils/types';
import { catchError } from '../utils/helpers';
import { CARD_FIELDS } from '../utils/constants';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  catchError(Card.find({}), res, next, CARD_FIELDS);
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
    CARD_FIELDS,
    constants.HTTP_STATUS_CREATED,
  );
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  catchError(Card.findByIdAndRemove({ _id: req.params.id }), res, next, CARD_FIELDS);
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
    CARD_FIELDS,
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
    CARD_FIELDS,
  );
};
