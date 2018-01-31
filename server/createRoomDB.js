const getDbClient = require("./getDbClient.js");

exports.createRoom = (roomName, roomType,description, func) => {
    const client = getDbClient.get();
    client.connect();
    client.query("select count(*) from room where room_name =$1;", [roomName], (err, res) => {
        if (err) throw err;
        if (res.rows[0].count != 0) {
            func(false);
            client.end();
            return;
        }
        client.query("insert into room(room_name,room_type,description) values($1,$2,$3);", [roomName, roomType,description], (err, res) => {
            if (err) {
                func(false);
                client.end();
                return;
            }
            func(true);
            client.end();
        });
    });

}
