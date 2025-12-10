import type {UserBase, UserDocument, UserPublicDTO} from '../dataTypes/userType.ts';
import {getCollection} from '../db.js';
import {ObjectId} from 'mongodb'
import bcrypt from 'bcryptjs';

function mapUserToPublic(user: UserDocument): UserPublicDTO {
  return {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    email: user.email,
  }
}

export async function createUser(data: UserBase): Promise<UserPublicDTO> {
  try {
    const users = await getCollection<UserDocument>('users');

    const existing = await users.findOne({
      $or: [
        {email: data.email},
        {username: data.username},
      ],
    });

    if (existing) {
      throw new Error('El usuario ya existe (email o username duplicado)');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10) // 10 = salt rounds

    const newUser: UserDocument = {
      ...data,
      password: hashedPassword,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await users.insertOne(newUser)

    return mapUserToPublic(newUser);
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export async function getUsers(): Promise<UserPublicDTO[]>
export async function getUsers(username: string): Promise<UserPublicDTO | null>

export async function getUsers(username?: string): Promise<UserPublicDTO[] | UserPublicDTO | null> {
  try {
    const users = await getCollection<UserDocument>('users');

    if (username) {
      const user = await users.findOne({username});
      if (!user) {
        return null;
      }

      return mapUserToPublic(user);
    }

    const usersResult = await users.find({}).toArray();

    if (!usersResult || usersResult.length === 0) {
      throw new Error('Not found users.')
    }

    return usersResult.map(mapUserToPublic);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAuthUser(username: string): Promise<UserDocument | null> {
  try {
    const users = await getCollection<UserDocument>('users');


    const user = await users.findOne({username});
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
