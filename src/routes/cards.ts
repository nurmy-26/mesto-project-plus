import { Router } from 'express';
import { createCard, dislikeCard, getCards, likeCard, removeCard } from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', removeCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

export default router;
