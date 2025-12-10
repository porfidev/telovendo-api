import {Hono} from 'hono';
import { getGenres } from '../services/genres.services.js';

export const gameGenresRoutes = new Hono();

gameGenresRoutes.get('/', async(c) => {
  try {

    const genres = await getGenres();
    return c.json({ok: true, genres})

  } catch (error) {
    console.log('ERROR MSG', error)
    const message =
      error instanceof Error ? error.message : 'JSON inválido o vacío'

    return c.json({ok: false, error: message}, 400)
  }
})
