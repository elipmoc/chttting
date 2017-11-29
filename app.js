var sys = require('sys');
var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server = http.createServer();
server.on('request',doRequest);

function doRequest(req,res){
  fs.readFile('index.html','utf-8',doReard);

  function doReard(err,data){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write("unko");
    res.write(data);
    res.end();
  }
}
server.listen(process.env.PORT || 3000);

var io = socketio.listen(server);

io.sockets.on('connection',function(socket){
  socket.on('c2s_message',{value:data.value});
});

socket.on('c2s_broadcast',function(data){
  socket.broadcast.emit('s2c_message',{value:data.value});
});

sys.log('Server running at http://0.0.0.0:3000/');
