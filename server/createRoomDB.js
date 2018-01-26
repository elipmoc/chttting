const {
    Client
} = require('pg');

exports.createRoom = (roomName, roomType, func) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    client.connect();
    client.query("select count(*) from room where room_name =$1;", [roomName], (err, res) => {
        if (err) throw err;
        if (res.rows[0].count != 0)
            return false;
        client.query("insert into room(room_name,room_type) values($1,$2);", [roomName, roomType], (err, res) => {
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