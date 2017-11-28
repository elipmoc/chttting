var sys = require('sys');
var http = require('http');
var server = http.createServer(
    function (request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World!!');
        response.end();
    }
).listen(3000);
sys.log('Server running at http://0.0.0.0:3000/');
