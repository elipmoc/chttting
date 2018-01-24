const logDB = require('./logDB.js');
const myRouter = require("./myRouter.js");
const {
    Client
} = require('pg');

//ポート指定
const webPort = process.env.PORT || 3000;

//データベースの接続設定
var rondai = "";
let room_list = new Array();
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});


client.connect();
client.query("select room_name,room_type from room;", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        room_list.push({
            room_name: row["room_name"],
            room_type: row["room_type"]
        });
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
    const namespace = io.of("/loadRoomStream");
    namespace.on('connection', socket => {
        socket.on(
            'loadRoom',
            function(data) {
                socket.emit('loadRoom', JSON.stringify(room_list));
            });
    });

}

//議題を定義するためのソケットを定義
function debateTitleSocket() {
    io.on("connection", (socket) => {
        socket.on("titleSend", (title) => {
            socket.emit("titleSend", title);
            rondai = title;
        });
    });
}

function firstAccessSocket() {
    const firstStream = io.of("/firstLoadStream");
    firstStream.on("connection", (scoket) => {
        socket.on("firstSend", (data) => {
            socket.emit("firstSend", rondai);
        });
    });
}


//チャットをするためのソケット群
function chatSocket(namespace) {
    return function(socket) {
        //ログ管理
        socket.on(
            'msg',
            function(data) {
                console.log("msg:" + data);
                namespace.emit('msg', data);
                logDB.logPush(namespace.name, data);
            }
        );
        //発言するためのソケット
        socket.on(
            'initMsg',
            function(data) {
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
    room_list.map(room => room.room_name).forEach((x) => {
        let namespace = io.of("/" + x);
        namespace.on('connection', chatSocket(namespace));
        namespaceList[x] = namespace;
    });
}


//関数呼び出し
debateTitleSocket();
loadRoomSocket();
firstAccessSocket();

//listen
http.listen(webPort);
