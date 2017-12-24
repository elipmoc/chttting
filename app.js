var html = require('fs').readFileSync('main.html');
var dip = require('fs').readFileSync('dip.html');
var main = require('fs').readFileSync('main.html');
var logging = require('fs').readFileSync('logging.js');
var sys = require('util');
const {
    URL
} = require('url');
var qs = require('querystring');
var pg = require('pg');


const {
    Client
} = require('pg');

var room_name_list = new Array();
var testStr = "tintin";
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

client.query("select room_name from room;", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        room_name_list.push(row["room_name"]);
    }
    makenamespace();
    client.end();
});


var http = require('http').createServer(
    function(req, res) {

        var url = req.url;
        if (req.method == 'GET') {
            var url_parts = new URL("https://serene-fjord-98327.herokuapp.com" + url);
            //console.log(url_parts);
            //url_parts = "http://google.com/?name=a";
            url = url_parts.pathname;
            console.log(url_parts.search);
        }

        if ('/' == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(html);
        } else if ('/logging.js' == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(logging);
        } else if ("/main.html" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(main);
        }else if ("/dip.html" == url) {
          res.writeHead(200,{
            'Content-Type' : 'text/html'
          });
          res.end(dip);
        }
    }
);
const io = require('socket.io')(http);

//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

//クライアントソケットの応答処理
function socketOn(namespace) {
    return function(socket) {
        socket.on(
            'msg',
            function(data) {
                if (data == "810") {
                    var yj = '<img src="http://810.jpg">'
                    namespace.emit('msg', yj);
                } else
                    namespace.emit('msg', data);
            }
        );
    }
}

//roomNameListから各種ソケットの名前空間リストを生成
function makenamespace() {
    room_name_list.forEach(function(x) {
        let namespace = io.of("/" + x);
        namespace.on('connection', socketOn(namespace));
        namespaceList[x] = namespace;
    });
}

var webPort = process.env.PORT || 3000;
var adminNamespace = io.of("/admin");
http.listen(webPort);
adminNamespace.on(
    'connection',
    function(socket) {
        socket.on(
            'msg',
            function(data) {
                adminNamespace.emit('msg', /*testStr*/ data + String(url_parts.query));
                switch (url_parts.query) {
                    case "room_admin":
                        adminNamespace.emit('msg', data + String(url_parts.query));
                        break;
                }
            }
        );
    }
);
