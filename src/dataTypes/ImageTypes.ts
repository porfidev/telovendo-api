import type {Document as MongoDocument, ObjectId} from 'mongodb';

export type ImageBase = {
  path: string;
  fileName: string;
  imageId: string;
  type: string;
}

export type ImageDocument = MongoDocument & ImageBase & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ImageCreateDTO = ImageBase;

export type ImagePublicDTO = ImageBase;
