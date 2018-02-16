const escape = require('escape-html');


//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.movieNameSpace = class {
    constructor(namespace) {
        this._urlStr = "https://www.youtube.com/watch?v=AN3YqXbWgOs";
        //ソケットのイベント
        this.connectEvent = (socket) => {
            socket.on("urlSend", (urlStr) => {
                this._urlStr = escape(urlStr);
                namespace.emit("urlSend", this._urlStr);
            });
        };
    }
};
