import type {GameGenreDocument, GameGenrePublicDTO} from '../dataTypes/genreType.js';
import {ObjectId} from 'mongodb';
import {getCollection} from '../db.js';

function mapGameGenresToPublic(genre: GameGenreDocument): GameGenrePublicDTO {
  return {
    id: genre._id.toString(),
    name: genre.name,
    description: genre.description,
  }
}

export async function getGenres(): Promise<GameGenrePublicDTO[]> {
  try {
    const genres = await getCollection<GameGenreDocument>('game_genres');
    const results = await genres.find({}).toArray();

    if(!results || results.length === 0) {
      throw new Error('Not found game genres.');
    }

    return results.map(mapGameGenresToPublic);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getGenreById(id: string): Promise<GameGenrePublicDTO | null> {
  try {
    const genres = await getCollection<GameGenreDocument>('game_genres');

    // Mongo usa ObjectId, así que lo convertimos
    const result = await genres.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    return mapGameGenresToPublic(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
