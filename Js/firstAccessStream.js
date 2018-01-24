const socket = io("/firstLoadStream");
socket.emit("firstSend", "");
socket.on("firstSend", (data) => {
    let title = document.getElementById("#titlec");
    title.innerHTML = data;
});
