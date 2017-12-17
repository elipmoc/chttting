var html = require('fs').readFileSync('index.html');
<<<<<<< HEAD
var logging = require('fs').readFileSync('logging.js');
/*const {Client} = require('pg');
const client = new Client();

await client.connect()
const res = await client.query('SELECT $1::text as message', ['Hello world!'])
await client.end()
*/
=======
var logging =require('fs').readFileSync('logging.js');

>>>>>>> af051038ad84c45c7081d2512fb66f090db5d70e
var http = require('http').createServer(
    function (req, res) {
      var url = req.url;
        if ('/' == url) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(html);
        } else if ('/logging.js' == url) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(logging);
<<<<<<< HEAD
        }
    }
);
const io = require('socket.io')(http);
const adminNamespace = io.of('/admin');

=======
        }          
    }
);

var io = require('socket.io')(http);
>>>>>>> af051038ad84c45c7081d2512fb66f090db5d70e
var webPort = process.env.PORT || 3000;

http.listen(webPort,"0.0.0.0");
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
