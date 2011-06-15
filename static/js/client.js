
var game_objects = {};

window.onload = function() {
	var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 400;
	var socket = new io.Socket(location.hostname, {port: 1234});

	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas();

	Crafty.stage.elem.style.background = "#eee";

	Crafty.scene("game", function() {
		Crafty.c("bomberman", {
			init: function() {
				if( !this.has("color") ) {
					this.addComponent("color");
				}

				this.attr({
					x: 0,
					y: 0,
					w: 10,
					h: 10
				})
				.color("blue");
			}
		});

		Crafty.e("player, bomberman, ServerControls, controls")
		.attr({
			x: 0,
			y: 0,
			session_id: null
		})
		.bind("enterframe", function() {
		});
	});

	socket.connect();

	socket.on("connect", function() {
		socket.send({up: true});
	});

	socket.on("message", function(msg) {
		var game_state = JSON.parse(msg);
		for( var i = 0 ; i < game_state.length ; i++ ) {
			var obj = game_state[i];

			if( game_objects[obj.object_id] ) {
				console.log(".");
			} else {
				game_objects[obj.object_id] = {};
				console.log("create " + obj.object_id);
			}
		}
	});

	socket.on("disconnect", function() {
		console.log("disconnect!");
	});

	Crafty.c ("ServerControls", {
		init : function () {
			var __controls = {
				left : false,
				right : false,
				up : false,
				down: false,
				space : false
			};

			if (!this.has('controls')) {
				this.addComponent ('controls');
			}
			this.bind ("keyup", function (e) {
				if (e.keyCode == Crafty.keys.UP_ARROW) {
					__controls.up = false;
				}
				if (e.keyCode == Crafty.keys.DOWN_ARROW) {
					__controls.down = false;
				}
				if (e.keyCode == Crafty.keys.LEFT_ARROW) {
					__controls.left = false;
				}
				if (e.keyCode == Crafty.keys.RIGHT_ARROW) {
					__controls.right = false;
				}
				if (e.keyCode == Crafty.keys.SPACE) {
					__controls.space = false;
				}
			});
			this.bind("keydown", function (e) {
				if (e.keyCode == Crafty.keys.UP_ARROW) {
					__controls.up = true;
				}
				if (e.keyCode == Crafty.keys.DOWN_ARROW) {
					__controls.down = true;
				}
				if (e.keyCode == Crafty.keys.LEFT_ARROW) {
					__controls.left = true;
				}
				if (e.keyCode == Crafty.keys.RIGHT_ARROW) {
					__controls.right = true;
				}
				if (e.keyCode == Crafty.keys.SPACE) {
					__controls.space = true;
				}
			});


			this.bind ("enterframe", function (e) {
				socket.send (__controls);
			});
			return this;
		}
	});


	Crafty.scene("game");
};



