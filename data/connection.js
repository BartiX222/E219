const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db('pokemon_wiki');
    console.log('Połączono z bazą danych MongoDB (pokemon_wiki)');
    return db;
  } catch (error) {
    console.error('Błąd połączenia z bazą danych MongoDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Baza danych nie jest połączona. Upewnij się, że connectDB() zostało wywołane.');
  }
  return db;
}

module.exports = { connectDB, getDB };
