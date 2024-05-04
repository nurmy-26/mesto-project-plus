import { model, Model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import UnauthorizedError from '../errors/unauthorized-err';
import { ERR_MESSAGE } from '../utils/constants';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [200, 'Максимальная длина поля - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

// делаем код проверки почты и пароля частью схемы User (возвращает пользователя или ошибку)
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user) => {
    // если не нашли пользователя по email
    if (!user) {
      throw new UnauthorizedError(ERR_MESSAGE.INVALID_AUTH);
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      // если не подошел пароль
      if (!matched) {
        throw new UnauthorizedError(ERR_MESSAGE.INVALID_AUTH);
      }

      return user;
    });
  });
});

export default model<IUser, UserModel>('user', userSchema);
