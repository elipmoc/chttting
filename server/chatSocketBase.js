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
        this._userList[ip] = "none";
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

    get userListStr() {
        let str = "";
        for (let key in this._userList) {
            str += "[" + this._userList[key] + "]";
        }
        return str;
    }
}

//チャットをするためのソケット群
exports.chatBaseNameSpace = class {
    constructor(namespace) {
        this._userList = new UserList();
        this._userList.onUpdate(() => {
            namespace.emit("userListUpdate", this._userList.userListStr);
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
                    this._userList.setUserName(socketUtil.getClientIP(socket), data["userName"]);
                    namespace.emit('msg', data["msg"]);
                    if (data["logSaveFlag"])
                        logDB.logPush(namespace.name, data["msg"]);
                }
            );
            //発言するためのソケット
            socket.on(
                'initMsg',
                function (data) {
                    socket.emit(
                        'initMsg',
                        logDB.logRead(namespace.name, msgList =>
                            socket.emit('initMsg', JSON.stringify(msgList))
                        )
                    );
                }
            );
            socket.on("disconnect", () => {
                this._userList.deleteUser(socketUtil.getClientIP(socket));
            });
        }
    }
}