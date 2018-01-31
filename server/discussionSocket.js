
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



exports.DiscussionNameSpace = class {
    constructor(namespace) {
        //投票者のIPを保存するリスト
        this._votersIpList = {};
        this._debate_title = "";
        this._voteFlag = false;

        //投票数のカウント
        this._leftCount = 0;
        this._rightCount = 0;

        //秒数カウント
        this._secondCount = 0;

        this._startVote = () => {
            this._secondCount = voteSecondInterval;
            let interval = setInterval(() => {
                this._secondCount--;
                if (this._secondCount <= 0) {
                    clearInterval(interval);
                    namespace.emit("startVote", "");
                    this._voteFlag = true;
                    setTimeout(() => {
                        this._voteFlag = false;
                        this._debate_title = "";
                        namespace.emit("titleSend", this._debate_title);
                        namespace.emit("endVote", "");
                        this._votersIpList = {};
                        let msg = createVoteResultJsonStr(this._leftCount, this._rightCount);
                        namespace.emit("msg", msg);
                        logDB.logPush(namespace.name, msg);
                    }, 10 * 1000);
                }
            }, 1000);
        };

        //ソケットのイベント
        this.event = (socket) => {
            socket.on("titleSend", (title) => {
                if (this._debate_title != "")
                    return;
                this._leftCount = 0;
                this._rightCount = 0;
                this._debate_title = title;
                namespace.emit("titleSend", this._debate_title);
                this._startVote();
            });
            socket.on("firstTitleSend", (data) => {
                socket.emit("firstTitleSend", this._debate_title);
            });
            socket.on("initVoteFlag", (data) => {
                socket.emit("initVoteFlag", this._voteFlag);
            })
            socket.on("vote", (data) => {
                let ip = getClientIP(socket);
                if (this._votersIpList[ip] != true) {
                    if (data == "left")
                        this._leftCount++;
                    else if (data == "right")
                        this._rightCount++;
                    this._votersIpList[ip] = true;
                }
            })
        };
    }
}
