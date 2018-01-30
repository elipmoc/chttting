
exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._debate_title2 = "";
        this.event = (socket) => {
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
        };
    }
}