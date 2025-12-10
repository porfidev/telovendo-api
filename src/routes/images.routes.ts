import { promises as fs } from 'fs';
import {Hono} from 'hono';
import path from 'path';
import { getImage } from '../services/images.services.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export const imagesRoutes = new Hono();


imagesRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    // Aquí tú haces un lookup en tu BD:
    const imageInfo = await getImage(id);
    if (!imageInfo) {
      return c.json({ ok: false, error: 'Imagen no encontrada' }, 404);
    }

    const filePath = path.join(UPLOADS_DIR, imageInfo.fileName);
    const file = await fs.readFile(filePath);

    // Podrías guardar también el mimeType en BD, de momento asumo image/png
    return c.body(file, 200, {
      'Content-Type': imageInfo.type ?? 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    });
  } catch (err) {
    console.error('Error al leer imagen', err);
    return c.json({ ok: false, error: 'No se pudo leer la imagen' }, 500);
  }
});
