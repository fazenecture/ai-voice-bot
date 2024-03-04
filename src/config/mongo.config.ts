import { Db, MongoClient, MongoClientOptions } from "mongodb";

const { MONGO_URI } = process.env;

let client: MongoClient | undefined;
export let db: Db;

export const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions);

    try {
      await client.connect();

      db = client.db(process.env.MONGO_DB!);

      console.log("✅ Connected to MongoDB");
    } catch (err) {
      console.log("err: ", err);
      client.close();
    }
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
  }
};
