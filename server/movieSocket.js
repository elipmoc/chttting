const escape = require('escape-html');


//ディスカッション名前空間にソケットイベントをバインドするクラス
exports.movieNameSpace = class {
    constructor(namespace) {
        //ソケットのイベント
        this.connectEvent = (socket) => {
            socket.on("urlSend", (urlStr) => {
                namespace.emit("urlSend", escape(urlStr));
            });
        };
    }
}
