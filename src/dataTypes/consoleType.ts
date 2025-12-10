import type {Document as MongoDocument, ObjectId} from 'mongodb';

export type ConsoleBase = {
  name: string;
}


export type ConsoleDocument = MongoDocument & ConsoleBase & {
  _id: ObjectId;
  createdAt: Date
  updatedAt: Date
}

export type ConsoleCreateDTO = ConsoleBase & {
  createdAt: Date
  updatedAt: Date
}

export type ConsolePublicDTO = ConsoleBase & {
  id: string
}
