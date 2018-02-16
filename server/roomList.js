const createRoomDB = require("./createRoomDB.js");
const chatSocketBase = require('./chatSocketBase.js');
const escape = require('escape-html');
const debate = require("./debateSocket.js");
const movie = require("./movieSocket.js");
const getDbClient = require("./getDbClient.js");
const officialDebate = require("./officialDebateSocket.js");

let room_list = new Array();
//名前空間のリスト。いまはまだ使いみちがない
let namespaceList = new Array();

//部屋を新しく作成する
function addRoom(roomName, roomType, description, mainSocket) {
    room_list.push({ room_name: roomName, room_type: roomType, description: description });
    let namespace = mainSocket.of("/" + roomName);
    if (roomType == "discussion_free") {
        let discussionNameSpace = new debate.DiscussionNameSpace(namespace);
        let connectEvent2 = new chatSocketBase.chatBaseNameSpace(namespace).connectEvent;
        namespace.on('connection', (socket) => {
            discussionNameSpace.connectEvent(socket);
            connectEvent2(socket);
        });
    }
    else if (roomType == "official_debate") {
        let officialDebateNameSpace = new officialDebate.OfficialDiscussionNameSpace(namespace);
        let connectEvent2 = new chatSocketBase.chatBaseNameSpace(namespace).connectEvent;
        namespace.on('connection', (socket) => {
            officialDebateNameSpace.connectEvent(socket);
            connectEvent2(socket);
        });
    }
    else if (roomType == "movie") {
        let connectEvent = new movie.movieNameSpace(namespace).connectEvent;
        let connectEvent2 = new chatSocketBase.chatBaseNameSpace(namespace).connectEvent;
        namespace.on('connection', (socket) => {
            connectEvent(socket);
            connectEvent2(socket);
        });
    }
    else {
        let connectEvent = new chatSocketBase.chatBaseNameSpace(namespace).connectEvent;
        namespace.on('connection', connectEvent);
        namespace.on('connection', (socket) => console.log("sososfos"));
    }
    namespaceList[roomName] = namespace;
}

function initRoomList(mainSocket) {
    const client = getDbClient.get();
    client.connect();
    client.query("select room_name ,room_type ,description from room;", (err, res) => {
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
            let roomInfo = data["roomInfo"];
            console.log(JSON.stringify(roomInfo));
            createRoomDB.createRoom(roomName, roomType, description, roomInfo)
                .then(() => {
                    addRoom(roomName, roomType, description, mainSocket);
                    socket.emit("created", "");
                })
                .catch((err) => socket.emit("created", "部屋作成に失敗しました。"));
        });
    });
    return roomCreateSocket;
}
