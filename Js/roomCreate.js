const roomCreateSocket = io("/roomCreate");
roomCreateSocket.on('created', (data) => {
    document.location.href = "/";
});

$('#create_room').click(() => {
    let roomName = $("#roomName").val();
    let roomType = $("#roomType").val();
    if (roomName == "" || roomType == "")
        return;
    console.log(roomName + ":" + roomType);
    roomCreateSocket.emit('create', JSON.stringify({ "roomName": roomName, "roomType": roomType }));
});
