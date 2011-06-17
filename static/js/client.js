
var game_objects = {};

window.onload = function() {
	var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 400;
	var socket = new io.Socket(location.hostname, {port: 1234});

	Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
	Crafty.canvas();

	Crafty.stage.elem.style.background = "#eee";

	Crafty.load(["images/bomberman.png"], function() {
		Crafty.sprite(1, "images/bomberman.png", {
			s_bomberman: [0, 0, 16, 24]
		}, 9, 9);
	});

	Crafty.scene("game", function() {
		Crafty.c("bomberman", {
			init: function() {
				if( !this.has("2D") ) {
					this.addComponent("2D");
				}

				if( !this.has("Canvas") ) {
					this.addComponent("Canvas");
				}

				if( !this.has("color") ) {
					this.addComponent("color");
				}

				if( !this.has("animate") ) {
					this.addComponent("animate");
				}

				this.attr({
					x: 0,
					y: 0,
					w: 10,
					h: 10
				})
				.color("red");
			}
		});

		Crafty.c ("bomb", {
			init: function () {
				if (!this.has("2D")) {
					this.addComponent ("2D");
				}
				if (!this.has("Canvas")) {
					this.addComponent ("Canvas");
				}
				if (!this.has("color")) {
					this.addComponent ("color");
				}

				this.attr ({
					x: 0,
					y: 0,
					w: 10,
					h: 10
				})
				.color ("green");
			}
		});

		Crafty.c ("softwall", {
			init: function () {
			}
		});

		Crafty.c ("hardwall", {
			init: function () {
			}
		});	

		Crafty.e("ServerControls, controls")
			.bind("enterframe", function() {
			});
	});

	socket.connect();

	socket.on("message", function(msg) {
		var game_state = JSON.parse(msg);
		for( var i = 0 ; i < game_state.length ; i++ ) {
			var obj = game_state[i];

			if( !game_objects[obj.object_id] && !obj.dead ) {
				var components = (obj.type === "bomberman" ? "bomberman, s_bomberman" : "bomb");

				game_objects[obj.object_id] = 
					Crafty.e(components)
						.attr({x: obj.pos.x, y: obj.pos.y});

				console.log("new game object: " + obj.object_id);
			} else {
				if( obj.dead ) {
					console.log (obj.type);
					game_objects[obj.object_id].destroy();
					delete game_objects[obj.object_id];
				} else {
					game_objects[obj.object_id].attr({x: obj.pos.x, y: obj.pos.y});
				}
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



