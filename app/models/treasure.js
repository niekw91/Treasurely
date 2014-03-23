// Set up mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var ObjectId = mongoose.SchemaTypes.ObjectId;
var Comment = require('./comment')
var User = require('./user')

var TreasureSchema = Schema({
	  media: {type: String },
	  text: {type: String },
  	date: {type: Date, default: Date.now},
  	latitude: {type: Number },
  	longitude: {type: Number },
  	title: {type: String },
  	expires: {type: Date, default: new Date(Date.now() + 604800000) },
  	comments: [{type: ObjectId, ref: Comment}],
  	user_id: {type: ObjectId, ref: User}
});

mongoose.model('Treasure', TreasureSchema);