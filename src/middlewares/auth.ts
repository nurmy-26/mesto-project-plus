import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import handleUnauthorized from '../errors/unauthorized-handle';
import { extractBearerToken } from '../utils/helpers';

const { SECRET_KEY = '' } = process.env;

interface SessionRequest extends Request {
    user?: string | JwtPayload;
}

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  // проверка на присутствие заголовка авторизации и начинается ли он с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleUnauthorized(req, res, next);
  }

  const token = extractBearerToken(authorization); // сюда попадет только token без Bearer
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY); // пытаемся верифицировать с помощью секретного ключа
  } catch (err) {
    return handleUnauthorized(req, res, next);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};