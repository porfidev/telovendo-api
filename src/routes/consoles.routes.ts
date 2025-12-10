import {Hono} from 'hono';
import { getConsoles } from '../services/consoles.services.js';

export const consolesRoutes = new Hono();

consolesRoutes.get('/', async(c) => {
  try {
    const consoles = await getConsoles();
    return c.json({ok: true, consoles})
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'JSON inválido o vacío'

    return c.json({ok: false, error: message}, 400)
  }
})
