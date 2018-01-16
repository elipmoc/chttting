
class ChatConnection {
    constructor(namespace, msgReceiveCallBack) {
        this._socket = io("/" + namespace);
        this._socket.on('initMsg', (dataListJson) => {
            JSON.parse(dataListJson).forEach(msgReceiveCallBack);
        });

        this._socket.on('msg', msgReceiveCallBack);
        //ログをサーバーに要求
        this._socket.emit('initMsg', "");
    }
    sendData(data) {
        this._socket.emit('msg', data);
    }

}