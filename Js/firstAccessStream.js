const firstSocket = io("/firstLoadStream");
const urlParam = urlGetParamParse(urlLocation);
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
    JSON.parse(data).forEach(room => {
        alert(room.room_name);
        alert(room.debate_title);
        if (room.room_name == urlParam["room_name"]) {
            $("#titlec").text(room.debate_title).html();

        }
    });
});
