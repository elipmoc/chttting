const getDbClient = require("./getDbClient.js");
const debateDB = require("./debateDB.js");

exports.createRoom = async (roomName, roomType, description, roomInfo) => {
    const client = getDbClient.get();
    client.connect();
    try {
        let res = await client.query("select count(*) from room where room_name =$1;", [roomName]);
        if (res.rows[0].count != 0)
            throw ("すでに部屋が存在します");
        await client.query(
            "insert into room(room_name,room_type,description) values($1,$2,$3);",
            [roomName, roomType, description]
        );
        res = await client.query("select room_id from room where room_name=$1;", [roomName]);
        let roomId = res.rows[0].room_id;
        await createRoomInfo(roomId, roomType, roomInfo);
        client.end();
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

async function createRoomInfo(roomId, roomType, roomInfo) {
    if (roomType == "discussion_free") {
        const client = getDbClient.get();
        client.connect();
        await debateDB.addDebateInfo(roomId, roomInfo.voteStartTime, roomInfo.voteEndTime);
        client.end();
    }
}