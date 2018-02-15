
const logDB = require("./logDB.js");
const socketUtil = require("./socketUtil.js");
const debateUtill = require("./debateUtill.js");

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.DebateBaseNameSpace = class {
    constructor(namespace) {
        this._voteControl = new debateUtill.VoteControl();
        this._debateTitle = new debateUtill.DebateTitle("ARRAYMA");
        this._voteFlag = false;
        //議論する時間
        this._voteStartTime = 3;
        //投票時間
        this._voteEndTime = 3;

        //投票秒数カウント
        this._secondCount = 0;

        this.namespace = namespace;

        this._startVote = () => {
            this._secondCount = this._voteStartTime;
            let startVoteCount = setInterval(() => {
                this._secondCount--;
                this.namespace.emit("startVoteSecond", this._secondCount);
                if (this._secondCount <= 0) {
                    clearInterval(startVoteCount);
                    this.namespace.emit("startVote", "");
                    this._voteFlag = true;
                    this._endVote();
                }
            }, 1000);
        };

        this._endVote = () => {
            this._secondCount = this._voteEndTime;
            let endVoteCount = setInterval(() => {
                this._secondCount--;
                this.namespace.emit("endVoteSecond", this._secondCount);
                if (this._secondCount <= 0) {
                    clearInterval(endVoteCount);
                    this._voteFlag = false;
                    this.onEndVote();
                    this.namespace.emit("endVote", "");
                    let msg = debateUtill.createVoteResultJsonStr(this._voteControl);
                    this.namespace.emit("msg", msg);
                    this._voteControl.reset();
                    logDB.logPush(this.namespace.name, msg);
                }
            }, 1000);
        };

    }

    //ソケットのイベント
    connectEvent(socket) {
        socket.on("firstTitleSend", (data) => {
            socket.emit("firstTitleSend", this._debateTitle.debateTitle);
        });
        socket.on("initVoteFlag", (data) => {
            socket.emit("initVoteFlag", this._voteFlag);
        });
        socket.on("vote", (data) => {
            this._voteControl.vote(data, socketUtil.getClientIP(socket));
        });
    }

    onEndVote() { }
};
