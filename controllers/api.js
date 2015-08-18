var User = require('../models/user');

var apiController = {
	pageSave : function(req, res) {
		User.findOne({userID : req.user.userID}, function(err, user){
			user.projects = req.body.data;
			user.save(function(err){
				if(err){
					console.log(err);
				}
			res.send(err);
			});
		});	
	},
	pageRetrieve : function(req, res) {
			res.send(req.user.projects);
	}
}

module.exports = apiController