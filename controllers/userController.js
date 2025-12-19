const passport = require('passport');
const User = require('../models/User');

exports.getRegister = (req, res) => {
  res.render('register', { errors: [], formData: {} });
};

exports.postRegister = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;
    const errors = [];

    if (!username || !username.trim()) errors.push('Username is required.');
    if (!password || password.length < 6)
      errors.push('Password must be at least 6 characters long.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');

    const existing = await User.findOne({ username });
    if (existing) errors.push('Username is already taken.');

    if (errors.length) {
      return res.status(400).render('register', { errors, formData: { username } });
    }

    const user = new User({ username: username.trim(), password });
    await user.save();

    req.flash('success', 'Registration successful. You can now log in.');
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/pokemon',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
  });
};
