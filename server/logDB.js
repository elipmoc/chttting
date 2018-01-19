const {
    Client
} = require('pg');
const fs = require('fs');



exports.logPush_div = (room_name, msg) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    client.connect();
    client.query("select * from room where room_name ='" + room_name + "';", (err, res) => {
        if (err) throw err;
        if (res.rows.length != 1) throw "room名が重複しています";
        let id = res.rows["room_id"];
        client.query("insert into msg (room_id,msg_data) values ($1::integer,$2::varchar);", [id, msg], (err, res) => {
            if (err) throw err;
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
