

const logDB = require("./logDB.js");


function getClientIP(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'];
    if (ip == undefined)
        ip = socket.handshake.address;
    return ip;
}


function createVoteResultJsonStr(leftCount, rightCount) {
    let json = {
        "msg": "投票結果：肯定=" + leftCount + " 否定=" + rightCount,
        "dipeType": leftCount > rightCount ? "debateLeft" : "debateRight",
        "uname": ""
    };
    return JSON.stringify(json);
}

//投票する期間
const voteSecondInterval = 10;

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

exports.DiscussionNameSpace = class {
    constructor(namespace) {
        //投票者のIPを保存するリスト
        this._votersIpList = new VotersIpList();
        this._debateTitle = new DebateTitle("ARRAYMA");
        this._voteFlag = false;

        //投票数のカウント
        this._leftCount = 0;
        this._rightCount = 0;

        //秒数カウント
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
                    this._votersIpList.clear();
                    let msg = createVoteResultJsonStr(this._leftCount, this._rightCount);
                    namespace.emit("msg", msg);
                    logDB.logPush(namespace.name, msg);
                }
            }, 1000);
        }

        //ソケットのイベント
        this.event = (socket) => {
            socket.on("titleSend", (title) => {
                if (this._debateTitle.isDefaultTitle() == false)
                    return;
                this._leftCount = 0;
                this._rightCount = 0;
                this._debateTitle.debateTitle = title;
                namespace.emit("titleSend", this._debateTitle.debateTitle);
                this._startVote();
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debateTitle.debateTitle);
            });
            socket.on("initVoteFlag", (data) => {
                socket.emit("initVoteFlag", this._voteFlag);
            })
            socket.on("vote", (data) => {
                let ip = getClientIP(socket);
                if (this._votersIpList.exsistIp(ip) == false) {
                    if (data == "left")
                        this._leftCount++;
                    else if (data == "right")
                        this._rightCount++;
                    this._votersIpList.resistIp(ip);
                }
            })
        };
    }
}
