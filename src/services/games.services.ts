import type {GameCreateDTO, GameDocument, GamePublicDTO} from '../dataTypes/gameType.js';
import {ObjectId} from 'mongodb';
import {getCollection} from '../db.js';

function mapGamesToPublic(game: GameDocument): GamePublicDTO {
  return {
    id: game._id.toString(),
    name: game.name,
    console: game.console,
    genre: game.genre,
    description: game.description,
    price: game.price,
    image: game.image,
    slug: game.slug
  }
}

// Overloads
export async function getGames(): Promise<GamePublicDTO[]>
export async function getGames(slug: string): Promise<GamePublicDTO | null>

// Implementation
export async function getGames(slug?: string): Promise<GamePublicDTO[] | GamePublicDTO | null> {
  try {
    const games = await getCollection<GameDocument>('games');

    // If slug is provided → search only one game
    if (slug) {
      const game = await games.findOne({slug});

      if (!game) return null;

      return mapGamesToPublic(game);
    }

    // Otherwise return all games
    const results = await games.find({}).toArray();

    if (!results || results.length === 0) {
      throw new Error('Not found games.');
    }

    return results.map(mapGamesToPublic);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createGame(data: GameCreateDTO): Promise<GamePublicDTO> {
  try {
    const games = await getCollection<GameDocument>('games');

    const newGame: GameDocument = {
      ...data,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await games.insertOne(newGame);

    return mapGamesToPublic(newGame);
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getGamesByFilters(filters: {
  console?: string;
  genre?: string;
}): Promise<GamePublicDTO[]> {
  try {
    const games = await getCollection<GameDocument>('games');

    const resultQuery: Record<string, string> = {};

    if(filters.console) {
      resultQuery.console = filters.console;
    }

    if(filters.genre) {
      resultQuery.genre = filters.genre;
    }

    const results = await games.find(resultQuery).toArray();

    return results.map(mapGamesToPublic);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
