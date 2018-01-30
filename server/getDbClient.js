const {
    Client
} = require('pg');

exports.get = () => {
    if (process.env.DATABASE_URL == undefined) {
        return new Client({
            connectionString: "tcp://postgres@localhost:5432/mydb"
        });
    }
    else {
        return new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    }
}