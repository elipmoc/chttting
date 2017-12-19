var html = require('fs').readFileSync('index.html');
var logging = require('fs').readFileSync('logging.js');
var pg = require('pg');


const {Client} =  require('pg');

var testStr = "";
const client = new Client({
  connectionString:process.env.DATABASE_URL,
  ssl:true,
});

client.connect();

client.query('select rn from ten;',(err,res)=>{
    if (err) throw err;
  for(let row of res.rows){
    testStr += JSON.stringify(row);
  }
  client.end();
});


var http = require('http').createServer(
    function (req, res) {
      var url = req.url;
      var qu = client.query('select *from juse');
      console.log(qu);
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
              adminNamespace.emit('msg',testStr+ data);
            }
        );
    }
);
