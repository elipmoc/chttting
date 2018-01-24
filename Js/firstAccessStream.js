const firstSocket = io("/firstLoadStream");
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
    let titlein = document.getElementById("titlec");
    titlein.innerText = $("#titlec").text(data);
});
