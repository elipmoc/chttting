var html = require('fs').readFileSync('main.html');
var arrow = require('fs').readFileSync('commentArrow.js');
var loadRoomJs = require('fs').readFileSync('loadRoomList.js');
var filter = require('fs').readFileSync('commandFilter.js');
var syamu = require('fs').readFileSync('syamu.html');
var dip = require('fs').readFileSync('dip.html');
var main = require('fs').readFileSync('main.html');
var logging = require('fs').readFileSync('logging.js');
var chatConnection = require('fs').readFileSync('chatConnection.js');
var logDB = require('./logDB.js');
var sys = require('util');
const {
    URL
} = require('url');
var qs = require('querystring');
var pg = require('pg');
const {
    Client
} = require('pg');

//データベースの接続設定
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
    makeNameSpace();
    client.query("insert into msg (msg_data) values ('114514');", (err, res) => {
        if (err) throw err;
        console.log(res.rows["msg_id"]);
        client.end();
    });
    // client.end();
});



var http = require('http').createServer(
    function (req, res) {
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
        } else if ("/dip.html" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(dip);
        } else if ("/syamu.html" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(syamu);
        } else if ("/commentArrow.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(arrow);
        } else if ("/commandFilter.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(filter);
        } else if ("/chatConnection.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(chatConnection);
        } else if ("/loadRoomList.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(loadRoomJs);
        }
    }
);
const io = require('socket.io')(http);

//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

function loadRoomSocket() {
    let namespace = io.of("/loadRoomStream");
    socket.on(
        'loadRoom',
        function (data) {
            namespace.emit('loadRoom', JSON.stringify(room_name_list));
        }
    )
}

//クライアントソケットの応答処理
function socketOn(namespace) {
    return function (socket) {
        socket.on(
            'msg',
            function (data) {
                console.log("msg:" + data);
                namespace.emit('msg', data);
                logDB.logPush(namespace.name, data);
            }
        );

        socket.on(
            'initMsg',
            function (data) {
                console.log("initmsg:" + data);
                socket.emit(
                    'initMsg',
                    JSON.stringify(logDB.logRead(namespace.name))
                );
            }
        );
    }
}

//roomNameListから各種ソケットの名前空間リストを生成
function makeNameSpace() {
    room_name_list.forEach(function (x) {
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
    function (socket) {
        socket.on(
            'msg',
            function (data) {
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
