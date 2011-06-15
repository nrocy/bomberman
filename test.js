
var http = require("http"),
  io = require("socket.io"),
  sys = require("sys"),

server = http.createServer(function(req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("<h1>Hello, world!</h1>");
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

