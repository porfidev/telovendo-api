
import bcrypt from 'bcryptjs';
import {Hono} from 'hono';
import jwt from 'jsonwebtoken';
import type { LoginData } from '../dataTypes/authTypes.js';
import { getAuthUser } from '../services/user.services.js';

const jwtKey = process.env.JWT_KEY!;
export const authRoutes = new Hono();

authRoutes.post('/login', async (c) => {
  if (!c.req.header('content-type')?.includes('application/json')) {
    return c.json(
      {ok: false, error: 'El contenido debe ser JSON (Content-Type: application/json)'},
      400
    );
  }

  // Intentar parsear JSON de forma segura
  try {
    const body = await c.req.json<LoginData>();

    const requiredFields = ['username', 'password'] as const;

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return c.json({ok: false, error: `El campo "${field}" es requerido`}, 400)
      }
    }

    const {username, password} = body;

    if (!username || !password) {
      return;
    }

    const users = await getAuthUser(username);

    if (!users) {
      return c.json({ok: false, error: 'Credenciales inválidas'}, 401)
    }

    const passwordIsValid = await bcrypt.compare(password, users.password)

    if (!passwordIsValid) {
      return c.json({ok: false, error: 'Credenciales inválidas'}, 401)
    }

    const token = jwt.sign(
      {
        sub: users._id.toString(),
        username: users.username,
      },
      jwtKey as string,
      {expiresIn: '1h'},
    );

    return c.json({
      ok: true,
      token,
      user: {
        id: users._id.toString(),
        username: users.username,
        email: users.email,
      },
    });

  } catch (err) {
    return c.json({success: false, error: 'JSON inválido o vacío'}, 400);
  }
});
