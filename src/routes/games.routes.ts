
import {Hono} from 'hono';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import {getConsoleById} from '../services/consoles.services.js';
import {createGame, getGames, getGamesByFilters} from '../services/games.services.js';
import {getGenreById} from '../services/genres.services.js';
import {createImage} from '../services/images.services.js';
import {saveUploadedFile} from '../utils/saveUploadFile.js';
import type { GameCreateDTO } from '../dataTypes/gameType.js';

export const gamesRoutes = new Hono();

gamesRoutes.get('/', async (c) => {
  try {
    const consoleQS = c.req.query('console');
    const genreQS = c.req.query('genre');

    const filters = {
      console: consoleQS ?? undefined,
      genre: genreQS ?? undefined,
    }

    const games = await getGamesByFilters(filters);

    return c.json({ok: true, games})
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'JSON inválido o vacío'

    return c.json({ok: false, error: message}, 400)
  }
})

gamesRoutes.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')

    const game = await getGames(slug)

    if (!game) {
      return c.json({ok: false, error: 'Juego no encontrado'}, 404)
    }

    return c.json({ok: true, game})
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return c.json({ok: false, error: message}, 400)
  }
})

gamesRoutes.post('/', authMiddleware, async (c) => {
  if (!c.req.header('content-type')?.includes('multipart/form-data')) {
    return c.json({ok: false, error: 'El contenido debe ser formData'}, 400)
  }

  try {
    const formData = await c.req.formData();

    console.log('formData', formData);
    const name = String(formData.get('name') ?? '').trim();
    const consoleName = String(formData.get('console') ?? '').trim();
    const genre = String(formData.get('genre') ?? '').trim();
    const priceRaw = String(formData.get('price') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    const file = formData.get('image') as File | null;

    const requiredFields = [
      {key: 'name', value: name},
      {key: 'console', value: consoleName},
      {key: 'genre', value: genre},
      {key: 'price', value: priceRaw},
    ] as const;

    for (const field of requiredFields) {
      if (!field.value) {
        return c.json(
          {ok: false, error: `El campo "${field.key}" es requerido`},
          400,
        );
      }
    }

    const price = Number(priceRaw);
    if (Number.isNaN(price) || price <= 0) {
      return c.json(
        {ok: false, error: 'El campo "price" debe ser un número válido'},
        400,
      );
    }

    let imageId: string | undefined = undefined;

    if (file) {
      const saved = await saveUploadedFile(file);
      imageId = saved.id;
      console.log('Archivo guardado:', saved);
      const storedImage = await createImage({
        path: saved.path,
        fileName: saved.filename,
        imageId: saved.id,
        type: saved.type,
      });
    } else {
      console.log('Sin archivo de imagen, se continúa solo con datos');
    }

    const consoleGame = await getConsoleById(consoleName);
    const readableConsole = consoleGame?.name ?? 'Consola no disponible';

    const genreGame = await getGenreById(genre);
    const readableGenre = genreGame?.name ?? 'Genero no disponible';

    const body: GameCreateDTO = {
      name,
      console: readableConsole,
      genre: readableGenre,
      price,
      slug: name.toLowerCase().replace(/\s/g, '-') + Date.now(),
      image: imageId,
      description: description
    };

    const game = await createGame(body);
    return c.json({ok: true, game})
  } catch (error) {
    console.log('ERROR MSG', error)
    const message =
      error instanceof Error ? error.message : 'JSON inválido o vacío'

    return c.json({ok: false, error: message}, 400)
  }
});
