let debate_title = {};

//議題を定義するためのソケットを定義
exports.debateTitleSocket = (mainSocket) => {
    mainSocket.on("connection", (socket) => {
        socket.on("titleSend", (title) => {
            let title_data = JSON.parse(title);
            socket.emit("titleSend", title_data["debate_title"]);
            debate_title[title_data["room_name"]] = title_data["debate_title"];
        });
    });
}

exports.firstAccessSocket = (mainSocket) => {
    const firstStream = mainSocket.of("/firstLoadStream");
    firstStream.on("connection", (socket) => {
        socket.on("firstSend", (data) => {
            socket.emit("firstSend", JSON.stringify(debate_title));
        });
    });
    return firstStream;
}