
var UPS = 1;
var VEL = 20;
var latency = {};

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

	latency[socket.id] = [];

	socket.on("pong", function(response) {
		var actual_latency, tmp, i, now = new Date().getTime();
		latency[socket.id].push(now - response.stime);
		if( latency[socket.id].length < 5 ) {
			socket.emit("ping", { stime: now });
		} else {
			var samples = latency[socket.id];
			samples.sort(function(a, b) { 
				return a - b;
			});

			var median = samples[2];
			for( i = 0, mean = 0 ; i < samples.length ; i++ ) {
				mean += samples[i];
			}

			mean /= samples.length;

			for( i = 0, std_dev = 0 ; i < samples.length ; i++ ) {
				tmp = samples[i] - mean;
				std_dev += (tmp * tmp);
			}

			std_dev /= (samples.length - 1);
			std_dev = Math.sqrt(std_dev);
			
			for( i = 0, actual_latency = [] ; i < samples.length ; i++ ) {
				if( (samples[i] > (median - std_dev)) && (samples[i] < (median + std_dev)) ) {
					actual_latency.push(samples[i]);
				}
			}

			var player_latency = 0;
			for( i = 0 ; i < actual_latency.length ; i++ ) {
				player_latency += actual_latency[i];
			}

			player_latency /= actual_latency.length;
			//console.log(latency, actual_latency, player_latency);

			latency[socket.id] = [];

			socket.emit("rtt", Math.ceil(player_latency / 2));
		}
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

setInterval(function() {
	io.sockets.emit("ping", {
		stime: clock
	});
}, 5000);

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

