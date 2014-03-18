var mongoose = require('mongoose')
	, Treasure = mongoose.model('Treasure')
	, Comment = mongoose.model('Comment')
	, geolib = require('geolib')

// GET: /treasures/:lat/:lng
exports.getTreasures = function(req, res) {
	Treasure.find({ active: true }, function(err, treasures) {
		var inRange = calcDistance(req.params.lat, req.params.lng, treasures);
    	res.json(inRange);
	});
}

// GET: /treasure/:id/:lat/:lng
exports.getTreasureById = function(req, res) {
	var treasureId = req.params.id;

	Treasure.find({ _id: treasureId, active: true  }, function (err, treasure) {
		var inRange = calcDistance(req.params.lat, req.params.lng, treasure);
		res.json(inRange);
	});
}

// GET: /treasures/:id
exports.getTreasuresByUser = function(req, res) {
	console.log(req.user);

	var userId = req.params.id;

	Treasure.find({ user_id: userId }, function (err, treasures) {
		res.json(treasures);
	});
}

// POST: /treasure
exports.postTreasure = function(req, res) {
	var treasure = new Treasure(req.body);

	treasure.save(function(err) {
  		if (err) throw err;
	  	// Save new treasure to database
	  	// var socketIO = global.socketIO;
		// socketIO.sockets.emit('treasure:posted', treasure);
		res.json(true);
	});
}

// PUT: /treasure/:id
exports.postComment = function(req, res) {
	// Retrieve comment from body and save to database
	var comment = new Comment(req.body);
	comment.save(function(err) {
		if (err) throw err;
	})
	// Retrieve treasure id
	var treasureId = req.params.id;

	var query = {"_id": treasureId};
	var update = {comments: comment._id};
	var options = {new: true};
	Treasure.findOneAndUpdate(query, update, options, function(err, treasure) {
  		if (err) throw err;
  		// Update treasure and emit new comment
		// var socketIO = global.socketIO;
		// socketIO.sockets.emit('comment:posted', comment);
		res.json(true);
	});
}

// DELETE: /treasure/:id
exports.deleteTreasure = function(req, res) {
	// Retrieve treasure id
	var treasureId = req.params.id;

	Treasure.findOneAndRemove({"_id": treasureId}, function(err, treasure) {
  		if (err) throw err;
  		// Remove treasure and emit
		// var socketIO = global.socketIO;
		// socketIO.sockets.emit('treasure:deleted', treasure);
		res.json(true);
	});
}
	
// Calculates the distance between given location and treasures
var calcDistance = function(lat, lng, treasures) {
	var inRange = [];
    treasures.forEach(function(treasure) {
    	// Calculate distance between given location and treasure
    	var distance = geolib.getDistance({latitude: lat, longitude: lng }, {latitude: treasure.latitude, longitude: treasure.longitude});
    	// If distance is smaller then 500 meters, add treasure to array
		console.log(distance);

    	if (distance < 500) {
	    	inRange.push(treasure);
	    }
    });
    return inRange;
}	