// Set up mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var ObjectId = mongoose.SchemaTypes.ObjectId;
var User = require('./user')

var CommentSchema = Schema({
  	text: {type: String },
  	date: {type: Date, default: Date.now},
  	user_id: {type: ObjectId, ref: User}
});

mongoose.model('Comment', CommentSchema);