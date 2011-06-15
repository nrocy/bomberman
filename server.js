
var UPDATES_PER_SEC = 1;
var json = JSON.stringify;

var game_state = [
  /*
  { object_id: 1, type: "player", pos: {x: 1, y: 1}, created_at: 1, dead: false },
  { object_id: 2, type: "player", pos: {x: 2, y: 2}, created_at: 2, dead: false },
  { object_id: 1, type: "bomb",   pos: {x: 2, y: 3}, created_at: 4, dead: false }
  */
];

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

  game_state.push({
    object_id: client.sessionId, 
    type: "player", 
    pos: {x: 1, y: 1}, 
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

