import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export type SavedFileInfo = {
  id: string;        // identificador lógico
  filename: string;  // nombre físico en disco
  path: string;      // ruta absoluta
  type: string;
};

export async function saveUploadedFile(file: File): Promise<SavedFileInfo> {
  // Asegura que exista la carpeta
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  console.log('FILE', file.name, file.type, file.size, '')
  const originalName = file.name || 'file.bin';
  const ext = path.extname(originalName) || '.bin';

  // ID único
  const id = crypto.randomUUID();
  const filename = `${id}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  // Convertir File → Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Guardar en disco
  await fs.writeFile(filePath, buffer);

  return {
    id,
    filename,
    path: filePath,
    type: file.type
  };
}
