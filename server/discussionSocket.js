
exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._debate_title = "";
        this.event = (socket) => {
            socket.on("titleSend", (title) => {
                this._debate_title = title;
                namespace.emit("titleSend", this._debate_title);
                setTimeout(() => {
                    namespace.emit("startVote", "");
                }, 30 * 1000);
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debate_title);
            });
        };
    }
}