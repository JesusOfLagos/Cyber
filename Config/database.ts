import mongoose, { ConnectOptions } from 'mongoose';
import config from './config';

export default class Database {
  private DB_URI = config.db.mongodb.MONGO_URL as string;

  private DB_OPTIONS: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;

  constructor() {}

  public async start(): Promise<void> {
    try {
      await mongoose.connect(this.DB_URI, this.DB_OPTIONS);
      console.log('Database connected');
    } catch (error) {
      console.log(error);
    }
  }

    public async stop(): Promise<void> {
        try {
        await mongoose.disconnect();
        console.log('Database disconnected');
        } catch (error) {
        console.log(error);
        }
    }

    public async clear(): Promise<void> {
        try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        } catch (error) {
        console.log(error);
        }
    }

    public async reset(): Promise<void> {
        await this.stop();
        await this.start();
    }

    public async getDb(): Promise<any> {
        return mongoose.connection.db;
    }

    public async getCollection(collectionName: string): Promise<any> {
        return mongoose.connection.collection(collectionName);
    }

    public async getModel(modelName: string): Promise<any> {
        return mongoose.connection.model(modelName);
    }

    public async getSchema(schemaName: string): Promise<any> {
        return mongoose.connection.model(schemaName);
    }

    public async getSchemaNames(): Promise<any> {
        return mongoose.connection.modelNames();
    }

    public async getCollectionNames(): Promise<any> {
        return mongoose.connection.db.listCollections().toArray();
    }

    public async getDbStats(): Promise<any> {
        return mongoose.connection.db.stats();
    }

    public async getDbCollectionsInfo(): Promise<any> {
        return mongoose.connection.db.collections();
    }

    // public async getDbIndexes(): Promise<any> {
    //     return mongoose.connection.db.indexes();
    // }

    public async getDbName(): Promise<any> {
        return mongoose.connection.db.databaseName;
    }

    public async getDbClient(): Promise<any> {
        return mongoose.connection.getClient();
    }

    public async getDbAdmin(): Promise<any> {
        return mongoose.connection.db.admin();
    }

    // public async getDbBuffer(): Promise<any> {
    //     return mongoose.connection.db.buffer();
    // }

    // public async getDbClose(): Promise<any> {
    //     return mongoose.connection.db.close();
    // } 
}