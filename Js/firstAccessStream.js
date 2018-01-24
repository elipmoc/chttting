const socket = io("/firstLoadStream");
socket.emit('firstSend', "");
socket.on('firstSend', data => {
    let titlein = document.getElementById("titlec");
    titlein.innerHTML = data;
});
