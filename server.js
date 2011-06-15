
var UPDATES_PER_SEC = 1;
var json = JSON.stringify;

var game_state = [];

var http = require("http"),
	io = require("socket.io"),
	sys = require("sys"),
	nodestatic = require("node-static");

var static_server = new nodestatic.Server(".");

var server = http.createServer(function(req, res) {
	var url = require("url").parse(req.url);
	var pathfile = url.pathname;

	static_server.serve(req, res);
});

server.listen(1234);

var socket = io.listen(server);
socket.on("connection", function(client) {

	client.on("disconnect", function() {
		for( var i = 0 ; i < game_state.length ; i++ ) {
			if( game_state[i].object_id === client.sessionId ) {
				game_state[i].dead = true;
				socket.broadcast(json(game_state));
				game_state.splice(i, 1);
			}
		}
	});

	game_state.push({
		object_id: client.sessionId, 
		type: "player", 
		pos: {x:  random(0, 400), y: random(0, 400)}, 
		created_at: 1, 
		dead: false
	});

	client.send(json(game_state));

	client.on("message", function(msg) {
		var player;
		
		for( var i = 0 ; i < game_state.length ; i++ ) {
			if( game_state[i].object_id === client.sessionId ) {
				player = game_state[i];
				break;
			}
		}

		if( player ) {
			if( msg.up ) {
				player.pos.y--;
			}
			if( msg.down ) {
				player.pos.y++;
			}
			if( msg.left ) {
				player.pos.x--;
			}
			if( msg.right ) {
				player.pos.x++;
			}
			if( msg.space ) {
			}
			
			socket.broadcast(json(game_state));
		}
	});

});

function random(min, max) {
	return ~~(min + ( max - min ) * Math.random());
}

