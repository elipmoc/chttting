
const logDB = require("./logDB.js");

//socketからIPaddressを取得する関数
function getClientIP(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'];
    if (ip == undefined)
        ip = socket.handshake.address;
    return ip;
}

//投票結果をmsgで使用するjson文字列に加工する関数
function createVoteResultJsonStr(voteControl) {
    let leftCount = voteControl.leftCount;
    let rightCount = voteControl.rightCount;
    let json = {
        "msg": "投票結果：肯定=" + leftCount + " 否定=" + rightCount,
        "dipeType": leftCount > rightCount ? "debateLeft" : "debateRight",
        "uname": ""
    };
    return JSON.stringify(json);
}

//投票する期間
const voteSecondInterval = 10;

//debateTitleを操作するクラス
class DebateTitle {
    constructor(defaultTitle) {
        this._defaultTitle = defaultTitle;
        this._defaultFlag = true;
        this._debateTitle = defaultTitle;
    }

    get debateTitle() { return this._debateTitle; }
    set debateTitle(value) { this._debateTitle = value; this._defaultFlag = false; }
    setDefaultTitle() {
        this._debateTitle = this._defaultTitle;
        this._defaultFlag = true;
    }
    isDefaultTitle() { return this._defaultFlag; }
}

//投票者のIpリストを操作するクラス
class VotersIpList {
    constructor() {
        this._ipList = {};
    }
    exsistIp(ip) {
        return this._ipList[ip] == true;
    }
    resistIp(ip) {
        this._ipList[ip] = true;
    }
    clear() {
        this._ipList = {};
    }
}

//投票を管理するクラス
class VoteControl {
    constructor() {
        //投票数のカウント
        this._leftCount = 0;
        this._rightCount = 0;
        //投票者のIPを保存するリスト
        this._votersIpList = new VotersIpList();
    }
    vote(voteType, ip) {
        if (this._votersIpList.exsistIp(ip) == false) {
            if (voteType == "left")
                this._leftCount++;
            else if (voteType == "right")
                this._rightCount++;
            this._votersIpList.resistIp(ip);
        }
    }
    reset() {
        this._leftCount = 0;
        this._rightCount = 0;
        this._votersIpList.clear();
    }

    get leftCount() { return this._leftCount; }
    get rightCount() { return this._rightCount; }
}

//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.DiscussionNameSpace = class {
    constructor(namespace) {
        this._voteControl = new VoteControl();
        this._debateTitle = new DebateTitle("ARRAYMA");
        this._voteFlag = false;

        //投票秒数カウント
        this._secondCount = 0;

        this._startVote = () => {
            this._secondCount = voteSecondInterval;
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
            this._secondCount = voteSecondInterval;
            let endVoteCount = setInterval(() => {
                this._secondCount--;
                namespace.emit("endVoteSecond", this._secondCount);
                if (this._secondCount <= 0) {
                    clearInterval(endVoteCount);
                    this._voteFlag = false;
                    this._debateTitle.setDefaultTitle();
                    namespace.emit("titleSend", this._debateTitle.debateTitle);
                    namespace.emit("endVote", "");
                    let msg = createVoteResultJsonStr(this._voteControl);
                    namespace.emit("msg", msg);
                    this._voteControl.reset();
                    logDB.logPush(namespace.name, msg);
                }
            }, 1000);
        }

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
                this._voteControl.vote(data, getClientIP(socket));

            });
            socket.on("disconnect", () => {
                console.log("dis");
            });
        };
    }
}
