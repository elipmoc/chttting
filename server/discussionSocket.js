let debate_title = {};

//議題を定義するためのイベントをソケットにバインド
exports.bindDiscussionSocket = (namespace) => {
    return (socket) => {
        socket.on("titleSend", (title) => {
            let title_data = JSON.parse(title);
            namespace.emit("titleSend", title_data["debate_title"]);
            debate_title[title_data["room_name"]] = title_data["debate_title"];
        });
    };
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
