var mongoose 	= require('mongoose');
var chessSchema 	= new mongoose.Schema({
	occupy  : [String],
	title   : String,
	chess	: String
});

module.exports 	= mongoose.model('Chess', chessSchema);
