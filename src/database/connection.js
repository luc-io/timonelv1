import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/timonelv1';

let client;

export async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('timonelv1');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('Closed MongoDB connection');
  }
}