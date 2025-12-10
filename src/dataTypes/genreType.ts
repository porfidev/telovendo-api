import type {Document as MongoDocument, ObjectId} from 'mongodb';

export type GameGenreBase = {
  description: string;
  name: string;
}


export type GameGenreDocument = MongoDocument & GameGenreBase & {
  _id: ObjectId;
  createdAt: Date
  updatedAt: Date
}

export type GameGenreCreateDTO = GameGenreBase & {
  createdAt: Date
  updatedAt: Date
}

export type GameGenrePublicDTO = GameGenreBase & {
  id: string
}
