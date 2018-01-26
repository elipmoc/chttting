const logDB = require('./logDB.js');
const myRouter = require("./myRouter.js");
const roomCreate = require("./roomCreate.js");
const {
    Client
} = require('pg');

const escape = require('escape-html');

//データベースの接続設定
let debate_title = "øphi-chat *debate";


const http = require('http').createServer(
    myRouter.createRouter()
);
const io = require('socket.io')(http);

//ルーム一覧を表示するソケットを定義
function loadRoomSocket() {
    const namespace = io.of("/loadRoomStream");
    namespace.on('connection', socket => {
        socket.on(
            'loadRoom',
            function (data) {
                socket.emit('loadRoom', JSON.stringify(roomCreate.getRoomList()));
            });
    });

}

//議題を定義するためのソケットを定義
function debateTitleSocket() {
    io.on("connection", (socket) => {
        socket.on("titleSend", (title) => {
            socket.emit("titleSend", title);
            debate_title = title;
        });
    });
}

function firstAccessSocket() {
    const firstStream = io.of("/firstLoadStream");
    firstStream.on("connection", (socket) => {
        socket.on("firstSend", (data) => {
            socket.emit("firstSend", debate_title);
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
                if (data.length > 100)
                    return;
                namespace.emit('msg', data);
                logDB.logPush(namespace.name, data);
            }
        );
        //発言するためのソケット
        socket.on(
            'initMsg',
            function (data) {
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

//関数呼び出し
debateTitleSocket();
loadRoomSocket();
firstAccessSocket();
roomCreate.initRoom(io);
const roomCreateSocket = roomCreate.createRoomCreateSocket(io);

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
