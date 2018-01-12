let fs = require('fs');

exports.logPush = (room_name, msg) => {
    let logList = "";
    let readFile = exports.logRead(room_name);
    if (readFile == undefined) {
        logList = msg;
    }
    else {
        let i;
        if (readFile.length >= 10)
            i = readFile.length - 9
        else
            i = 0;
        for (i; i < readFile.length; i++) {
            logList += readFile[i] + '\n';
        }
        logList += msg;
    }
    let file = fs.writeFileSync("chatLog/" + room_name + ".txt", logList);
}

exports.logRead = (room_name) => {
    if (fs.existsSync("chatLog/" + room_name + ".txt") == false)
        return undefined;
    let file = fs.readFileSync("chatLog/" + room_name + ".txt");
    return file.toString().split('\n');
}
