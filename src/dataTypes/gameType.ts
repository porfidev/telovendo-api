import type {Document as MongoDocument, ObjectId} from 'mongodb';

export type GameBase = {
  name: string;
  console: string;
  genre: string;
  description?: string;
  price: number;
  image?: string;
}

export type GameDocument = MongoDocument & GameBase & {
  _id: ObjectId;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GameCreateDTO = GameBase & {
  slug: string;
}

export type GamePublicDTO = GameBase & {
  id: string;
  slug: string;
}
