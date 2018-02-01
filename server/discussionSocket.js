const logDB = require("./logDB.js");


function getUserIP(socket) {
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


exports.DiscussionNameSpace = class {
  constructor(namespace) {
    //投票者のIPを保存するリスト
    this._votersIpList = {};
    this._debate_title = "";
    this._voteFlag = false;

    //投票数のカウント
    this._leftCount = 0;
    this._rightCount = 0;

    //ソケットのイベント
    this.event = (socket) => {
      socket.on("titleSend", (title) => {
        if (this._debate_title != "")
          return;
        this._leftCount = 0;
        this._rightCount = 0;
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
            this._votersIpList = {};
            let msg = createVoteResultJsonStr(this._leftCount, this._rightCount);
            namespace.emit("msg", msg);
            logDB.logPush(namespace.name, msg);
          }, 10 * 1000);
        }, 10 * 1000);
      });
      socket.on("firstTitleSend", (titleData) => {
        socket.emit("firstTitleSend", this._debate_title);
      });
      socket.on("initVoteFlag", (voteFlag) => {
        socket.emit("initVoteFlag", this._voteFlag);
      })
      socket.on("vote", (voteData) => {
        let ip = getUserIP(socket);
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
