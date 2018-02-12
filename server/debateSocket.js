
const debateBaseSocket = require("./debateBaseSocket.js");
const debateDB = require("./debateDB.js");

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.DiscussionNameSpace = class extends debateBaseSocket.DebateBaseNameSpace {
    constructor(namespace) {
        super(namespace);
        debateDB.roomNameSpaceToRoomId(namespace.name)
            .then(roomId => debateDB.getDebateInfo(roomId))
            .then(debateInfo => {
                this._voteStartTime = debateInfo.vote_start_time;
                this._voteEndTime = debateInfo.vote_end_time;
                return Promise.resolve();
            }).catch(e => { throw e; });
    }

    //ソケットのイベント
    connectEvent(socket) {
        socket.on("titleSend", (title) => {
            if (this._debateTitle.isDefaultTitle() == false)
                return;
            this._debateTitle.debateTitle = title;
            this.namespace.emit("titleSend", this._debateTitle.debateTitle);
            this._startVote();
        });
        super.connectEvent(socket);
    }

    onEndVote() {
        this._debateTitle.setDefaultTitle();
        this.namespace.emit("titleSend", this._debateTitle.debateTitle);
    }
};
