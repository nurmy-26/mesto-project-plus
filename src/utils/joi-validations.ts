import Joi from 'joi';

// схема для параметра id
export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// базовая схема пользователя
export const baseUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(200),
});

// схема для patchAvatar
export const avatarSchema = Joi.object({
  avatar: Joi.string().uri().required(),
});

// только email и password
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

// схема для регистрации
export const signupSchema = loginSchema.unknown(true);

// базовая схема карточки
export const baseCardSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});
