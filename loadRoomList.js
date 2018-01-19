var socket = io("/loadRoomSocket");
socket.on('loadRoomSocket', data => {
      data = "<h1>" + data + "</h1>";
      $('#roomList').prepend(data);
});
