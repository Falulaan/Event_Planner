import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object we store on the Node.js global scope.
 * This prevents creating multiple MongoDB connections during development
 * when Next.js performs hot reloads or re-runs server code.
 */
interface MongooseGlobal {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global type to include our mongoose cache.
 *
 * We use `var` on `global` (below) instead of `let`/`const` so that the value
 * is preserved across module reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseGlobal | undefined;
}

/**
 * Internal cached connection container. In production this will live only for
 * the lifetime of the server instance. In development, it will be attached to
 * the global scope to survive hot reloads.
 */
const cached: MongooseGlobal = global._mongoose || { conn: null, promise: null };

if (!global._mongoose) {
  global._mongoose = cached;
}

/**
 * Connect to MongoDB using Mongoose.
 *
 * This function is safe to call multiple times; it will reuse an existing
 * connection if one is already established, or reuse an in-flight connection
 * promise if a connection attempt is already in progress.
 */
export async function connectToDatabase(): Promise<Connection> {
  // Your MongoDB connection string should be provided via environment variable.
  // Example for local dev: 'mongodb://localhost:27017/my-db'
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  // If an active connection already exists, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists yet, create one and store it in the cache.
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      // Add connection options here as needed, e.g.:
      // maxPoolSize: 10,
      // serverSelectionTimeoutMS: 5000,
    });
  }

  // Wait for the connection to resolve, then cache and return the underlying
  // Mongoose Connection instance.
  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;

  return cached.conn;
}

export default connectToDatabase;
