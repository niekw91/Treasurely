var mongoose = require('mongoose')
	, Treasure = mongoose.model('Treasure')
	, Comment = mongoose.model('Comment')

// GET: /comments/:id
exports.getComments = function(req, res) {
	var treasureId = req.params.id;

	Treasure.find({ _id: treasureId }, function(err, treasure) {
		Comment.find({ _id: { $in: treasure[0].comments } }, function(err, comments) {
			res.json(comments);
		});
	});


}
