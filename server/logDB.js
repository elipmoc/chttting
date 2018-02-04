const getDbClient = require("./getDbClient.js");

exports.logPush = async (roomNameSpace, msg) => {
    if (roomNameSpace[0] != '/')
        throw "room_nameに/がついていません";
    let roomName = roomNameSpace.slice(1);
    const client = getDbClient.get();
    client.connect();
    let res = await client.query("select * from room where room_name ='" + roomName + "';");
    if (res.rows.length != 1) throw "room名" + roomName + "が重複しています:" + res.rows.length;
    let id = res.rows[0]["room_id"];
    await client.query(
        "insert into msg (room_id,msg_data,msg_time) values ($1,$2,current_timestamp);",
        [Number(id), msg]
    );
    res = await client.query("select count(*) from msg where room_id=$1;", [id]);
    if (res.rows[0]["count"] > 30) {
        res = await client.query(
            "select msg_id from msg where room_id=$1 order by msg_time offset 0 limit 1;",
            [Number(id)]
        );
        await client.query("delete from msg where msg_id=$1;", [res.rows[0]["msg_id"]]);
    }
    client.end();
}


exports.logRead = async (roomNameSpace) => {
    if (roomNameSpace[0] != '/')
        throw "room_nameに/がついていません";
    let roomName = roomNameSpace.slice(1);
    const client = getDbClient.get();
    client.connect();
    let res = await client.query("select * from room where room_name ='" + roomName + "';");
    if (res.rows.length != 1)
        throw "room名" + roomName + "が重複しています:" + res.rows.length;
    let id = res.rows[0]["room_id"];
    res = await client.query("select msg_data from msg where room_id=$1 order by msg_time;", [Number(id)]);
    client.end();
    return res.rows.map(row => row["msg_data"]);
}
