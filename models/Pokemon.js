const { getDB } = require('../data/connection');
const { ObjectId } = require('mongodb');

const COLLECTION = 'pokemon';

function buildIdQuery(id) {
  if (ObjectId.isValid(id)) {
    try {
      return { _id: new ObjectId(id) };
    } catch (e) {
      // fallback to string id
    }
  }
  return { _id: id };
}

async function getAllPokemon(filter = {}, sort = null) {
  const db = getDB();
  let cursor = db.collection(COLLECTION).find(filter);
  if (sort && Object.keys(sort).length) {
    cursor = cursor.sort(sort);
  }
  return cursor.toArray();
}

async function getPokemonById(id) {
  const db = getDB();
  const query = buildIdQuery(id);
  return db.collection(COLLECTION).findOne(query);
}

async function addPokemon(pokemon) {
  const db = getDB();
  const result = await db.collection(COLLECTION).insertOne(pokemon);
  return result.insertedId;
}

async function updatePokemon(id, update) {
  const db = getDB();
  const query = buildIdQuery(id);
  const res = await db.collection(COLLECTION).updateOne(query, { $set: update });
  return res.modifiedCount > 0;
}

async function deletePokemon(id) {
  const db = getDB();
  const query = buildIdQuery(id);
  const res = await db.collection(COLLECTION).deleteOne(query);
  return res.deletedCount > 0;
}

module.exports = {
  getAllPokemon,
  getPokemonById,
  addPokemon,
  updatePokemon,
  deletePokemon,
};
