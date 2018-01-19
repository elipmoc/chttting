var socket = io("/loadRoomSocket");
socket.on('loadRoomSocket', data) => {
    socket.emit('loadRoomSocket', data);
};

var loadRoomName = new loadRoomName("loadRoom", roomNameData);
function roomNameData(data){
data = "<h1>"+data+"</h1>";
$('#roomList').prepend(data);
}
