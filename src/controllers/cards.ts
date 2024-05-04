import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import { CustomRequest } from '../utils/types';
import { catchError } from '../utils/helpers';
import { CARD_FIELDS, ERR_MESSAGE } from '../utils/constants';
import NotFoundError from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-err';

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

export const removeCard = (req: CustomRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.id)
    .then(card => {
      if (!card) {
        throw new NotFoundError(ERR_MESSAGE.RESOURCE_NOT_FOUND);
      } else if (card.owner.toString() !== req.user?._id.toString()) {
        // если владелец карточки не совпал, выкинем 403 ошибку
        throw new ForbiddenError(ERR_MESSAGE.STATUS_FORBIDDEN);
      } else {
        return catchError(Card.findByIdAndRemove({ _id: req.params.id }), res, next, CARD_FIELDS);
      }
    })
    .catch(next);
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
