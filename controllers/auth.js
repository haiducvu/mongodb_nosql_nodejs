const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('63becc7ea768e920ec479c14')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch((err) => console.log('err', err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log('err', err);
    res.redirect('/');
  });
};
