
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

  Crafty.scene("game");
};

