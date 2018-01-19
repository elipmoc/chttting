var socket = io("/loadRoomStream");
socket.on('loadRoom', data => {
      JSON.parse(data).forEach(
            name => $('#roomList').prepend("<h1>" + name + "</h1>")
      );
});
