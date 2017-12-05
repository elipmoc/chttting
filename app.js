var html = require('fs').readFileSync('index.html');
var logging =require('fs').readFileSync('logging.js');

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

var io = require('socket.io')(http);
var webPort = process.env.PORT || 3000;
http.listen(webPort);
io.on(
    'connection',
    function (socket) {
        socket.on(
            'msg',
            function (data) {
              if(data == "810")
              {
                var yj = '<img src="http://810.jpg">'
                io.emit('msg',yj);
              }else {
                io.emit('msg', data);
              }

            }
        );
    }
);

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
