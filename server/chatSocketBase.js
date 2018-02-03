const logDB = require('./logDB.js');
const socketUtil = require("./socketUtil.js");

//参加者を管理するクラス
class UserList {
    constructor() {
        this._userList = {};
        this._callBack;
    }
    deleteUser(ip) {
        if (this._userList.hasOwnProperty(ip)) {
            delete this._userList[ip];
            this._callBack();
        }
    }
    resistUser(ip) {
        this._userList[ip] = undefined;
        this._callBack();
    }
    setUserName(ip, name) {
        if (this._userList[ip] != name) {
            this._userList[ip] = name;
            this._callBack();
        }
    }
    onUpdate(callBack) {
        this._callBack = callBack;
    }

    get userDataListJsonStr() {
        let userDataList = new Array();
        for (let key in this._userList) {
            userDataList.push(this._userList[key]);
        }
        return JSON.stringify(userDataList);
    }
}

//チャットをするためのソケット群
exports.chatBaseNameSpace = class {
    constructor(namespace) {
        this._userList = new UserList();
        this._userList.onUpdate(() => {
            namespace.emit("userListUpdate", this._userList.userDataListJsonStr);
        });
        this.connectEvent = (socket) => {

            this._userList.resistUser(socketUtil.getClientIP(socket));

            //ログ管理
            socket.on(
                'msg',
                (data) => {
                    data = JSON.parse(data);
                    if (data["msg"].length > 500)
                        return;
                    this._userList.setUserName(socketUtil.getClientIP(socket), data["userData"]);
                    namespace.emit('msg', data["msg"]);
                    if (data["logSaveFlag"])
                        logDB.logPush(namespace.name, data["msg"]);
                }
            );
            //発言するためのソケット
            socket.on(
                'initMsg',
                (data) => {
                    logDB.logRead(namespace.name)
                        .then(msgList =>
                            socket.emit('initMsg', JSON.stringify(msgList))
                        )
                        .catch(e => { throw e; });
                }
            );
            socket.on("disconnect", () => {
                this._userList.deleteUser(socketUtil.getClientIP(socket));
            });
        }
    }
}