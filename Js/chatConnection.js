
class ChatConnection {
    constructor(namespace, msgReceiveCallBack) {
        this._socket = io("/" + namespace);
        this._logSaveFlag = true;
        this._userData = undefined;
        this._socket.on('msg', msgReceiveCallBack);
        //ログをサーバーに要求
        this._socket.on('initMsg', (dataListJson) => {
            if (dataListJson != undefined)
                JSON.parse(dataListJson).forEach(msgReceiveCallBack);
        });
        this._socket.emit('initMsg', "");
    }

    get socket() { return this._socket; }

    get logSaveFlag() { return this._logSaveFlag; }
    set logSaveFlag(value) { this._logSaveFlag = value; }

    setUserData(userData) { this._userData = userData; }

    sendData(data) {
        this._socket.emit('msg', JSON.stringify({
            "msg": data,
            "logSaveFlag": this._logSaveFlag,
            "userData": this._userData
        }));
    }
}
