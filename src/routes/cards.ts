import { Router } from 'express';
import { createCard, getCards, removeCard } from '../controllers/cards';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', removeCard);

export default router;
