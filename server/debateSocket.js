
const logDB = require("./logDB.js");
const socketUtil = require("./socketUtil.js");
const debateDB = require("./debateDB.js");
const debateUtill = require("./DebateUtill.js");

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._voteControl = new debateUtill.VoteControl();
        this._debateTitle = new debateUtill.DebateTitle("ARRAYMA");
        this._voteFlag = false;
        //議論する時間
        this._voteStartTime = 10;
        //投票時間
        this._voteEndTime = 10;

        debateDB.roomNameSpaceToRoomId(namespace.name)
            .then(roomId => debateDB.getDebateInfo(roomId))
            .then(debateInfo => {
                this._voteStartTime = debateInfo.vote_start_time;
                this._voteEndTime = debateInfo.vote_end_time;
                return Promise.resolve();
            }).catch(e => { throw e; });

        //投票秒数カウント
        this._secondCount = 0;

        this._startVote = () => {
            this._secondCount = this._voteStartTime;
            let startVoteCount = setInterval(() => {
                this._secondCount--;
                namespace.emit("startVoteSecond", this._secondCount);
                if (this._secondCount <= 0) {
                    clearInterval(startVoteCount);
                    namespace.emit("startVote", "");
                    this._voteFlag = true;
                    this._endVote();
                }
            }, 1000);
        };

        this._endVote = () => {
            this._secondCount = this._voteEndTime;
            let endVoteCount = setInterval(() => {
                this._secondCount--;
                namespace.emit("endVoteSecond", this._secondCount);
                if (this._secondCount <= 0) {
                    clearInterval(endVoteCount);
                    this._voteFlag = false;
                    this._debateTitle.setDefaultTitle();
                    namespace.emit("titleSend", this._debateTitle.debateTitle);
                    namespace.emit("endVote", "");
                    let msg = debateUtill.createVoteResultJsonStr(this._voteControl);
                    namespace.emit("msg", msg);
                    this._voteControl.reset();
                    logDB.logPush(namespace.name, msg);
                }
            }, 1000);
        };

        //ソケットのイベント
        this.connectEvent = (socket) => {
            socket.on("titleSend", (title) => {
                if (this._debateTitle.isDefaultTitle() == false)
                    return;
                this._debateTitle.debateTitle = title;
                namespace.emit("titleSend", this._debateTitle.debateTitle);
                this._startVote();
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debateTitle.debateTitle);
            });
            socket.on("initVoteFlag", (data) => {
                socket.emit("initVoteFlag", this._voteFlag);
            });
            socket.on("vote", (data) => {
                this._voteControl.vote(data, socketUtil.getClientIP(socket));
            });
        };
    }
};
