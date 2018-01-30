const chatSocketBase = require("./chatSocketBase.js");

exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._namespace = namespace;
        this._debate_title2 = "";
        namespace.on('connection', (socket) => {
            chatSocketBase.chatSocket(namespace)(socket);
            socket.on("titleSend", (title) => {
                let title_data = JSON.parse(title);
                this._debate_title2 = title_data["debate_title"];
                namespace.emit("titleSend", this._debate_title2);
                setTimeout(() => {
                    namespace.emit("startVote", "");
                }, 30 * 1000);
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debate_title2);
            });
        });
    }
}


//議題を定義するためのイベントをソケットにバインド
exports.bindDiscussionSocket = function (namespace) {
    this.debate_title2 = "";
    this.event = (socket) => {

    };
}