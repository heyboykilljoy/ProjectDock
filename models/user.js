var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/projectdock');

var userSchema = mongoose.Schema({
	userID : {
		type : String,
		required : true,
		unique : true
	},
	userFirstName: {
		type : String,
		required : true
	},
	userLastName : {
		type : String
	},
	displayName : {
		type : String,
	},
	password : {
		type : String,
		// required: true
	},
	photo : {
		type : String
	},
	projects : {
		type : String
	}
});

userSchema.pre('save', function(next){

	if(!this.isModified('password')) return next();

	var user = this;

	bcrypt.genSalt(10, function(err, salt){

    	if(err) return next(err);

    	bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			return next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, next){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return next(err);

		return next(null, isMatch);
	});
};

var User = mongoose.model('user', userSchema);

module.exports = User;