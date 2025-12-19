const { connectDB, getDB } = require('./data/connection');

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB for seeding');
    const db = getDB();
    const collection = db.collection('pokemon');

    await collection.deleteMany({});
    console.log('Cleared existing Pokémon');

    const sample = [
      {
        name: 'Bulbasaur',
        pokedexNumber: 1,
        types: ['Grass', 'Poison'],
        description: 'A strange seed was planted on its back at birth.',
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      },
      {
        name: 'Charmander',
        pokedexNumber: 4,
        types: ['Fire'],
        description: 'Obviously prefers hot places.',
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png',
      },
      {
        name: 'Squirtle',
        pokedexNumber: 7,
        types: ['Water'],
        description:
          'After birth, its back swells and hardens into a shell.',
        imageUrl:
          'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png',
      },
    ];

    await collection.insertMany(sample);
    console.log('Inserted sample Pokémon');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
