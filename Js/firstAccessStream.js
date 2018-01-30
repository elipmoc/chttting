chatConnection.socket.emit('firstTitleSend', "");
chatConnection.socket.on('firstTitleSend', (data) => {
    data = JSON.parse(data);
    $("#titlec").text(data[urlParam["roomName"]]).html();
});
