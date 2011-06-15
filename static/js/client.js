window.onload = function() {
  var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 400;
  var socket = new io.Socket(location.hostname, {port: 1234});

  Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
  Crafty.canvas();

  Crafty.stage.elem.style.background = "#eee";

  Crafty.scene("game", function() {
    Crafty.e("player")
      .attr({
        x: 0,
        y: 0
      })
      .bind("enterframe", function() {
        socket.send({up: true});
      })
  });

  var socket = new io.Socket(location.hostname, {port: 1234});

  socket.connect();

  socket.on("connect", function() {
    console.log("connect!");


  });

  socket.on("message", function(msg) {
    var game_state = JSON.parse(msg);
    for( var i = 0 ; i < game_state.length ; i++ ) {
      var obj = game_state[i];
      console.log(obj.type + " " + obj.object_id + ": (" + obj.pos.x + "," + obj.pos.y + ")");
    }
  });

  socket.on("disconnect", function() {
    console.log("disconnect!");
  });

  Crafty.c ("ServerControls", {
			__controls : {
						left : false,
						right : false,
						up : false,
						down: false,
						space : false
			},
			ServerControls : function () {
				console.log("Initialise ServerControls");
				this.bind ("keydown", function (e) {
						__controls.up = __controls.down = __controls.left = __controls.right = false;
						if (e.keyCode == Crafty.keys.UP) {
							__controls.up = true;
						}
						if (e.keyCode == Crafty.keys.DOWN) {
							__controls.down = true;
						}
						if (e.keyCode == Crafty.keys.LEFT) {
							__controls.left = true;
						}
						if (e.keyCode == Crafty.keys.RIGHT) {
							__controls.right = true;
						}
						if (e.keyCode == Crafty.keys.SPACE) {
							__controls.space = true;
						}
						socket.send (__controls);
				});
				this.bind ("keyup", function (e) {
						if (e.keyCode == Crafty.keys.UP) {
							__controls.up = false;
						}
						if (e.keyCode == Crafty.keys.DOWN) {
							__controls.down = false;
						}
						if (e.keyCode == Crafty.keys.LEFT) {
							__controls.left = false;
						}
						if (e.keyCode == Crafty.keys.RIGHT) {
							__controls.right = false;
						}
						if (e.keyCode == Crafty.keys.SPACE) {
							__controls.space = true;
						}
				});
				return this;
			}
	});


  Crafty.scene("game");
};



