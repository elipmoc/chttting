var html = require('fs').readFileSync('index.html');
var logging = require('fs').readFileSync('logging.js');

var http = require('http').createServer(
    function (req, res) {
      var url = req.url;
        if ('/' == url) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);
        } else if ('/logging.js' == url) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(logging);
        }
    }
);
const io = require('socket.io')(http);
const adminNamespace = io.of('/admin');

var webPort = process.env.PORT || 3001;

http.listen(webPort);
adminNamespace.on(
    'connection',
    function (socket) {
        socket.on(
            'msg',
            function (data) {
              adminNamespace.emit('msg', data);
            }
        );
    }
);
