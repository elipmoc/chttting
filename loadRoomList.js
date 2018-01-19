var socket = io("/loadRoomStream");
socket.emit('loadRoom', "");
socket.on('loadRoom', data => {
      alert("hoge");
      JSON.parse(data).forEach(
            name => $('#roomList').prepend("<h1>" + name + "</h1>")
      );
});
