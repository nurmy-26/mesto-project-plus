import { Router } from 'express';
import { createUser, getUsers, getUser, patchUser, patchAvatar } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

export default router;
