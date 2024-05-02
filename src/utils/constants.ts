/* eslint-disable no-unused-vars */
export enum ERR_MESSAGE {
  INVALID_DATA = 'Переданы некорректные данные',
  SERVER_ERROR = 'На сервере произошла ошибка',
  RESOURCE_NOT_FOUND = 'Запрашиваемый ресурс не найден'
}

export const USER_FIELDS = ['name', 'about', 'avatar', '_id'];
export const AVATAR_FIELDS = ['avatar', '_id'];
export const CARD_FIELDS = ['name', 'link', 'owner', 'likes', 'createdAt', '_id'];
