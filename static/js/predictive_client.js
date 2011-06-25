
var world = [];
var server_world = [];
var FPS = 30;
var ctx;
var server_clock;
var clock = new Date().getTime();

var VEL = 20;

function init_canvas() {
	var c = document.getElementById("canvas");
	c.width = 400; 
	c.height = 400;

	ctx = c.getContext("2d");
}

function update_world() {
	var new_clock = new Date().getTime();
	var dt = (new_clock - clock) / 1000.0;
	clock = new_clock;

	shared.update_world(world, dt);
}

function draw_item(item, col) {
	ctx.strokeStyle = col;

	ctx.beginPath();
	ctx.arc(item.x, item.y, 5, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.stroke();

	var tx = item.dx < 0 ? -1 : (item.dx > 0 ? 1 : 0);
	var ty = item.dy < 0 ? -1 : (item.dy > 0 ? 1 : 0);

	ctx.beginPath();
	ctx.moveTo(item.x, item.y);
	ctx.lineTo(item.x + 10 * tx, item.y + 10 * ty);
	ctx.closePath();
	ctx.stroke();
}

window.onload = function() {
	init_canvas();

	var socket = io.connect("http://" + location.hostname + ":1234/");

	$(document).keyup(function(event) {
		var keycode = event.keyCode;
		socket.emit("move", keycode);

		if( world.length > 0 ) {
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
		}
	});

	socket.on("connect", function() {
	});

	socket.on("message", function(msg) {
	});

	socket.on("ping", function(request) {
		socket.emit("pong", request);
	});

	socket.on("rtt", function(rtt) {
		$("#debug").html("Latency: " + rtt + "ms");
	});

	socket.on("update", function(state) {
		server_clock = state.clock;
		server_world = state.world;
		if( world.length === 0 ) {
			world = JSON.parse(JSON.stringify(server_world));
		} else {
			world[0].dx = server_world[0].dx;
			world[0].dy = server_world[0].dy;
		}
	});

	socket.on("disconnect", function() {
		console.log("disconnected");
	});

	var i;
	setInterval(function() {
		update_world();

		ctx.fillStyle = "#eee";
		ctx.fillRect(0, 0, 400, 400);

		for( i = 0; i < world.length; i++ ) {
			draw_item(world[i], "#222");
		}

		for( i = 0; i < server_world.length; i++ ) {
			draw_item(server_world[i], "#bbb");
		}
	}, 1000 / FPS);
}

