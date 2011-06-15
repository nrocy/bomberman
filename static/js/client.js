
window.onload = function() {
  var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 400;

  Crafty.init(SCREEN_WIDTH, SCREEN_HEIGHT);
  Crafty.canvas();

  Crafty.stage.elem.style.background = "#eee";

  Crafty.scene("game", function() {
    console.log("crafty start");
  });

  var socket = new io.Socket(location.hostname, {port: 1234});

  socket.connect();
  socket.on("connect", function() {
    console.log("connect!");
  });
  socket.on("message", function(msg) {
    console.log("received: " + msg);
  });
  socket.on("disconnect", function() {
    console.log("disconnect!");
  });

  Crafty.scene("game");
};

