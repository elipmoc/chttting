const logDB = require('./logDB.js');
//チャットをするためのソケット群
exports.chatBaseNameSpace = class {
    constructor(namespace) {
        this.connectEvent = (socket) => {
            //ログ管理
            socket.on(
                'msg',
                function (data) {
                    data = JSON.parse(data);
                    if (data["msg"].length > 500)
                        return;
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
        }
    }
}