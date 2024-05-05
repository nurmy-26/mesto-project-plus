import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import handleUnauthorized from '../errors/unauthorized-handle';
// import { extractBearerToken } from '../utils/helpers';
import { ENV_EXAMPLE } from '../utils/constants';

const { SECRET_KEY = ENV_EXAMPLE.SECRET_KEY } = process.env;

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  // вариант через токен в заголовках
  // проверка на присутствие заголовка авторизации и начинается ли он с Bearer
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return handleUnauthorized(req, res, next);
  // }
  // const token = extractBearerToken(authorization); // сюда попадет только token без Bearer

  const token = req.cookies.token || '';
  if (!token) {
    return handleUnauthorized(req, res, next);
  }
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY); // пытаемся верифицировать с помощью секретного ключа
  } catch (err) {
    return handleUnauthorized(req, res, next);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
