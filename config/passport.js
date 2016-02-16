var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

// Load Configuration Keys
var configVars = require('./configVars.json');

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
		done(err, user);
	});
});

var localStrategy = new LocalStrategy(function(userID, password, done){

	User.findOne({userID: userID}, function(err, user){

		if(err) return done(err);

	    if(!user) return done(null, false);

	    user.comparePassword(password, function(err, isMatch){

	    	if(err) return done(err);

	    	if(isMatch){
	    		return done(err, user);
	    	}
	    	else {
	    		return done(null, false);
	    	}
	    });
	});
});

passport.use(localStrategy);

passport.use(new FacebookStrategy({
    	clientID 	  : configVars.facebookClientID,
    	clientSecret  : configVars.facebookClientSecret,
    	callbackURL	  : "/auth/facebook/callback",
    	profileFields : ['id', 'displayName', 'name','photos', 'emails']
	},
  
	function(accessToken, refreshToken, profile, done) {
    	User.findOne({userID: profile.emails[0].value}, function(err, user) {

      		if (err) { return done(err); }

    		if (user) {
    			user.photo = profile.photos[0].value;
    			user.save(function(err) {
    				if (err) {
    					console.log(err);
    				}
    			});
        		done(null, user);
    		}
      		else {
				var newUser = new User({
					userID	: profile.emails[0].value,
					displayName : profile.displayName,
					photo : profile.photos[0].value,
					userFirstName : profile.name.givenName,
					userLastName : profile.name.familyName,
					password : configVars.facebookPassword
				});

        		newUser.save(function(err, saved){
          			console.log('save')
          			console.log(err)
          			done(null, saved);
        		})
      		}
    	});
  	})
);

passport.use(new GoogleStrategy({
		clientID	 : configVars.googleClientID,
		clientSecret : configVars.googleClientSecret,
		callbackURL  : '/auth/google/callback'
	},

	function(accessToken, refreshToken, profile, done) {
    	User.findOne({ userID: profile.emails[0].value }, function(err, user) {

      		if (err) { return done(err); }

      		if (user) {
        		done(null, user);
      		}
      		else {
        		var newUser = new User({
        			userID	: profile.emails[0].value,
					displayName : profile.displayName,
					photo : profile.photos[0].value,
					userFirstName : profile.name.givenName,
					userLastName : profile.name.familyName,
					password : configVars.googlePassword
        		});

        		newUser.save(function(err, saved) {
        			done(null, saved);
        		});
			}
		});
	})
);

module.exports = {
	ensureAuthenticated: function(req, res, next){

		if(req.isAuthenticated()){

      		return next();
		}

		res.redirect('/login');
	}
};