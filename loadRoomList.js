var socket = io("/loadRoomStream");
socket.emit('loadRoom', "");
socket.on('loadRoom', data => {
      JSON.parse(data).forEach(
            name => $('#roomList').prepend("<h1>" + name + "</h1>")
      );
});
