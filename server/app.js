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
