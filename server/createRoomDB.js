const getDbClient = require("./getDbClient.js");
const debateDB = require("./debateDB.js");

exports.createRoom = (roomName, roomType, description, roomInfo) => {
    const client = getDbClient.get();
    client.connect();
    return client.query("select count(*) from room where room_name =$1;", [roomName])
        .then(res => {
            if (res.rows[0].count != 0)
                return Promise.reject("すでに部屋が存在します");
            return Promise.resolve();
        })
        .then(() =>
            client.query(
                "insert into room(room_name,room_type,description) values($1,$2,$3);",
                [roomName, roomType, description])
        )
        .then(() => client.query("select room_id from room where room_name=$1;", [roomName]))
        .then(res => {
            let roomId = res.rows[0].room_id;
            return createRoomInfo(roomId, roomType, roomInfo);
        })
        .then(() => {
            client.end();
            return Promise.resolve();
        })
        .catch(err => {
            console.log(err);
            client.end();
            return Promise.reject(err);
        });
}

function createRoomInfo(roomId, roomType, roomInfo) {
    if (roomType == "discussion_free") {
        const client = getDbClient.get();
        client.connect();
        return debateDB.addDebateInfo(roomId, roomInfo.voteStartTime, roomInfo.voteEndTime)
            .then((res) => {
                client.end();
                return Promise.resolve();
            })
            .catch((err) => {
                client.end();
                return Promise.reject(err);
            }
            );
    }
    return Promise.resolve();
}