import {Hono} from 'hono';
import type { UserCreateDTO } from '../dataTypes/userType.js';
import { createUser } from '../services/user.services.js';

export const userRoutes = new Hono();

userRoutes.post('/',  async (c) => {
  if (!c.req.header('content-type')?.includes('application/json')) {
    return c.json({ok: false, error: 'El contenido debe ser JSON'}, 400)
  }

  try {
    const body = await c.req.json<UserCreateDTO>()

    const requiredFields = ['username', 'name', 'password', 'email'] as const

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return c.json({ok: false, error: `El campo "${field}" es requerido`}, 400)
      }
    }

    const user = await createUser({
      username: body.username,
      name: body.name,
      password: body.password,
      email: body.email
    });

    return c.json({ok: true, user})
  } catch (error) {
    console.log('ERROR MSG', error)
    const message =
      error instanceof Error ? error.message : 'JSON inválido o vacío'

    return c.json({ok: false, error: message}, 400)
  }
})
