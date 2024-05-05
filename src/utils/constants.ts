/* eslint-disable no-unused-vars */
export enum ENV_EXAMPLE {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb',
  SALT_ROUNDS = '10',
  SECRET_KEY = 'defaultKey',
}

export enum ERR_MESSAGE {
  INVALID_DATA = 'Переданы некорректные данные',
  SERVER_ERROR = 'На сервере произошла ошибка',
  RESOURCE_NOT_FOUND = 'Запрашиваемый ресурс не найден',
  NAME_CONFLICT = 'Попытке создать дубликат уникального поля',
  INVALID_AUTH = 'Неправильные почта или пароль',
  UNAUTHORIZED = 'Необходима авторизация',
  STATUS_FORBIDDEN = 'У вас недостаточно прав',
}

export const USER_FIELDS = ['name', 'about', 'avatar', '_id'];
export const CREATE_USER_FIELDS = ['name', 'about', 'avatar', 'email', '_id'];
export const AVATAR_FIELDS = ['avatar', '_id'];
export const CARD_FIELDS = ['name', 'link', 'owner', 'likes', 'createdAt', '_id'];
