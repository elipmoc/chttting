const createRoomDB = require("./createRoomDB.js");
const {
    Client
} = require('pg');

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


//部屋の情報を返す
exports.getRoomList = () => {
    return room_list;
}

//部屋を作成するためのソケット
exports.createRoomCreateSocket = (mainSocket) => {
    const roomCreateSocket = mainSocket.of("/roomCreate");
    roomCreateSocket.on("connection", (socket) => {
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
    return roomCreateSocket;
}