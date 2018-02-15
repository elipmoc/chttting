const debateBaseSocket = require("./debateBaseSocket.js");
const debateDB = require("./debateDB.js");
const officialDebateDB = require("./officialDebateDB.js");

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.OfficialDiscussionNameSpace = class extends debateBaseSocket.DebateBaseNameSpace {
    constructor(namespace) {
        super(namespace);
        this._debateTitlleList;
        this._debateTitleIndex = 0;
        debateDB.roomNameSpaceToRoomId(namespace.name)
            .then(roomId => officialDebateDB.getOfficialDebateTitleList(roomId))
            .then(debateTitlleList => {
                this._debateTitlleList = debateTitlleList;
                this._debateTitle.debateTitle = debateTitlleList[0];
                this._startVote();
            }).catch(err => { throw err; });
    }

    onEndVote() {
        this._debateTitleIndex = (this._debateTitleIndex + 1) % this._debateTitlleList.length;
        this._debateTitle.debateTitle =
            this._debateTitlleList[this._debateTitleIndex];
        this.namespace.emit("titleSend", this._debateTitle.debateTitle);
        this._startVote();
    }
};
