//socketからIPaddressを取得する関数
exports.getClientIP = (socket) => {
    let ip = socket.handshake.headers['x-forwarded-for'];
    if (ip == undefined)
        ip = "localhost";
    return ip;
}