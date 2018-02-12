//debateTitleを操作するクラス
exports.DebateTitle = class {
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
};

//投票結果をmsgで使用するjson文字列に加工する関数
exports.createVoteResultJsonStr = (voteControl) => {
    let leftCount = voteControl.leftCount;
    let rightCount = voteControl.rightCount;
    let json = {
        "name": "投票結果",
        "msg": "肯定=" + leftCount + " 否定=" + rightCount,
        "dipeType": leftCount > rightCount ? "debateLeft" : "debateRight",
        "uname": ""
    };
    return JSON.stringify(json);
};

//投票を管理するクラス
exports.VoteControl = class {
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
};

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
