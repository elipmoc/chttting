const {
    Client
} = require('pg');
const fs = require('fs');

exports.logPush_div = (roomNameSpace, msg) => {
    if (roomNameSpace[0] != '/') {
        throw "room_nameに/がついていません";
    }
    let roomName = roomNameSpace.slice(1);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    client.connect();
    client.query("select * from room where room_name ='" + roomName + "';", (err, res) => {
        if (err) throw err;
        if (res.rows.length != 1) throw "room名" + roomName + "が重複しています:" + res.rows.length;
        let id = res.rows[0]["room_id"];
        client.query("insert into msg (room_id,msg_data) values ($1,$2);", [Number(id), msg], (err, res) => {
            if (err) throw err;
            client.end();
        });
    });
}

exports.logRead_div = (roomNameSpace, func) => {
    if (roomNameSpace[0] != '/') {
        throw "room_nameに/がついていません";
    }
    let roomName = roomNameSpace.slice(1);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    client.connect();
    client.query("select * from room where room_name ='" + roomName + "';", (err, res) => {
        if (err) throw err;
        if (res.rows.length != 1) throw "room名" + roomName + "が重複しています:" + res.rows.length;
        let id = res.rows[0]["room_id"];
        client.query("select msg_data from msg where room_id=$1;", [Number(id)], (err, res) => {
            if (err) throw err;
            func(res.rows.map(row["msg_data"]));
            client.end();
        });
    });
}

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
    let file = fs.writeFileSync("/tmp/" + room_name + ".txt", logList);
}

exports.logRead = (room_name) => {
    if (fs.existsSync("/tmp/" + room_name + ".txt") == false)
        return undefined;
    let file = fs.readFileSync("/tmp/" + room_name + ".txt");
    return file.toString().split('\n');
}
