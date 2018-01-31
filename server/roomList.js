const createRoomDB = require("./createRoomDB.js");
const chatSocketBase = require('./chatSocketBase.js');
const escape = require('escape-html');
const discussion = require("./discussionSocket.js");
const getDbClient = require("./getDbClient.js");

let room_list = new Array();
//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

//部屋を新しく作成する
function addRoom(roomName, roomType, description, mainSocket) {
    room_list.push({ room_name: roomName, room_type: roomType, description: description });
    let namespace = mainSocket.of("/" + roomName);
    if (roomType = "discussion_free") {
        let event = new discussion.DiscussionNameSpace(namespace).event;
        namespace.on('connection', (socket) => {
            chatSocketBase.chatSocket(namespace)(socket);
            event(socket);
        });
    }
    else
        namespace.on('connection', chatSocketBase.chatSocket(namespace));
    namespaceList[roomName] = namespace;
}

function initRoomList(mainSocket) {
    const client = getDbClient.get();
    client.connect();
    client.query("select room_name room_type description from room;", (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            addRoom(row["room_name"], row["room_type"], row["description"], mainSocket);
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
            let description = escape(data["description"]);
            createRoomDB.createRoom(roomName, roomType, description, (flag) => {
                if (flag) {
                    addRoom(roomName, roomType, description, mainSocket);
                    socket.emit("created", "");
                }
                else {
                    socket.emit("created", "部屋の作成に失敗しました。");
                }
            });

        });
    });
    return roomCreateSocket;
}
