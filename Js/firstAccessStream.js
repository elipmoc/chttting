const firstSocket = io("/firstLoadStream");
const urlLocation = document.location.href;
const urlParam = urlGetParamParse(urlLocation);
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
    JSON.parse(data).forEach(room => {
            if (room.room_name == urlParam["room_name"]) {
                $("#titlec").text(data["room_title"]).html();
            }
        }
    });
});
