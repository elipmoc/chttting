var html = require('fs').readFileSync('index.html');
var logging = require('fs').readFileSync('logging.js');
var {Pool,Client} = require('pg');
const postring = "postgres://cnoqoxqavuubfy:b831a9f787f1f394987277635cdcb73abf68cb73daeccc0b50cdadf95f83575c@ec2-54-83-194-208.compute-1.amazonaws.com:5432/dc8lm58eis0g00";

const pool = new Pool ({
  postring:postring,
});

pool.query('SELECT NOW()',(err,res)=>{
  console.log(err, res)
pool.end();
});

const client = new Client({
  postring:postring,
});

client.connect();
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
});

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

var webPort = process.env.PORT || 3000;

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
