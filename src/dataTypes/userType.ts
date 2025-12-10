import type {ObjectId, Document as MongoDocument} from 'mongodb'

export type UserBase = {
  username: string
  name: string
  password: string
  email: string
};

export type UserDocument = MongoDocument & UserBase & {
  _id: ObjectId,
  createdAt: Date
  updatedAt: Date
}

export type UserCreateDTO = UserBase & {
  createdAt: Date
  updatedAt: Date
}

export type UserPublicDTO =
  Omit<UserBase, 'password'> & {
  id: string
}
