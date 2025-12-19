const pokemonModel = require('../models/Pokemon');
const bcrypt = require('bcryptjs');

function validatePokemonInput(body) {
  const errors = {};
  if (!body.name || !body.name.trim()) errors.name = 'Name is required.';
  if (!body.pokedexNumber || Number(body.pokedexNumber) <= 0) {
    errors.pokedexNumber = 'Pokédex number must be a positive number.';
  }
  const types = (body.types || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  if (!types.length) errors.types = 'At least one type is required.';
  return { errors, types };
}

// GET /pokemon/  (mounted on /pokemon) – lista z filtrem/sortowaniem
async function index(req, res, next) {
  try {
    const { type, sort } = req.query;
    const filter = {};
    if (type && type.trim()) {
      filter.types = { $regex: new RegExp(type.trim(), 'i') };
    }
    let sortOption = null;
    if (sort === 'name') sortOption = { name: 1 };
    else if (sort === 'pokedexNumber') sortOption = { pokedexNumber: 1 };

    const pokemon = await pokemonModel.getAllPokemon(filter, sortOption || {});
    res.render('pokemon/list', {
      pokemon,
      query: { type: type || '', sort: sort || '' },
    });
  } catch (err) {
    next(err);
  }
}

// GET /pokemon/new – formularz dodawania
function newForm(req, res) {
  res.render('pokemon/add', { errors: [], formData: {} });
}

// POST /pokemon/new – tworzenie nowego wpisu
async function create(req, res, next) {
  try {
    const { errors: fieldErrors, types } = validatePokemonInput(req.body);
    const errors = Object.values(fieldErrors);
    if (errors.length) {
      return res.status(400).render('pokemon/add', { errors, formData: req.body });
    }

    const plainPassword = (req.body.editPassword || '').trim();
    let editPasswordHash = null;
    if (plainPassword) {
      const salt = await bcrypt.genSalt(10);
      editPasswordHash = await bcrypt.hash(plainPassword, salt);
    }

    const pokemon = {
      name: req.body.name.trim(),
      pokedexNumber: Number(req.body.pokedexNumber),
      types,
      description: req.body.description || '',
      imageUrl: req.body.imageUrl || '',
      editPasswordHash,
    };

    await pokemonModel.addPokemon(pokemon);
    req.flash('success', 'Pokémon created successfully.');
    res.redirect('/pokemon');
  } catch (err) {
    next(err);
  }
}

// GET /pokemon/:id – szczegóły
async function show(req, res, next) {
  try {
    const pokemon = await pokemonModel.getPokemonById(req.params.id);
    if (!pokemon) {
      return res.status(404).render('errors/404');
    }
    res.render('pokemon/show', {
      pokemon,
      requiresPassword: Boolean(pokemon.editPasswordHash),
      errors: [],
    });
  } catch (err) {
    next(err);
  }
}

// GET /pokemon/:id/edit – formularz edycji
async function editForm(req, res, next) {
  try {
    const pokemon = await pokemonModel.getPokemonById(req.params.id);
    if (!pokemon) {
      return res.status(404).render('errors/404');
    }
    res.render('pokemon/edit', {
      errors: [],
      requiresPassword: Boolean(pokemon.editPasswordHash),
      formData: {
        id: pokemon._id,
        name: pokemon.name,
        pokedexNumber: pokemon.pokedexNumber,
        types: Array.isArray(pokemon.types) ? pokemon.types.join(', ') : '',
        description: pokemon.description || '',
        imageUrl: pokemon.imageUrl || '',
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /pokemon/:id – aktualizacja (z hasłem, jeśli ustawione)
async function update(req, res, next) {
  try {
    const existing = await pokemonModel.getPokemonById(req.params.id);
    if (!existing) {
      return res.status(404).render('errors/404');
    }

    const { errors: fieldErrors, types } = validatePokemonInput(req.body);
    const errors = Object.values(fieldErrors);
    const plainPassword = (req.body.editPassword || '').trim();

    if (existing.editPasswordHash) {
      const ok = plainPassword
        ? await bcrypt.compare(plainPassword, existing.editPasswordHash)
        : false;
      if (!ok) {
        errors.push('Invalid password for this Pokémon.');
      }
    }

    if (errors.length) {
      return res.status(400).render('pokemon/edit', {
        errors,
        requiresPassword: Boolean(existing.editPasswordHash),
        formData: { ...req.body, id: req.params.id },
      });
    }

    const updateObj = {
      name: req.body.name.trim(),
      pokedexNumber: Number(req.body.pokedexNumber),
      types,
      description: req.body.description || '',
      imageUrl: req.body.imageUrl || '',
    };

    await pokemonModel.updatePokemon(req.params.id, updateObj);
    req.flash('success', 'Pokémon updated successfully.');
    res.redirect(`/pokemon/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

// POST /pokemon/:id/delete – usuwanie (z hasłem, jeśli ustawione)
async function remove(req, res, next) {
  try {
    const pokemon = await pokemonModel.getPokemonById(req.params.id);
    if (!pokemon) {
      return res.status(404).render('errors/404');
    }

    if (pokemon.editPasswordHash) {
      const plainPassword = (req.body.editPassword || '').trim();
      const ok = plainPassword
        ? await bcrypt.compare(plainPassword, pokemon.editPasswordHash)
        : false;
      if (!ok) {
        return res.status(403).render('pokemon/show', {
          pokemon,
          requiresPassword: true,
          errors: ['Invalid password for this Pokémon.'],
        });
      }
    }

    await pokemonModel.deletePokemon(req.params.id);
    req.flash('success', 'Pokémon deleted successfully.');
    res.redirect('/pokemon');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  newForm,
  create,
  show,
  editForm,
  update,
  delete: remove,
};
