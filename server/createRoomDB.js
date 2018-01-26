const {
    Client
} = require('pg');

exports.createRoom = (roomName, roomType) => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    client.connect();
    client.query("select count(*) from room where room_name =$1;", [roomName], (err, res) => {
        if (err) throw err;
        console.log(res);
        client.end();
    });

}