const getDbClient = require("./getDbClient.js");

exports.addOfficialDebateInfo = async (roomId, debateTitle) => {
    const client = getDbClient.get();
    client.connect();
    await client.query(
        "insert into official_debate_info (room_id,debate_title) values($1,$2);",
        [roomId, debateTitle]
    );
    client.end();
};

exports.getOfficialDebateTitleList = async (roomId) => {
    const client = getDbClient.get();
    client.connect();
    let res = await client.query(
        "select debate_title from official_debate_info where room_id=$1;",
        [roomId]
    );
    client.end();
    return res.rows.map(row => row.debate_title);
}