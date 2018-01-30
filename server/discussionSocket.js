//議題を定義するためのイベントをソケットにバインド
exports.bindDiscussionSocket = function (namespace) {
    this.debate_title2 = "";
    this.event = (socket) => {
        socket.on("titleSend", (title) => {
            let title_data = JSON.parse(title);
            debate_title2 = title_data["debate_title"];
            namespace.emit("titleSend", debate_title2);
            setTimeout(() => {
                namespace.emit("startVote", "");
            }, 30 * 1000);
        });
        socket.on("firstTitleSend", (data) => {
            socket.emit("firstTitleSend", debate_title2);
        });
    };
}