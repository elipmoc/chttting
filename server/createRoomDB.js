const getDbClient = require("./getDbClient.js");

exports.createRoom = (roomName, roomType, description, roomInfo, func) => {
    const client = getDbClient.get();
    client.connect();
    client.query("select count(*) from room where room_name =$1;", [roomName], (err, res) => {
        if (err) throw err;
        if (res.rows[0].count != 0) {
            func(false);
            client.end();
            return;
        }
        client.query("insert into room(room_name,room_type,description) values($1,$2,$3);", [roomName, roomType, description], (err, res) => {
            if (err) {
                func(false);
                client.end();
                return;
            }
            client.query("select room_id from room where room_name=$1;", [roomName], (err, res) => {
                if (err) {
                    func(false);
                    client.end();
                    return;
                }
                let roomId = res.rows[0].room_id;
                createRoomInfo(roomId, roomType, roomInfo);
                func(true);
                client.end();
            });
        });
    });

}

function createRoomInfo(roomId, roomType, roomInfo) {
    if (roomType == "discussion_free") {
        const client = getDbClient.get();
        client.connect();
        client.query(
            "insert into debate_info (room_id,vote_start_time,vote_end_time) values($1,$2,$3);",
            [roomId, roomInfo.voteStartTime, roomInfo.voteEndTime], (err, res) => {
                if (err) throw err;
                client.end();
            }
        );

    }
}