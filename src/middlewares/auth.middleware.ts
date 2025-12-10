import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_KEY!;

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ ok: false, error: 'Token requerido' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Verifica el token con jsonwebtoken
    const decoded = jwt.verify(token, jwtKey);

    // Puedes guardar el payload en el contexto
    c.set('user', decoded);

    await next();
  } catch (err) {
    return c.json({ ok: false, error: 'Token inválido o expirado' }, 401);
  }
};
