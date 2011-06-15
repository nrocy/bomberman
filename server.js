
var http = require("http"),
  io = require("socket.io"),
  sys = require("sys"),
  nodestatic = require("node-static");

var static_server = new nodestatic.Server(".");

var server = http.createServer(function(req, res) {
  var url = require("url").parse(req.url);
  var pathfile = url.pathname;

  if( pathfile.search(/^\/static\//) === 0 ) {
    static_server.serve(req, res);
  } else {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end("<h1>Hello, world!</h1>");
  }
});

server.listen(1234);

var socket = io.listen(server);
socket.on("connection", function(client) {
  client.send("hello!");

  client.on("message", function(msg) {
    sys.log("server received: " + msg);
    socket.broadcast(msg);
  });

  sys.log("client connected");
});

sys.puts("running...");

