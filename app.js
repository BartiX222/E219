const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const { connectDB } = require('./data/connection');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Session and flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretpokemon',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Global template variables
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
const pokemonRoutes = require('./routes/pokemon');

app.use('/pokemon', pokemonRoutes);

// Home
app.get('/', (req, res) => {
  res.render('index');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('errors/500', { error: err });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Nie udało się uruchomić serwera:', err);
    process.exit(1);
  }
})();
