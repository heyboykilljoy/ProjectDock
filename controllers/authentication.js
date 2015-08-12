var passport = require('passport');
var User = require('../models/user');

var performLogin = function(req, res, next, user){
  req.login(user, function(err){

    if(err) return next(err);
    
    return res.redirect('app');
  });
};

var authenticationController = {

  login: function(req, res){
    res.render('login', {
      error: req.flash('error')
    });
  },

  processLogin: function(req, res, next){

    var authFunction = passport.authenticate('local', function(err, user, info){
      if(err) return next(err);

      if(!user) {
        req.flash('error', 'Error logging in. Please try again.');
        return res.redirect('/login');
      }
      
      performLogin(req, res, next, user);
    
    });

    authFunction(req, res, next);
  },

  processSignup: function(req, res, next){
    var user = new User({
      userID        : req.body.userID,
      password      : req.body.password,
      userFirstName : req.body.userFirstName,
      userLastName  : req.body.userLastName,
      displayName   : req.body.userFirstName + ' ' + req.body.userLastName,
      photo         : '/img/avatar.png'
    });

    user.save(function(err, user){

      if(err) {
        var errorMessage = 'An error occured, please try again';
        if(err.code === 11000){
          errorMessage = 'This user already exists.';
        }
        req.flash('error', errorMessage);
        return res.redirect('/login');
      }

      performLogin(req, res, next, user);
    });
  },

  logout: function(req, res){
    req.logout();
    res.redirect('/login');
  }
};

module.exports = authenticationController;