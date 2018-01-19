var socket = io("/loadRoomSocket");
socket.on('loadRoomSocket', data) => {
    socket.emit('loadRoomSocket', data);
};

var loadRoomName = new loadRoomName("loadRoom", roomNameData);
function roomNameData(data){
$('#roomList').prepend(data);
}
