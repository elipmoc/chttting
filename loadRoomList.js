var socket = io("/loadRoomStream");
socket.on('loadRoom', data => {
      data = "<h1>" + data + "</h1>";
      $('#roomList').prepend(JSON.parse(data).forEach());
});
