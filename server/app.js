const html = require('fs').readFileSync('main.html');
const arrow = require('fs').readFileSync('commentArrow.js');
const loadRoomJs = require('fs').readFileSync('loadRoomList.js');
const filter = require('fs').readFileSync('commandFilter.js');
const syamu = require('fs').readFileSync('syamu.html');
const main = require('fs').readFileSync('main.html');
const normalChatRoomHtml = require('fs').readFileSync('normalChatRoom.html');
const normalChatRoomJs = require('fs').readFileSync('normalChatRoom.js');
const logging = require('fs').readFileSync('logging.js');
const chatConnection = require('fs').readFileSync('chatConnection.js');
const logDB = require('./logDB.js');
const sys = require('util');
const getParameter = require('fs').readFileSync('getUrlParam.js');
const index = require('fs').readFileSync('index.html');
const dip = require('fs').readFileSync('dip.html');
const qs = require('querystring');

const {
    URL
} = require('url');
const {
    Client
} = require('pg');

//データベースの接続設定
const room_name_list = new Array();
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
    client.end();
});


let http = require('http').createServer(
    function (req, res) {
        let url = req.url;
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
        } else if ("/normalChatRoom.html" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(normalChatRoomHtml);
        }
        else if ("/normalChatRoom.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(normalChatRoomJs);
        } else if ("/index.html" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(index);
        } else if ("/getUrlParam.js" == url) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(getParameter);
        }
    }
);
const io = require('socket.io')(http);

//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

//ルーム一覧を表示するソケットを定義
function loadRoomSocket() {
    let namespace = io.of("/loadRoomStream");
    namespace.on('connection', socket => {
        socket.on(
            'loadRoom',
            function (data) {
                socket.emit('loadRoom', JSON.stringify(room_name_list));
            });
    });

}
//議題を定義するためのソケットを定義
function debateTitleSocket() {
    io.on("connection", (socket) => {
        socket.on("titleSend", (title) => {
            io.emit("titleSend", title);
        });
    });
}


//チャットをするためのソケット群
function chatSocket(namespace) {
    return function (socket) {
        //ログ管理
        socket.on(
            'msg',
            function (data) {
                console.log("msg:" + data);
                namespace.emit('msg', data);
                logDB.logPush_div(namespace.name, data);
            }
        );
        //発言するためのソケット
        socket.on(
            'initMsg',
            function (data) {
                console.log("initmsg:" + data);
                socket.emit(
                    'initMsg',
                    logDB.logRead_div(namespace.name, msgList =>
                        socket.emit('initMsg', JSON.stringify(msgList))
                    )
                );
            }
        );
    };
}

//roomNameListから各種ソケットの名前空間リストを生成
function makeNameSpace() {
    room_name_list.forEach(function (x) {
        let namespace = io.of("/" + x);
        namespace.on('connection', chatSocket(namespace));
        namespaceList[x] = namespace;
    });
}


//関数呼び出し
debateTitleSocket();
loadRoomSocket();
const webPort = process.env.PORT || 3000;
http.listen(webPort);
