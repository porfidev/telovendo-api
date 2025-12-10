import {Collection, Db, MongoClient} from 'mongodb';
import type { Document as MongoDocument } from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB!;

const client = new MongoClient(uri);

let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  try {
    if (!db) {
      await client.connect();
      db = client.db(dbName);
      console.log("Mongo conectado");
    }
    return db
    } catch (err) {
    console.error("Error conectando a Mongo:", err);
    throw err;
  }
  }

export async function getCollection<TSchema extends MongoDocument = MongoDocument>(name: string): Promise<Collection<TSchema>> {
  const db = await connectDB(); // tu base
  return db.collection<TSchema>(name);

}
