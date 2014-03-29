var mongoose = require('mongoose')
	, Treasure = mongoose.model('Treasure')
	, Comment = mongoose.model('Comment')
	, geolib = require('geolib')

// GET: /treasures/:lat/:lng
exports.getTreasures = function(req, res) {
	var now = new Date(Date.now());
	Treasure.find({ expires: { $gt: now } }, function(err, treasures) {
		var inRange = calcDistance(req.params.lat, req.params.lng, treasures);
    	res.json(inRange);
	});
}

// GET: /treasure/:id/:lat/:lng
exports.getTreasureById = function(req, res) {
	var treasureId = req.params.id;
	var now = new Date(Date.now());
	Treasure.find({ _id: treasureId, expires: { $gt: now }  }, function (err, treasure) {
		var inRange = calcDistance(req.params.lat, req.params.lng, treasure);
		res.json(inRange);
	});
}

// GET: /treasures/:id
exports.getTreasuresByUser = function(req, res) {
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
		res.json(treasure._id);
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
	var update = { $push: { comments: comment._id } };
	var options = {new: true};
	Treasure.findOneAndUpdate(query, update, options, function(err, treasure) {
  		if (err) throw err;
		res.json(true);
	});
}

// DELETE: /treasure/:id
exports.deleteTreasure = function(req, res) {
	// Retrieve treasure id
	var treasureId = req.params.id;

	Treasure.findOneAndRemove({"_id": treasureId}, function(err, treasure) {
  		if (err) throw err;
		res.json(true);
	});
}

// GET: /treasure/image/:id/
exports.getTreasureImage = function(req, res) {
	var treasureId = req.params.id;

	Treasure.find({ _id: treasureId }, function (err, treasure) {
		path = require('path');

		var p = path.resolve(__dirname + '../../../img/1396092674437-Desert.jpg');
		res.sendfile(p);
	});
}
	
// Calculates the distance between given location and treasures
var calcDistance = function(lat, lng, treasures) {
	if (treasures) {
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
}	

// Return the total number of treasures in database
exports.getTreasureCount = function(callback) {
    Treasure.count({}, function (err, count) {
    	if (err) throw err;
    	callback(count);
    });
}

// Update the treasure image path
exports.updateTreasureImagePath = function(treasureId, path, callback) {
	//var id = mongoose.Types.ObjectId(treasureId);
	var length =0;
	for(var i in treasureId) length++;
	var res = treasureId.slice(1,length-1);
	//console.log(id);
	console.log(res);

	var query = {"_id": res};
	var update = { media: path };
	var options = {new: true};
	Treasure.findOneAndUpdate(query, update, options, function(err, treasure) {
  		if (err) throw err;
  		console.log(treasure);
		callback(true);
	});
}