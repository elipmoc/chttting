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