// Set up mongoose
var mongoose = require('mongoose')
	, Schema = mongoose.Schema

var UserSchema = Schema({
  	email: {type: String },
 	password: {type: String }
});

mongoose.model('User', UserSchema);