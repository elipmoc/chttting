const getDbClient = require("./getDbClient.js");

exports.roomNameSpaceToRoomId = async (roomNameSpace) => {
    if (roomNameSpace[0] != '/')
        throw "room_nameに/がついていません";
    let roomName = roomNameSpace.slice(1);
    const client = getDbClient.get();
    client.connect();
    let res = await client.query("select * from room where room_name =$1;", [roomName]);
    client.end();
    return res.rows[0]["room_id"];
};

exports.addDebateInfo = async (roomId, voteStartTime, voteEndTime) => {
    const client = getDbClient.get();
    client.connect();
    await client.query(
        "insert into debate_info (room_id,vote_start_time,vote_end_time) values($1,$2,$3);",
        [roomId, voteStartTime, voteEndTime]
    );
    client.end();
}

exports.removeDebateInfo = (roomId) => {
    const client = getDbClient.get();
    client.connect();
    client.query(
        "delete from debate_info where room_id=$1;",
        [roomId]
    )
        .then(res => client.end())
        .catch(e => { throw e });
}

exports.getDebateInfo = async (roomId) => {
    const client = getDbClient.get();
    client.connect();
    let res = await client.query(
        "select vote_start_time,vote_end_time from debate_info where room_id=$1;",
        [roomId]
    );
    client.end();
    return res.rows[0];
}


