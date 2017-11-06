var mongoose   = require('mongoose');
var Lobby      = require('../app/models/lobby');
var User      = require('../app/models/user');

module.exports = function(app,io,passport) {  
	Lobby.remove({},function(err,data){
	});
	app.get('/', function(req, res) {
    	res.render('login', {
        	message: req.flash('loginMessage')});
    });
    app.post('/', passport.authenticate('local-login', {
	    successRedirect : '/main', 
	    failureRedirect : '/', 
	    failureFlash    : true 
	}));
    app.get('/signup', function(req, res) {
        res.render('signup', {
            message: req.flash('signupMessage')});
    });
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/main', 
        failureRedirect : '/signup', 
        failureFlash    : true 
    }));
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	app.get('/main',function(req, res) {
		if(!req.session.passport){
		    res.redirect('/');
		};

		var roomname = req.query.choosenroom ? req.query.choosenroom : 'friendShip';
		var hidePanel = true;
		if(req.query.choosenroom){
			console.log('you loggee o ut justin')
			req.logout();
			hidePanel = false;
		}
		req.session.roomname = roomname;
		User.findOne({"_id":req.session.passport.user}, function (err,user) {
    		req.session.name = user.local.name;       
   		})
		Lobby.find({},function(err,rooms){
			res.render('main',{
				hidePanel : hidePanel,
				rooms : rooms,
				room : roomname,
				name  : req.session.name
			});
		});	
	});
	app.get('/joinroom',function(req,res){
		if(!req.session.passport){
		    res.redirect('/');
		};
		var roomname = req.query.choosenroom ? req.query.choosenroom : 'friendShip';
		req.session.roomname = roomname;
		Lobby.find({'roomname':req.query.choosenroom},function(err,room){
			console.log('player name is ',req.session.name)
			if(room[0]){	
				if(room[0].players.length == 1){
					room[0].players.push(req.session.name)
					room[0].save(function(err,data){
				
					})
				}
			}	
		})
		res.render('main',{
			player: '2',
			hidePanel : false,
			rooms : false,
			room  : roomname,
			name  : req.session.name
		});
	})
	app.post('/main',function(req,res){
		if(!req.session.passport){
		    res.redirect('/');
		};
		if(req.body.roomname == ''){
			req.body.roomname = 'friendShip';
		}
		Lobby.create({
			roomname  : req.body.roomname,
			players   :[req.session.name]
		},function(err,roomentery){
			res.render('main',{
				rooms : false,
				player: '1',
				room  : req.body.roomname,
				name  : req.session.name
			});
		})
	})
	app.get('/rooms',function(req,res){
		Lobby.find({},function(err,rooms){	
			res.json(rooms);
		});
	})
    io.sockets.on('connection', function(socket){
        var room;
        var username;
        socket.emit('login');
		socket.on('login', function(roomname) { 
		    username = roomname[1];
		    room = roomname[0];
		 	socket.join(username);	
		    socket.join(room);
		    console.log(username,' has entered room ',room,' and ',username)	
        });
        socket.on('disconnect', function() { 
        	console.log(username,' has just left room ', room)
        	Lobby.findOne({'roomname':room},function(err,roomm){
        		console.log('disconnect room ',roomm)
        		if(roomm != null){
        			if(roomm.players[1] == undefined){
        				Lobby.remove({ 'roomname' : room } , function (err){
        					console.log(room,' has been removed')
        				})
        			}
        			if(roomm.players[0] == username){
        				roomm.players.shift()
        			}else if(roomm.players[1] == username){
        				roomm.players.pop()
        			}
    				roomm.save(function(err,data){
    					console.log(data,' removed')
    				})	
        		}	
        		console.log('**room is on disconnect ',roomm)
        	})
        	console.log('disconnecting')
        });
        socket.on('refresh',function(){
            socket.emit("fresh");
            socket.broadcast.to(room).emit("fresh");
        })
        socket.on('animateOpponent',function(data){
        	socket.broadcast.to(room).emit('imBeingAnimated',data)
        })
         socket.on('animateCastle',function(data){
        	socket.broadcast.to(room).emit('imCastling',data)
        })
        socket.on('removevictim',function(data){
        	socket.broadcast.to(room).emit('victimremoved',data)
        })
        socket.on('passpawn',function(data){
        	socket.broadcast.to(room).emit('passpawned',data)
        })
        socket.on('chatSig',function(data){
        	if(data[0] == ''){data[0] = room}
        	socket.broadcast.to(data[0]).emit('sig',data)
        })
        socket.on('chat',function(data){
        	if(data[0] == ''){data[0] = room}
        	socket.broadcast.to(data[0]).emit('sendChat',data[2]+' tells you: '+data[1])
        	socket.emit('sendChat','you said to ' +data[0]+ ': '+data[1])
        })
    });   
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/notloggedin');
}

























