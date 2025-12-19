# Pokémon Wiki

## Project Description

This is a web application serving as a wiki for Pokémon. Users can browse Pokémon, filter by type, sort by name or Pokédex number, and anyone can perform CRUD operations (create, read, update, delete) on Pokémon entries. Dodatkowo każdy Pokémon może mieć własne hasło wymagane przy edycji/usunięciu.

The app is built with Node.js, Express, MongoDB (via Mongoose) and EJS templates. There is no system of user accounts or login; only per-Pokémon passwords.

## Features

- Optional password per Pokémon, hashed with bcrypt; if set, it must be provided to edit or delete that Pokémon.
- List of Pokémon with filtering using query parameters (e.g. `?type=Fire`).
- Sorting by multiple fields via query parameters (e.g. `?sort=name` or `?sort=pokedexNumber`).
- Detailed view for each Pokémon.
- Add, edit, and delete Pokémon without user accounts.
- Dynamic routing using IDs (e.g. `/pokemon/:id`, `/pokemon/:id/edit`).
- Input validation on server side.
- Basic error handling with custom 404 and 500 pages.

## Installation and Running

1. Clone the repository:

```bash
git clone https://github.com/BartiX222/E219
cd E219
```

2. Install dependencies:

```bash
npm install
```

3. Start MongoDB. You can either run a local MongoDB instance or use Docker. See `docker.txt` for detailed Docker instructions. The default connection URI is:

```bash
mongodb://127.0.0.1:27017/pokemon_wiki
```

4. (Optional) Seed sample data:

```bash
npm run seed
```

5. Start the server:

```bash
npm start
```

6. Open the app in your browser:

```text
http://localhost:3000
```

## Endpoints

- `GET /` – Home page.
- `GET /pokemon` – List Pokémon (supports query params `type` and `sort`).
- `GET /pokemon/:id` – Pokémon details.
- `GET /pokemon/add` – Add form.
- `POST /pokemon` – Create Pokémon (optional edit/delete password can be set).
- `GET /pokemon/:id/edit` – Edit form (if the Pokémon has a password, it must be provided).
- `PUT /pokemon/:id` – Update Pokémon (requires per-Pokémon password if set).
- `DELETE /pokemon/:id` – Delete Pokémon (requires per-Pokémon password if set).

## Technologies

- Node.js
- Express.js
- MongoDB
- EJS templating engine
- Bootstrap for basic styling
- bcryptjs for hashing per-Pokémon passwords

## Author

Bartek Orczykowski

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

