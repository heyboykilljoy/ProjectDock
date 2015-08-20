var fs = require('fs');

var twilioController = {

	text: function(req, res) {
		// console.log(req.body.Body);
		fs.writeFile('./data/twilio.json', '{ "messagebody" : ' + '"' + req.body.Body + '" }', function (err) {
  			if (err) return console.log(err);
  			// console.log('File Saved');
		});
		res.sendStatus(200);
	},

	getMessage : function(req, res) {
		fs.readFile('./data/twilio.json','utf8', function (err, data) {
			if(JSON.parse(data).messagebody !== "") {
				res.send(JSON.parse(data).messagebody);
				fs.writeFile('./data/twilio.json', '{ "messagebody" : ""}', function (err) {
	  				if (err) return console.log(err);
	  				// console.log('File Saved');
				});
			}
			else {
				// console.log('No Message');
				res.sendStatus(200);
			}
		});
	}
}

module.exports = twilioController;