const roomCreateSocket = io("/roomCreate");
roomCreateSocket.on('created', (data) => {
    if (data == "")
        document.location.href = "/";
    else document.write(data + "<br><a href='/'>メインページに戻る</a>");
});

$('#create_room').click(() => {
    let roomName = $("#roomName").val();
    let roomType = $("#roomType").val();
    if (roomName == "" || roomType == "")
        return;
    console.log(roomName + ":" + roomType);
    roomCreateSocket.emit('create', JSON.stringify({ "roomName": roomName, "roomType": roomType }));
});
