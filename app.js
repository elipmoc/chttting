var sys = require('sys');
var http = require('http');
var fs = require('fs');

var server = http.createServer();
server.on('request',doRequest);

function doRequest(req,res){
  fs.readFile('index.html','utf-8',doReard);

  function doReard(err,data){
    res.writeHead(200,{'Content-Type':'text/html'})
    res.write(data);
    res.end();
  }
}
server.listen(process.env.PORT || 3000);
sys.log('Server running at http://0.0.0.0:3000/');
