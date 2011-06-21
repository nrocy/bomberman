
var UPS = 10;
var VEL = 20;

var world = [
	{ x: 10, y: 10, dx: 0, dy: 0 }
];

var clock = new Date().getTime();

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

var io = io.listen(server);
io.sockets.on("connection", function(socket) {

	world = [
		{ x: 200, y: 200, dx: 0, dy: 0 }
	];

	socket.on("pong", function(response) {
		var now = new Date().getTime();
		//console.log("RTT: " + (now - response.stime) + "ms");
		socket.emit("rtt", now - response.stime);
	});

	socket.emit("ping", { stime: new Date().getTime() });

	socket.on("move", function(keycode) {
		world[0].dx = 0;
		world[0].dy = 0;

		switch(keycode) {
			case 37:
				world[0].dx = -VEL;
			break;

			case 38:
				world[0].dy = -VEL;
			break;

			case 39:
				world[0].dx = VEL;
			break;

			case 40:
				world[0].dy = VEL;
			break;
		}
	});

	socket.on("disconnect", function() {
	});
});

setInterval(function() {
	send_update();
}, 1000 / UPS);

function send_update() {
	var new_clock = new Date().getTime();
	var dt = (new_clock - clock) / 1000.0;
	clock = new_clock;

	for( var i = 0; i < world.length; i++ ) {
		world[i].x += world[i].dx * dt;
		world[i].y += world[i].dy * dt;
	}

	io.sockets.emit("update", {
		stime: clock,
		world: world
	});
}

function random(min, max) {
		return ~~(min + ( max - min ) * Math.random());
}

