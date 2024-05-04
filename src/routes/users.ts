import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getUsers, getUser, patchUser, patchAvatar,
  getAuthUser,
} from '../controllers/users';
import {
  avatarSchema, baseUserSchema, idParamSchema
} from '../models/joi-validations';

const router = Router();

router.get('/', getUsers);
router.get('/me', getAuthUser);
router.patch('/me', celebrate({ body: baseUserSchema }), patchUser);
router.patch('/me/avatar', celebrate({ body: avatarSchema }), patchAvatar);
router.get('/:id', celebrate({ params: idParamSchema }), getUser);

export default router;
