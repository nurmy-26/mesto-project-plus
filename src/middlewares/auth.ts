import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import handleUnauthorized from '../errors/unauthorized-handle';
import { ENV_EXAMPLE } from '../utils/constants';

const { SECRET_KEY = ENV_EXAMPLE.SECRET_KEY } = process.env;

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token || ''; // пытаемся достато токен из куков
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

  return next(); // пропускаем запрос дальше
};
