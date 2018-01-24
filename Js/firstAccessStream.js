const socket = io("/firstLoadStream");
socket.emit("firstSend", "");
socket.on("firstSend", (data) => {
    $("#titlec").prepend(data);
});
