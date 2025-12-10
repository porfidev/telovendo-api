import type {ConsoleDocument, ConsolePublicDTO} from '../dataTypes/consoleType.js';
import {ObjectId} from 'mongodb';
import {getCollection} from '../db.js';

function mapConsoleToPublic(console: ConsoleDocument): ConsolePublicDTO {
  return {
    id: console._id.toString(),
    name: console.name,
  }
}

export async function getConsoles(): Promise<ConsolePublicDTO[]> {
  try {
    const consoles = await getCollection<ConsoleDocument>('consoles');
    const results = await consoles.find({}).toArray();

    if(!results || !results.length) {
      throw new Error('Not found consoles');
    }

    return results.map(mapConsoleToPublic);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getConsoleById(id: string): Promise<ConsolePublicDTO | null> {
  try {
    const consoles = await getCollection<ConsoleDocument>('consoles');

    // Mongo usa ObjectId, así que lo convertimos
    const result = await consoles.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return mapConsoleToPublic(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
