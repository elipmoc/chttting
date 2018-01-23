const logDB = require('./logDB.js');
const myRouter = require("./myRouter.js");
const { Client } = require('pg');

//データベースの接続設定
const room_name_list = new Array();
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


client.connect();
client.query("select room_name,room_type from room;", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        room_name_list.push(row["room_name"]);
    }
    makeNameSpace();
    client.end();
});


const http = require('http').createServer(
    myRouter.createRouter()
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
                logDB.logPush(namespace.name, data);
            }
        );
        //発言するためのソケット
        socket.on(
            'initMsg',
            function (data) {
                console.log("initmsg:" + data);
                socket.emit(
                    'initMsg',
                    logDB.logRead(namespace.name, msgList =>
                        socket.emit('initMsg', JSON.stringify(msgList))
                    )
                );
            }
        );
    };
}

//roomNameListから各種ソケットの名前空間リストを生成  *
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
