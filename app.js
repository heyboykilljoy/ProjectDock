var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');
var passportConfig = require('./config/passport');
var startupController = require('./controllers/startup.js');
var authenticationController = require('./controllers/authentication');
var apiController = require('./controllers/api');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());
app.use(session({
	secret: 'qelpNPCQZabsSunE',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', startupController.index);
app.get('/login', authenticationController.login);
app.post('/login', authenticationController.processLogin);
app.get('/signup', startupController.signup);
app.post('/signup', authenticationController.processSignup);
app.get('/logout', authenticationController.logout);
app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/app',
	failureRedirect: '/login'}));
app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.profile.emails.read' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
		res.redirect('/app');
	}
);

// Middleware (defined in config/passport.js module.exports),
// that prevents unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);

app.get('/app', startupController.app);
app.get('/db', apiController.pageRetrieve);
app.post('/db', apiController.pageSave);

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
