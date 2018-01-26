const logDB = require('./logDB.js');
const myRouter = require("./myRouter.js");
const createRoomDB = require("./createRoomDB.js");
const {
    Client
} = require('pg');

const escape = require('escape-html');

//データベースの接続設定
let debate_title = "øphi-chat *debate";
let room_list = new Array();

//部屋を新しく作成する
function addRoom(roomName, roomType) {
    room_list.push({ room_name: roomName, room_type: roomType });
    let namespace = io.of("/" + roomName);
    namespace.on('connection', chatSocket(namespace));
    namespaceList[roomName] = namespace;
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();
client.query("select room_name,room_type from room;", (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        addRoom(row["room_name"], row["room_type"]);
    }
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
            function (data) {
                socket.emit('loadRoom', JSON.stringify(room_list));
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

//部屋を作成するためのソケット
function roomCreateSocket() {
    const firstStream = io.of("/roomCreate");
    firstStream.on("connection", (socket) => {
        socket.on("create", (data) => {
            data = JSON.parse(data);
            let roomName = escape(data["roomName"]);
            let roomType = escape(data["roomType"]);
            createRoomDB.createRoom(roomName, roomType, (flag) => {
                if (flag) {
                    addRoom(roomName, roomType);
                    socket.emit("created", "");
                }
                else {
                    socket.emit("created", "部屋の作成に失敗しました");
                }
            });

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
roomCreateSocket();

//ポート指定
const webPort = process.env.PORT || 3000;
//listen
http.listen(webPort);
