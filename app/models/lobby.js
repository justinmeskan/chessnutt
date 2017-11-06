var mongoose 		= require('mongoose');
var lobbySchema 	= new mongoose.Schema({
	roomname  		:  String,
	players   		: [String]
});

module.exports 	= mongoose.model('Lobby', lobbySchema);
