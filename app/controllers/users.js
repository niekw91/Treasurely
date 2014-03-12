var mongoose = require('mongoose')
	, User = mongoose.model('User')

exports.getUsers = function(req, res) {
	User.find({}, function(err, users) {
    	res.json(users);
	});
}

exports.postUser = function(req, res) {
	var user = new User(req.body);

	user.save(function(err) {
  		if (err) throw err;
	  	// Save new user to database
	  	var socketIO = global.socketIO;
		socketIO.sockets.emit('user:posted', user);
		res.json(true);
	});
}
