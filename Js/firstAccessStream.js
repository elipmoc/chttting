const firstSocket = io("/firstLoadStream");
firstSocket.emit('firstSend', "");
firstSocket.on('firstSend', (data) => {
    let titlein = document.getElementById("titlec");
    titlein.innerTEXT = $("#titlec").text(data).html();
});
