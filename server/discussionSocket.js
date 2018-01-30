
exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._debate_title = "";
        this._voteFlag = false;
        this.event = (socket) => {
            socket.on("titleSend", (title) => {
                if (this._debate_title != "")
                    return;
                this._debate_title = title;
                namespace.emit("titleSend", this._debate_title);
                setTimeout(() => {
                    namespace.emit("startVote", "");
                    this._voteFlag = true;
                    setTimeout(() => {
                        this._voteFlag = false;
                        this._debate_title = "";
                        namespace.emit("titleSend", this._debate_title);
                        namespace.emit("endVote", "");
                    }, 10 * 1000);
                }, 10 * 1000);
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debate_title);
            });
            socket.on("initVoteFlag", (data) => {
                socket.emit("initVoteFlag", this._voteFlag);
            })
        };
    }
}