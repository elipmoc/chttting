var socket = io("/loadRoomSocket");
socket.on('loadRoomSocket', data) => {
    socket.emit('loadRoomSocket', data);
};
