import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createCard, dislikeCard, getCards, likeCard, removeCard,
} from '../controllers/cards';
import {
  baseCardSchema, idParamSchema,
} from '../utils/joi-validations';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate({ body: baseCardSchema }), createCard);
router.delete('/:id', celebrate({ params: idParamSchema }), removeCard);
router.put('/:id/likes', celebrate({ params: idParamSchema }), likeCard);
router.delete('/:id/likes', celebrate({ params: idParamSchema }), dislikeCard);

export default router;
