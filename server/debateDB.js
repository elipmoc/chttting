const getDbClient = require("./getDbClient.js");

exports.roomNameSpaceToRoomId = (roomNameSpace) => {
    if (roomNameSpace[0] != '/') {
        throw "room_nameに/がついていません";
    }
    let roomName = roomNameSpace.slice(1);
    const client = getDbClient.get();
    client.connect();
    return client.query("select * from room where room_name =$1;", [roomName])
        .then(res => {
            client.end();
            return Promise.resolve(res.rows[0]["room_id"]);
        })
}

exports.addDebateInfo = (roomId, voteStartTime, voteEndTime) => {
    const client = getDbClient.get();
    client.connect();
    client.query(
        "insert into debate_info (room_id,vote_start_time,vote_end_time) values($1,$2,$3);",
        [roomId, voteStartTime, voteEndTime]
    )
        .then(res => client.end())
        .catch(e => { throw e; });
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

exports.getDebateInfo = (roomId) => {
    const client = getDbClient.get();
    client.connect();
    return client.query(
        "select vote_start_time,vote_end_time from debate_info where room_id=$1;",
        [roomId]
    )
        .then(res => {
            client.end();
            return Promise.resolve(res.rows[0]);
        })
        .catch(e => { throw e });
}


