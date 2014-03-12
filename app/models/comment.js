// Set up mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var CommentSchema = Schema({
  	text: {type: String },
  	date: {type: Date, default: Date.now},
  	user: {type: String }
});

mongoose.model('Comment', CommentSchema);