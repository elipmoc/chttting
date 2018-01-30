const createRoomDB = require("./createRoomDB.js");
const logDB = require('./logDB.js');
const escape = require('escape-html');
const discussion = require("./discussionSocket.js");



const {
    Client
} = require('pg');

let room_list = new Array();
//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

//部屋を新しく作成する
function addRoom(roomName, roomType, mainSocket) {
    room_list.push({ room_name: roomName, room_type: roomType });
    let namespace = mainSocket.of("/" + roomName);
    if (roomType = "discussion_free") {
        namespace.on('connection', (socket) => {
            chatSocket(namespace)(socket);
            new discussion.bindDiscussionSocket(namespace).event(socket);
        });
    }
    else
        namespace.on('connection', chatSocket(namespace));
    namespaceList[roomName] = namespace;
}


//チャットをするためのソケット群
function chatSocket(namespace) {
    return function (socket) {
        //ログ管理
        socket.on(
            'msg',
            function (data) {
                data = JSON.parse(data);
                if (data["msg"].length > 500)
                    return;
                namespace.emit('msg', data["msg"]);
                if (data["logSaveFlag"])
                    logDB.logPush(namespace.name, data["msg"]);
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

function initRoomList(mainSocket) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    client.connect();
    client.query("select room_name,room_type from room;", (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            addRoom(row["room_name"], row["room_type"], mainSocket);
        }
        client.end();
    });
}

//部屋の情報を返す
exports.getRoomList = () => {
    return room_list;
}

//部屋を作成するためのソケット
exports.createRoomCreateSocket = (mainSocket) => {
    initRoomList(mainSocket);
    const roomCreateSocket = mainSocket.of("/roomCreate");
    roomCreateSocket.on("connection", (socket) => {
        socket.on("create", (data) => {
            data = JSON.parse(data);
            let roomName = escape(data["roomName"]);
            let roomType = escape(data["roomType"]);
            createRoomDB.createRoom(roomName, roomType, (flag) => {
                if (flag) {
                    addRoom(roomName, roomType, mainSocket);
                    socket.emit("created", "");
                }
                else {
                    socket.emit("created", "部屋の作成に失敗しました");
                }
            });

        });
    });
    return roomCreateSocket;
}