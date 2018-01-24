const socket = io("/firstLoadStream");
socket.emit("firstSend", "");
socket.on("firstSend", (data) => {
    document.getElementById("#titlec").innerHTML = data;
});
